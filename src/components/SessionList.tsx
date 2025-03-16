import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Clock, MapPin } from "lucide-react";

interface Session {
  id: string;
  location: string;
  languages: string;
  startTime: Date;
  description?: string;
}

interface SessionListProps {
  sessions?: Session[];
  selectedSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  userTimezone?: string;
}

// Helper function to create session dates for upcoming Thursdays and Sundays at 7:30pm local time
const createSessionDates = () => {
  const sessions = [];
  const cities = [
    {
      id: "1",
      location: "New York, US",
      languages: "English and Persian",
    },
    {
      id: "2",
      location: "Boston, US",
      languages: "English and Persian",
    },
    {
      id: "3",
      location: "Washington DC, US",
      languages: "English and Persian",
    },
    {
      id: "4",
      location: "Toronto, Canada",
      languages: "English and Persian",
    },
    {
      id: "5",
      location: "Montreal, Canada",
      languages: "French and Persian",
    },
    {
      id: "6",
      location: "Chicago, US",
      languages: "English and Persian",
    },
    {
      id: "7",
      location: "Seattle, US",
      languages: "English and Persian",
    },
    {
      id: "8",
      location: "San Francisco, US",
      languages: "English and Persian",
    },
    {
      id: "9",
      location: "Santa Cruz, US",
      languages: "English and Persian",
    },
    {
      id: "10",
      location: "Los Angeles, US",
      languages: "English and Persian",
    },
    {
      id: "11",
      location: "San Diego, US",
      languages: "Spanish and Persian",
    },
    {
      id: "12",
      location: "San Miguel de Allende, Mexico",
      languages: "Spanish and Persian",
    },
    {
      id: "13",
      location: "Sydney, Australia",
      languages: "English and Persian",
    },
    {
      id: "14",
      location: "Moscow, Russia",
      languages: "Russian and Persian",
    },
    {
      id: "15",
      location: "Vienna, Austria",
      languages: "German and Persian",
    },
    {
      id: "16",
      location: "Koln, Germany",
      languages: "German and Persian",
    },
    {
      id: "17",
      location: "Paris, France",
      languages: "French and Persian",
    },
    {
      id: "18",
      location: "London, UK",
      languages: "English and Persian",
    },
  ];

  // Start with today's date
  const today = new Date();

  // Find the next Thursday and Sunday
  let nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + ((4 + 7 - today.getDay()) % 7));
  nextThursday.setHours(19, 30, 0, 0); // 7:30pm

  let nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + ((0 + 7 - today.getDay()) % 7));
  nextSunday.setHours(19, 30, 0, 0); // 7:30pm

  // If today is Sunday, use next Sunday
  if (today.getDay() === 0) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }

  // If today is Thursday, use next Thursday
  if (today.getDay() === 4) {
    nextThursday.setDate(nextThursday.getDate() + 7);
  }

  // Create sessions alternating between Thursdays and Sundays
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const isThursday = i % 2 === 0;

    const sessionDate = new Date(isThursday ? nextThursday : nextSunday);
    // Add weeks based on index to spread out the sessions
    sessionDate.setDate(sessionDate.getDate() + Math.floor(i / 2) * 7);

    sessions.push({
      id: city.id,
      location: city.location,
      languages: city.languages,
      startTime: new Date(sessionDate),
      description: `Join us live from ${city.location}.`,
    });
  }

  // Sort by date
  return sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

const SessionList: React.FC<SessionListProps> = ({
  sessions = createSessionDates(),

  selectedSessionId = "",
  onSelectSession = () => {},
  userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}) => {
  const [localSelectedId, setLocalSelectedId] =
    useState<string>(selectedSessionId);

  const handleSelectSession = (sessionId: string) => {
    setLocalSelectedId(sessionId);
    onSelectSession(sessionId);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: userTimezone,
      hour12: true,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Upcoming Sessions
        </h2>
        <ScrollArea className="h-[500px] pr-4">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No upcoming sessions available
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id}>
                  <div
                    className={`p-4 rounded-lg transition-colors cursor-pointer ${localSelectedId === session.id ? "bg-blue-50 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"}`}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {session.location}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1" />
                        <span>{formatTime(session.startTime)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="font-medium text-blue-600 mr-1">
                        Languages:
                      </span>
                      <span>{session.languages}</span>
                    </div>
                    {localSelectedId === session.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SessionList;
