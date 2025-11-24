"use client";
import { getPotentialMatches, likeUser } from "@/lib/actions/matches";
import { useEffect, useState } from "react";
import { UserProfile } from "../profile/page";
import { useRouter } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import MatchButtons from "@/components/MatchButtons";
import MatchNotification from "@/components/MatchNotification";

export default function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      try {
        const potentialMatchesData = await getPotentialMatches();
        
        // Validate the data received
        if (!Array.isArray(potentialMatchesData)) {
          throw new Error("Invalid matches data received");
        }
        
        setPotentialMatches(potentialMatchesData);
        setError(null);
      } catch (error) {
        console.error("Failed to load potential matches:", error);
        setError("Unable to load matches. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function handleLike() {
    // Prevent multiple simultaneous likes
    if (isLiking) return;
    
    if (currentIndex >= potentialMatches.length) {
      console.error("No more matches available");
      return;
    }

    const likedUser = potentialMatches[currentIndex];

    // Validate user data before making the request
    if (!likedUser || !likedUser.id) {
      console.error("Invalid user data:", likedUser);
      setError("Invalid profile data. Skipping to next profile.");
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setIsLiking(true);
    setError(null);

    try {
      console.log("Liking user with ID:", likedUser.id);
      
      const result = await likeUser(likedUser.id);

      // Validate the result
      if (!result) {
        throw new Error("No response from server");
      }

      // Check if it's a match
      if (result.isMatch && result.matchedUser) {
        setMatchedUser(result.matchedUser);
        setShowMatchNotification(true);
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);
      
    } catch (err) {
      console.error("Error liking user:", err);
      
      // Determine error type and show appropriate message
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      
      if (errorMessage.includes("authentication") || errorMessage.includes("unauthorized")) {
        setError("Session expired. Please log in again.");
        // Optionally redirect to login after a delay
        setTimeout(() => router.push("/login"), 2000);
      } else if (errorMessage.includes("already liked")) {
        setError("You've already liked this profile.");
        // Move to next profile automatically
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setError(null);
        }, 1500);
      } else if (errorMessage.includes("database") || errorMessage.includes("connection")) {
        setError("Server connection issue. Please try again.");
      } else {
        setError("Unable to like this profile. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  }

  function handlePass() {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setError(null); // Clear any existing errors
    } else {
      // Last profile, show end screen
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleCloseMatchNotification() {
    setShowMatchNotification(false);
    setMatchedUser(null);
  }

  function handleStartChat() {
    if (matchedUser) {
      router.push(`/chat/${matchedUser.id}`);
    }
  }

  function handleRefresh() {
    setCurrentIndex(0);
    setError(null);
    setLoading(true);
    
    // Reload matches
    getPotentialMatches()
      .then((data) => {
        setPotentialMatches(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to refresh matches:", err);
        setError("Unable to refresh matches. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Finding your matches...
          </p>
        </div>
      </div>
    );
  }

  // No matches state
  if (currentIndex >= potentialMatches.length) {
    return (
      <div className="h-full bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No more profiles to show
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back later for new matches, or try adjusting your preferences!
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        {showMatchNotification && matchedUser && (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        )}
      </div>
    );
  }

  const currentPotentialMatch = potentialMatches[currentIndex];

  // Main matching interface
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-200"
              title="Go back"
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Matches
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentIndex + 1} of {potentialMatches.length} profiles
            </p>
          </div>
        </header>

        {/* Error message display */}
        {error && (
          <div className="max-w-md mx-auto mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <MatchCard user={currentPotentialMatch} />
          <div className="mt-8">
            <MatchButtons 
              onLike={handleLike} 
              onPass={handlePass}
              // disabled={isLiking}
            />
            
            {/* Show loading indicator when liking */}
            {isLiking && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center text-pink-600 dark:text-pink-400">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {showMatchNotification && matchedUser && (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        )}
      </div>
    </div>
  );
}