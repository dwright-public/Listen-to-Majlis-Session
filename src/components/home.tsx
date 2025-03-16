import React from "react";
import LiveStreamScheduler from "./LiveStreamScheduler";

const Home: React.FC = () => {
  // Sample sessions data with different start times
  const sessions = [
    {
      id: "1",
      title: "Morning Meditation",
      location: "Tokyo, Japan",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
      description:
        "Start your day with a calming meditation session from Tokyo.",
    },
    {
      id: "2",
      title: "Afternoon Jazz",
      location: "New York, USA",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
      description: "Enjoy smooth jazz tunes live from New York City.",
    },
    {
      id: "3",
      title: "Evening Classical",
      location: "Vienna, Austria",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours from now
      description: "Experience classical music from the heart of Vienna.",
    },
    {
      id: "4",
      title: "Late Night Talk Show",
      location: "London, UK",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
      description: "Join our late night discussion on current events.",
    },
    {
      id: "5",
      title: "Sunrise Ambient Sounds",
      location: "Bali, Indonesia",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      description: "Experience the peaceful sounds of Bali at sunrise.",
    },
    {
      id: "6",
      title: "Desert Winds",
      location: "Marrakech, Morocco",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 36), // 36 hours from now
      description: "Listen to the unique sounds of the Moroccan desert.",
    },
  ];

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-800">
            Global Audio Streams
          </h1>
          <p className="text-gray-600 mt-2">
            Listen to live audio from around the world
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LiveStreamScheduler
          initialTimezone={userTimezone}
          sessions={sessions}
        />

        <section className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About Our Live Streams
          </h2>
          <p className="text-gray-600 mb-4">
            Our global network of audio streams brings you immersive sounds and
            discussions from around the world. Each stream is carefully curated
            to provide a unique listening experience, whether you're seeking
            meditation, music, or engaging conversations.
          </p>
          <p className="text-gray-600">
            All times are automatically converted to your local timezone for
            convenience. Sessions begin streaming 5 minutes before the scheduled
            start time, so you can get settled in and ready to listen.
          </p>
        </section>
      </main>

      <footer className="bg-indigo-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Global Audio Streams</h3>
              <p className="text-indigo-200 mt-1">
                Connecting the world through sound
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-indigo-200 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-indigo-200 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-indigo-200 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-800 text-center text-indigo-300 text-sm">
            © {new Date().getFullYear()} Global Audio Streams. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
