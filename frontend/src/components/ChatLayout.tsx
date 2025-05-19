import React from "react";
import { AUDIO_VISUALIZER_SIZE_OPTIONS, TEXTS } from "../constants";
import { WaterFilter } from "./WaterFilter";

import "./ChatLayout.scss";
import AudioWaveVisualizer from "./AudioWaveVisualizer";
import { useWindowWidth } from "../hooks/useWindowWidth";
interface ChatLayoutProps {
  inputComponent?: React.ReactNode;
  answerComponent?: React.ReactNode;
  isConnecting?: boolean;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  inputComponent,
  answerComponent,
  isConnecting,
}) => {
  const { currentSize } = useWindowWidth();

  const audioVisualizerSize =
    AUDIO_VISUALIZER_SIZE_OPTIONS[
      currentSize as keyof typeof AUDIO_VISUALIZER_SIZE_OPTIONS
    ];

  console.log(currentSize);
  console.log("Audio Visualizer Size:", audioVisualizerSize);

  return (
    <>
      <div className="chat-interface">
        <WaterFilter id="turbulence-low" scale={25} noisePattern="2" />
        <WaterFilter id="turbulence-high" scale={8} noisePattern="S" />

        <div
          className="chat-background"
          style={{ filter: "url(#turbulence-low)" }}
        />
        <div
          className="chat-background-layer2"
          style={{ filter: "url(#turbulence-high)" }}
        />
        <div className="chat-background-layer3" />

        <div
          className="split-layout"
          style={{ display: !isConnecting ? "flex" : "none" }}
        >
          {inputComponent}
          <AudioWaveVisualizer size={audioVisualizerSize} />
          {answerComponent}
        </div>

        <div
          className="flex-center"
          style={{ display: isConnecting ? "flex" : "none" }}
        >
          <div className="loader"></div>
          <h2>{TEXTS.connectingToApi}</h2>
          <p>{TEXTS.pleaseWait}</p>
        </div>
      </div>
    </>
  );
};
