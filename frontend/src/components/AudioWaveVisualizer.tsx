import React, { useEffect, useRef } from "react";

const PENDULUM_SPEED = 0.002;
const PENDULUM_AMP_MOD_AMOUNT = 0.4;
const K_SCALE_FACTOR = Math.PI / 50000;
const PENDULUM_K_MOD_AMOUNT = 0.35;
const MIN_VISUAL_AMP = 10;
const MAX_VISUAL_AMP = 100;
const LOUDNESS_SMOOTHING_FACTOR = 0.5;
const FREQUENCY_SMOOTHING_FACTOR = 0.05;
const WAVE_FLOW_SPEED = 0.015;
const SILENCE_THRESHOLD_AMP = 15;

interface AudioWaveVisualizerProps {
  size: {
    width: number;
    height: number;
  };
}

const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({ size }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array>(new Uint8Array(0));
  const amplitudeArrayRef = useRef<Uint8Array>(new Uint8Array(0));
  const smoothedLoudnessRef = useRef<number>(0.1);
  const smoothedFreqRef = useRef<number>(100);
  const phaseRef = useRef<number>(0);

  const initializeAudio = () => {
    smoothedLoudnessRef.current = 0.1;
    smoothedFreqRef.current = 100;

    const audioContext = new window.AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    amplitudeArrayRef.current = new Uint8Array(bufferLength);

    const source = audioContext.createMediaElementSource(audioRef.current!);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioRef.current!.onplay = () => {
      if (audioContext.state === "suspended") audioContext.resume();
      cancelAnimationFrame(animationRef.current);
      draw();
    };
    audioRef.current!.onpause = () =>
      cancelAnimationFrame(animationRef.current);
    audioRef.current!.onended = () =>
      cancelAnimationFrame(animationRef.current);
  };

  const getLoudness = (): number => {
    const ampArr = amplitudeArrayRef.current;

    const analyser = analyserRef.current!;
    analyser.getByteFrequencyData(ampArr);

    const avg = ampArr.reduce((sum, v) => sum + v, 0) / ampArr.length;
    return Math.min(1, Math.max(0, avg / 80));
  };

  const draw = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const analyser = analyserRef.current!;
    const dataArr = dataArrayRef.current;

    animationRef.current = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArr);

    let maxAmp = 0;
    let domIdx = 0;
    dataArr.forEach((v, i) => {
      if (v > maxAmp) {
        maxAmp = v;
        domIdx = i;
      }
    });

    const nyquist = audioContextRef.current!.sampleRate / 2;
    const freqPerBin = nyquist / analyser.frequencyBinCount;
    const rawFreq = domIdx * freqPerBin;
    const targetLoud = getLoudness();

    const targetFreq =
      maxAmp > SILENCE_THRESHOLD_AMP && rawFreq > 10 ? rawFreq : 60;

    // smoothing
    smoothedLoudnessRef.current +=
      (targetLoud - smoothedLoudnessRef.current) * LOUDNESS_SMOOTHING_FACTOR;
    smoothedFreqRef.current +=
      (targetFreq - smoothedFreqRef.current) * FREQUENCY_SMOOTHING_FACTOR;

    const pendMod = Math.sin(Date.now() * PENDULUM_SPEED);

    // amplitude calc
    let baseAmp =
      MIN_VISUAL_AMP +
      smoothedLoudnessRef.current * (MAX_VISUAL_AMP - MIN_VISUAL_AMP);
    if (maxAmp < SILENCE_THRESHOLD_AMP / 2)
      baseAmp *= smoothedLoudnessRef.current;
    baseAmp = Math.max(MIN_VISUAL_AMP * 0.1, baseAmp);
    let finalAmp = baseAmp * (1 + PENDULUM_AMP_MOD_AMOUNT * pendMod);
    finalAmp = Math.min(30, finalAmp);

    // k calc
    let baseK = smoothedFreqRef.current * K_SCALE_FACTOR;
    baseK = Math.max(10 * K_SCALE_FACTOR, baseK);
    let finalK = baseK * (1 - PENDULUM_K_MOD_AMOUNT * pendMod);
    finalK = Math.max(0.001, finalK);

    // draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midX = canvas.width / 2;

    // Wave
    ctx.beginPath();
    ctx.lineWidth = 2;

    // Add glow effect
    const glowColor = "#88b2b4"; // Use a color that matches your gradient
    const glowIntensity = 100 * smoothedLoudnessRef.current; // Intensity based on audio
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Create gradient for stroke
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#88b2b4"); // Teal at top
    gradient.addColorStop(1, "#88b2b4"); // Red at bottom
    ctx.strokeStyle = gradient;
    ctx.moveTo(midX, 0);

    phaseRef.current -= WAVE_FLOW_SPEED;
    for (let y = 1; y < canvas.height; y++) {
      const normY = y / (canvas.height - 1);
      let env = Math.sin(normY * Math.PI);
      env = Math.max(0, env);
      const xSin = Math.sin(y * finalK + phaseRef.current);
      const x = midX + env * finalAmp * xSin;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const handleCanvasClick = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const onCanPlay = () => {
      audioEl.volume = 0.5;
      initializeAudio();
      draw();
    };
    audioEl.addEventListener("canplay", onCanPlay);

    return () => {
      audioEl.removeEventListener("canplay", onCanPlay);
      cancelAnimationFrame(animationRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div style={{ width: size.width, height: size.height }}>
      <audio
        ref={audioRef}
        controls
        crossOrigin="anonymous"
        src="/Dont_Fear_the_Reaper.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
      <div onClick={handleCanvasClick}>
        <canvas
          ref={canvasRef}
          width={size.width}
          height={size.height}
        ></canvas>
      </div>
    </div>
  );
};

export default AudioWaveVisualizer;
