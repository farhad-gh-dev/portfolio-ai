export const BackgroundContainer: React.FC<{
  readyState: number;
  onVideoEnded?: () => void;
}> = ({ readyState }) => {
  const getBackgroundClass = () => {
    switch (readyState) {
      case 1:
        return "chat-bg";
      case 3:
        return "error-bg";
      default:
        return "loading-bg";
    }
  };
  const backgroundClass = getBackgroundClass();

  return <div className={`bg-image ${backgroundClass}`} />;
};
