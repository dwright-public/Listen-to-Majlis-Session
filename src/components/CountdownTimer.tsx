import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  sessionStartTime?: Date;
  onSessionStarting?: () => void;
  className?: string;
}

const CountdownTimer = ({
  sessionStartTime = new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
  onSessionStarting,
  className = "",
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [status, setStatus] = useState<"upcoming" | "starting-soon" | "live">(
    "upcoming",
  );

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = sessionStartTime.getTime() - now.getTime();

      // If the session is starting in 5 minutes or less
      if (difference <= 5 * 60 * 1000 && difference > 0) {
        if (status !== "starting-soon") {
          setStatus("starting-soon");
          onSessionStarting?.();
        }
      } else if (difference <= 0) {
        // Session has started
        setStatus("live");
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update countdown every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime, onSessionStarting, status]);

  const formatTimeUnit = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <div className={`bg-slate-100 p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-center">
        {status === "live" ? (
          <span className="text-red-600 flex items-center justify-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            Live Now
          </span>
        ) : status === "starting-soon" ? (
          <span className="text-amber-600">Starting Soon</span>
        ) : (
          <span>Countdown to Session</span>
        )}
      </h2>

      {status !== "live" && (
        <div className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold bg-white p-3 rounded-md shadow-sm w-16 text-center">
              {formatTimeUnit(timeRemaining.days)}
            </div>
            <span className="text-sm mt-1 text-gray-600">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold bg-white p-3 rounded-md shadow-sm w-16 text-center">
              {formatTimeUnit(timeRemaining.hours)}
            </div>
            <span className="text-sm mt-1 text-gray-600">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold bg-white p-3 rounded-md shadow-sm w-16 text-center">
              {formatTimeUnit(timeRemaining.minutes)}
            </div>
            <span className="text-sm mt-1 text-gray-600">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold bg-white p-3 rounded-md shadow-sm w-16 text-center">
              {formatTimeUnit(timeRemaining.seconds)}
            </div>
            <span className="text-sm mt-1 text-gray-600">Seconds</span>
          </div>
        </div>
      )}

      {status === "starting-soon" && (
        <div className="mt-4 text-center text-amber-600">
          <p>The session will begin in less than 5 minutes!</p>
        </div>
      )}

      {status === "live" && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            The session has started. Enjoy the stream!
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
