"use client";

import { AlertCircle, Award, Check, Clock, Gift, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "./lib/axios";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [error, setError] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRewards = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/rewards");
      setRewards(response.data);

      if (sessionId.trim()) {
        fetchRedemptions();
      }
    } catch {
      setError("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    if (!sessionId.trim()) {
      setError("Please enter a valid session ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/redemptions", {
        params: { sessionId },
      });
      setRedemptions(response.data);
    } catch {
      setError("Failed to load redemptions");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionId(e.target.value);
  };

  const handleRedeem = async (rewardId: string) => {
    if (!sessionId.trim()) {
      setError("Please enter a session ID first");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/redemptions", {
        sessionId,
        rewardId,
      });

      setPopupMessage("Reward redeemed successfully!");
      fetchRedemptions();
    } catch (error: unknown) {
      const err = error as AxiosError<any>;

      if (
        err.response?.data?.message === "You have already redeemed this reward."
      ) {
        setPopupMessage("Something went wrong. Please try again.");
      } else {
        setPopupMessage("You have already redeemed this reward.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchRedemptions();
    }
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 text-gray-800">
      <header className="bg-white shadow-md py-4 px-6 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="text-indigo-600 h-8 w-8" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Pet Rewards
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-md mx-auto flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={sessionId}
                onChange={handleSessionIdChange}
                onKeyDown={handleKeyDown}
                className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your session ID"
              />
            </div>
            <button
              onClick={fetchRedemptions}
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 font-medium disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>Enter your Rewards</>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center p-3 bg-red-50 text-red-700 rounded-lg max-w-md mx-auto">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Gift className="mr-2" />
                  Available Rewards
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {rewards.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-500"></div>
                        <p className="mt-4">Loading rewards...</p>
                      </div>
                    ) : (
                      <p>No rewards available</p>
                    )}
                  </div>
                ) : (
                  rewards.map((reward: any) => (
                    <div
                      key={reward._id}
                      className="p-6 hover:bg-indigo-50 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-semibold text-indigo-700">
                            {reward.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {reward.description}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="bg-indigo-100 text-indigo-800 font-medium px-4 py-2 rounded-full text-sm">
                            {reward.pointsRequired} Points
                          </div>
                          <button
                            onClick={() => handleRedeem(reward._id)}
                            disabled={loading || !sessionId}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="h-4 w-4" />
                            Redeem Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Clock className="mr-2" />
                  Redemption History
                </h2>
              </div>

              <div className="p-4">
                {!sessionId ? (
                  <div className="py-6 text-center text-gray-500">
                    Enter session ID to view history
                  </div>
                ) : redemptions.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-500"></div>
                        <p className="mt-4">Loading history...</p>
                      </div>
                    ) : (
                      <p>No redemption history found</p>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {redemptions.map((redemption: any) => (
                      <li
                        key={redemption._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                      >
                        <p className="font-medium text-indigo-700">
                          {redemption.rewardId.title || "Unknown Reward"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(redemption.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {popupMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-xl z-50 max-w-md w-full animate-fade-in-up">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full mr-3 ${
                  popupMessage.includes("successfully")
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}
              >
                {popupMessage.includes("successfully") ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <p className="text-gray-800 font-medium">{popupMessage}</p>
            </div>
            <button
              onClick={() => setPopupMessage(null)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
