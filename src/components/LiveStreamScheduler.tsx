import React, { useState } from "react";
import TimezoneSelector from "./TimezoneSelector";
import SessionList from "./SessionList";
import AudioPlayer from "./AudioPlayer";

interface Session {
  id: string;
  title: string;
  location: string;
  startTime: Date;
  description?: string;
}

interface LiveStreamSchedulerProps {
  initialTimezone?: string;
  sessions?: Session[];
}

const LiveStreamScheduler: React.FC<LiveStreamSchedulerProps> = ({
  initialTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  sessions = [],
}) => {
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(initialTimezone);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  // Find the selected session object
  const selectedSession = sessions.find(
    (session) => session.id === selectedSessionId,
  );

  // Handle timezone change
  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  // Handle session selection
  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  // Handle session starting soon notification
  const handleSessionStarting = () => {
    // No longer needed to show/hide player
  };

  // Close audio player - now just deselects the session
  const handleCloseAudioPlayer = () => {
    setSelectedSessionId("");
  };

  // Check if selected session is live
  const isSessionLive = selectedSession
    ? selectedSession.startTime.getTime() <= Date.now()
    : false;

  // Check if session is starting soon (within 5 minutes)
  const isStartingSoon = selectedSession
    ? selectedSession.startTime.getTime() - Date.now() <= 5 * 60 * 1000 &&
      selectedSession.startTime.getTime() > Date.now()
    : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Live Audio Streaming Schedule
        </h1>

        <div className="flex flex-col gap-6">
          <div className="w-full max-w-xs">
            <TimezoneSelector
              selectedTimezone={selectedTimezone}
              onTimezoneChange={handleTimezoneChange}
            />
          </div>

          <div className="w-full">
            <SessionList
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={handleSessionSelect}
              userTimezone={selectedTimezone}
            />
          </div>
        </div>

        {selectedSession ? (
          <div className="mt-8 flex justify-center">
            <div
              className={`transition-opacity duration-300 ${isStartingSoon || isSessionLive ? "opacity-100" : "opacity-50 pointer-events-none"}`}
            >
              <AudioPlayer
                sessionTitle={selectedSession.title}
                sessionLocation={selectedSession.location}
                startTime={selectedSession.startTime}
                audioUrl="https://example.com/stream"
                isLive={isSessionLive}
                onClose={handleCloseAudioPlayer}
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <div className="opacity-50 pointer-events-none">
              <AudioPlayer
                sessionTitle="Select a session"
                sessionLocation="Please select a session from the list"
                startTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                audioUrl="https://example.com/stream"
                isLive={false}
                onClose={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamScheduler;
