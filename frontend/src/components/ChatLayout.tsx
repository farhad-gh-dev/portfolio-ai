import React from "react";
import { TEXTS } from "../constants";
import { SongPlayer } from "./SongPlayer";
import { WaterFilter } from "./WaterFilter";

import "./ChatLayout.scss";

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
  return (
    <>
      <SongPlayer />
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

        {!isConnecting ? (
          <div className="split-layout">
            {inputComponent}
            <div className="split-border" />
            {answerComponent}
          </div>
        ) : (
          <div className="flex-center">
            <div className="loader"></div>
            <h2>{TEXTS.connectingToApi}</h2>
            <p>{TEXTS.pleaseWait}</p>
          </div>
        )}
      </div>
    </>
  );
};
