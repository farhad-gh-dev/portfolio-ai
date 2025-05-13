import { TEXTS } from "../constants";

export const ConnectionLostScreen = () => {
  return (
    <div className="flex-center error-page">
      <h2>{TEXTS.disconnected}</h2>
      <p>{TEXTS.checkYourConnection}</p>
    </div>
  );
};
