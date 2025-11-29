"use client";

import { useState, useEffect } from "react";
import { Heart, Camera, Film, Sparkles, MapPin, Briefcase, GraduationCap, Music, Share2, Settings, Shield, Eye, Star } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/actions/profile";
import Link from "next/link";
import { calculateAge } from "@/lib/helpers/calculate-age";

// Extended profile interface with all new features
export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  bio: string;
  avatar_url: string;
  photos?: string[];
  reels?: {
    id: string;
    thumbnail: string;
    url: string;
    views: number;
  }[];
  stories?: {
    id: string;
    thumbnail: string;
    viewed: boolean;
    timestamp: string;
  }[];
  height?: number;
  occupation?: string;
  education?: string;
  location?: string;
  interests?: string[];
  lifestyle?: {
    smoking: string;
    drinking: string;
    exercise: string;
    pets: string;
  };
  prompts?: {
    question: string;
    answer: string;
    image?: string;
  }[];
  languages?: string[];
  relationship_goals?: string;
  instagram?: string;
  spotify?: string;
  is_verified: boolean;
  is_online: boolean;
  profile_completion?: number;
  stats?: {
    likes: number;
    views: number;
    matches: number;
  };
  preferences: {
    age_range: { min: number; max: number };
    distance: number;
    gender_preference: ("male" | "female" | "other")[];
    dealbreakers?: string[];
  };
  location_lat?: number;
  location_lng?: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export default function EnhancedProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "photos" | "reels" | "stories">("overview");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        console.log(profileData);
        if (profileData) {
          setProfile(profileData as UserProfile);
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        console.error("Error loading profile: ", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Unable to load your profile. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate age from birthdate
  const age = calculateAge(profile.birthdate);

  // Set defaults for optional fields
  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.avatar_url];
  const reels = profile.reels || [];
  const stories = profile.stories || [];
  const interests = profile.interests || [];
  const languages = profile.languages || [];
  const prompts = profile.prompts || [];
  const stats = profile.stats || { likes: 0, views: 0, matches: 0 };
  const profileCompletion = profile.profile_completion || 50;
  const lifestyle = profile.lifestyle || {
    smoking: "Not specified",
    drinking: "Not specified",
    exercise: "Not specified",
    pets: "Not specified"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your dating profile</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <Link href="/settings" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {profileCompletion < 100 && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Complete Your Profile</h3>
              <span className="text-2xl font-bold">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 mb-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-sm opacity-90">Profiles with photos and prompts get 3x more matches!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-96">
                <img
                  src={profile.avatar_url || "/default-avatar.png"}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Status Indicators */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {profile.is_verified && (
                    <div className="bg-blue-500 rounded-full p-2">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {profile.is_online && (
                    <div className="bg-green-500 rounded-full px-3 py-1 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">Online</span>
                    </div>
                  )}
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-4xl font-bold mb-2">
                    {profile.full_name}, {age}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {profile.location && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.occupation && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.occupation}</span>
                      </div>
                    )}
                    {profile.education && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{profile.education}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-4 px-6 font-medium capitalize transition-colors ${
                    activeTab === "overview"
                      ? "text-pink-500 border-b-2 border-pink-500"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("photos")}
                  className={`flex-1 py-4 px-6 font-medium capitalize transition-colors ${
                    activeTab === "photos"
                      ? "text-pink-500 border-b-2 border-pink-500"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Photos
                </button>
                {reels.length > 0 && (
                  <button
                    onClick={() => setActiveTab("reels")}
                    className={`flex-1 py-4 px-6 font-medium capitalize transition-colors ${
                      activeTab === "reels"
                        ? "text-pink-500 border-b-2 border-pink-500"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Reels
                  </button>
                )}
                {stories.length > 0 && (
                  <button
                    onClick={() => setActiveTab("stories")}
                    className={`flex-1 py-4 px-6 font-medium capitalize transition-colors ${
                      activeTab === "stories"
                        ? "text-pink-500 border-b-2 border-pink-500"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Stories
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About Me</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {profile.bio || "No bio added yet."}
                      </p>
                    </div>

                    {/* Prompts */}
                    {prompts.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get to Know Me</h3>
                        <div className="space-y-4">
                          {prompts.map((prompt, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-5">
                              <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-2">{prompt.question}</p>
                              <p className="text-gray-900 dark:text-white font-medium mb-3">{prompt.answer}</p>
                              {prompt.image && (
                                <img src={prompt.image} alt="" className="w-full h-48 object-cover rounded-lg" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {interests.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lifestyle */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lifestyle</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(lifestyle).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">{key}</p>
                            <p className="text-gray-900 dark:text-white font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    {languages.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Languages</h3>
                        <div className="flex gap-2">
                          {languages.map((lang, idx) => (
                            <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Basic Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gender</p>
                          <p className="text-gray-900 dark:text-white font-medium capitalize">{profile.gender}</p>
                        </div>
                        {profile.height && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Height</p>
                            <p className="text-gray-900 dark:text-white font-medium">{profile.height} cm</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "photos" && (
                  <div className="grid grid-cols-2 gap-4">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                    <button className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-pink-500 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Add Photo</span>
                    </button>
                  </div>
                )}

              {activeTab === "reels" && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {reels.map((reel) => (
      <div key={reel.id} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group">
        <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <Film className="w-5 h-5" />
          <span className="text-sm">{(reel.views || 0).toLocaleString()} views</span>
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" />
          </div>
        </div>
      </div>
    ))}
    <button className="aspect-[9/16] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-pink-500 transition-colors">
      <Film className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Add Reel</span>
    </button>
  </div>
)}

                {activeTab === "stories" && (
                  <div className="grid grid-cols-4 gap-4">
                    {stories.map((story) => (
                      <div key={story.id} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer">
                        <img src={story.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 border-4 ${story.viewed ? 'border-gray-300' : 'border-pink-500'} rounded-xl`} />
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">{story.timestamp}</span>
                        </div>
                      </div>
                    ))}
                    <button className="aspect-[9/16] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-pink-500 transition-colors">
                      <Sparkles className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Add Story</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Settings */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.likes}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.views}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Matches</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.matches}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Apps */}
            {(profile.instagram || profile.spotify) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connected Apps</h3>
                <div className="space-y-3">
                  {profile.instagram && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                      <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">Instagram</span>
                      </div>
                      <span className="text-sm">{profile.instagram}</span>
                    </div>
                  )}
                  {profile.spotify && (
                    <div className="flex items-center justify-between p-3 bg-green-500 rounded-lg text-white">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5" />
                        <span className="font-medium">Spotify</span>
                      </div>
                      <span className="text-sm">{profile.spotify}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dating Preferences</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Age Range</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile.preferences.age_range.min} - {profile.preferences.age_range.max} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Distance</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profile.preferences.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Looking For</p>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">
                    {profile.preferences.gender_preference.join(", ")}
                  </p>
                </div>
                {profile.relationship_goals && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Relationship Goals</p>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.relationship_goals}</p>
                  </div>
                )}
                {profile.preferences.dealbreakers && profile.preferences.dealbreakers.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dealbreakers</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.dealbreakers.map((item, idx) => (
                        <span key={idx} className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <Link 
              href="/profile/edit"
              className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl text-center"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img src={selectedPhoto} alt="" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  );
}