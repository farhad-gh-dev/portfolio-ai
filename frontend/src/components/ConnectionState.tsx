import React from "react";

interface ConnectionStateProps {
  status: string;
  onRetryConnection?: () => void;
}

const ConnectionState: React.FC<ConnectionStateProps> = ({
  status,
  onRetryConnection,
}) => {
  return (
    <div className="connection-state-container">
      <div className="connection-state-message">
        {status === "Connecting..." ? (
          <>
            <div className="loader"></div>
            <h2>Connecting to the AI Chat Service...</h2>
            <p>Please wait while we establish a connection.</p>
          </>
        ) : (
          <>
            <h2>Connection Lost</h2>
            <p>
              The connection to the AI Chat Service has been lost or could not
              be established.
            </p>
            {onRetryConnection && (
              <button
                className="retry-connection-button"
                onClick={onRetryConnection}
              >
                Retry Connection
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionState;
