import React, { useEffect, useRef } from "react";

const PENDULUM_SPEED = 0.002; // Speed of the pendulum
const PENDULUM_AMP_MOD_AMOUNT = 0.4;
const K_SCALE_FACTOR = Math.PI / 50000; // Speed of the wave
const PENDULUM_K_MOD_AMOUNT = 0.35;
const MIN_VISUAL_AMP = 10;
const MAX_VISUAL_AMP = 100; // Height of the wave
const LOUDNESS_SMOOTHING_FACTOR = 0.05; // Smoothness of wave height
const FREQUENCY_SMOOTHING_FACTOR = 0.05; // Smoothness of wave frequency
const WAVE_FLOW_SPEED = 0.015; // Speed of wave flow
const SILENCE_THRESHOLD_AMP = 15; // Threshold for silence detection

const AudioWaveVisualizer: React.FC = () => {
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
    finalAmp = Math.max(1, finalAmp);

    // k calc
    let baseK = smoothedFreqRef.current * K_SCALE_FACTOR;
    baseK = Math.max(10 * K_SCALE_FACTOR, baseK);
    let finalK = baseK * (1 - PENDULUM_K_MOD_AMOUNT * pendMod);
    finalK = Math.max(0.001, finalK);

    // draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;

    // baseline
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // wave
    ctx.beginPath();
    ctx.strokeStyle = "rgb(220, 50, 50)";
    ctx.lineWidth = 2;
    ctx.moveTo(0, midY);

    phaseRef.current -= WAVE_FLOW_SPEED;
    for (let x = 1; x < canvas.width; x++) {
      const normX = x / (canvas.width - 1);
      let env = Math.sin(normX * Math.PI);
      env = Math.max(0, env);
      const ySin = Math.sin(x * finalK + phaseRef.current);
      const y = midY + env * finalAmp * ySin;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  useEffect(() => {
    if (audioRef.current?.readyState === 4) {
      initializeAudio();
    }
  }, [audioRef.current?.readyState]);

  return (
    <div style={{ position: "fixed", top: 20, left: 20, zIndex: 1000 }}>
      <audio
        ref={audioRef}
        controls
        className="mt-4"
        crossOrigin="anonymous"
        src="/Dont_Fear_the_Reaper.mp3"
      />
      <canvas ref={canvasRef} width={350} height={150} />
    </div>
  );
};

export default AudioWaveVisualizer;

// if (animationRef.current) cancelAnimationFrame(animationRef.current);
