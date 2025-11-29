"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserProfile,
  updateUserProfile,
  uploadPhotos,
  deletePhoto,
} from "@/lib/actions/profile";
import PhotoUpload from "@/components/PhotoUpload";
import {
  Camera,
  X,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Music,
  Globe,
  Save,
  ArrowLeft,
} from "lucide-react";

interface ExtendedFormData {
  full_name: string;
  username: string;
  bio: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  avatar_url: string;
  location: string;
  occupation: string;
  education: string;
  height: number;
  photos: string[];
  interests: string[];
  languages: string[];
  lifestyle: {
    smoking: string;
    drinking: string;
    exercise: string;
    pets: string;
  };
  prompts: Array<{ question: string; answer: string; image?: string }>;
  instagram: string;
  spotify: string;
  relationship_goals: string;
  preferences: {
    age_range: { min: number; max: number };
    distance: number;
    gender_preference: ("male" | "female" | "other")[];
    dealbreakers: string[];
  };
}

const LIFESTYLE_OPTIONS = {
  smoking: ["Never", "Socially", "Regularly", "Trying to quit"],
  drinking: ["Never", "Socially", "Regularly", "Occasionally"],
  exercise: ["Never", "Sometimes", "Active", "Very Active", "Daily"],
  pets: ["No pets", "Dog lover", "Cat lover", "Pet-free", "Have pets"],
};

const INTEREST_OPTIONS = [
  "Travel",
  "Music",
  "Movies",
  "Sports",
  "Reading",
  "Cooking",
  "Photography",
  "Art",
  "Gaming",
  "Fitness",
  "Hiking",
  "Dancing",
  "Yoga",
  "Technology",
  "Fashion",
  "Food",
  "Nature",
  "Coffee",
  "Wine",
  "Concerts",
];

const PROMPT_QUESTIONS = [
  "My simple pleasures",
  "I'm looking for",
  "My ideal Sunday",
  "I geek out on",
  "The way to win me over is",
  "I'm weirdly attracted to",
  "Best travel story",
  "I'm overly competitive about",
  "Most spontaneous thing I've done",
  "Change my mind about",
];

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDealbreaker, setNewDealbreaker] = useState("");

  const [formData, setFormData] = useState<ExtendedFormData>({
    full_name: "",
    username: "",
    bio: "",
    gender: "male",
    birthdate: "",
    avatar_url: "",
    location: "",
    occupation: "",
    education: "",
    height: 170,
    photos: [],
    interests: [],
    languages: [],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially",
      exercise: "Active",
      pets: "Dog lover",
    },
    prompts: [],
    instagram: "",
    spotify: "",
    relationship_goals: "",
    preferences: {
      age_range: { min: 18, max: 35 },
      distance: 50,
      gender_preference: [],
      dealbreakers: [],
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        if (profileData && typeof profileData === "object" && "id" in profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            gender: profileData.gender || "male",
            birthdate: profileData.birthdate || "",
            avatar_url: profileData.avatar_url || "",
            location: profileData.location || "",
            occupation: profileData.occupation || "",
            education: profileData.education || "",
            height: profileData.height || 170,
            photos: profileData.photos || [],
            interests: profileData.interests || [],
            languages: profileData.languages || [],
            lifestyle: profileData.lifestyle || {
              smoking: "Never",
              drinking: "Socially",
              exercise: "Active",
              pets: "Dog lover",
            },
            prompts: profileData.prompts || [],
            instagram: profileData.instagram || "",
            spotify: profileData.spotify || "",
            relationship_goals: profileData.relationship_goals || "",
            preferences: profileData.preferences || {
              age_range: { min: 18, max: 35 },
              distance: 50,
              gender_preference: [],
              dealbreakers: [],
            },
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLifestyleChange = (key: keyof typeof formData.lifestyle, value: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [key]: value,
      },
    }));
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const toggleGenderPreference = (gender: "male" | "female" | "other") => {
    setFormData((prev) => {
      const current = prev.preferences.gender_preference;
      const updated = current.includes(gender)
        ? current.filter((g) => g !== gender)
        : [...current, gender];
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          gender_preference: updated,
        },
      };
    });
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const addPrompt = () => {
    if (formData.prompts.length < 3) {
      setFormData((prev) => ({
        ...prev,
        prompts: [...prev.prompts, { question: PROMPT_QUESTIONS[0], answer: "" }],
      }));
    }
  };

  const updatePrompt = (index: number, field: "question" | "answer", value: string) => {
    setFormData((prev) => ({
      ...prev,
      prompts: prev.prompts.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removePrompt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prompts: prev.prompts.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const result = await uploadPhotos(fileArray);
    
    if (result.success && result.urls) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...result.urls],
      }));
    }
  };

  const removePhoto = async (photoUrl: string) => {
    await deletePhoto(photoUrl);
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p !== photoUrl),
    }));
  };

  const addDealbreaker = () => {
    if (newDealbreaker && !formData.preferences.dealbreakers.includes(newDealbreaker)) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          dealbreakers: [...prev.preferences.dealbreakers, newDealbreaker],
        },
      }));
      setNewDealbreaker("");
    }
  };

  const removeDealbreaker = (dealbreaker: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dealbreakers: prev.preferences.dealbreakers.filter((d) => d !== dealbreaker),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        router.push("/profile");
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Edit Your Profile
        </h1>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["interests", "prompts", "preferences"].map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                activeSection === section
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-8">
            {/* Interests Section */}
            {activeSection === "interests" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interests</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border-2 border-pink-500 flex items-center gap-2"
                    >
                      {interest}
                      <button type="button" onClick={() => removeInterest(interest)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.filter((i) => !formData.interests.includes(i)).map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest(newInterest))}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Add custom interest"
                  />
                  <button
                    type="button"
                    onClick={() => addInterest(newInterest)}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Prompts Section */}
            {activeSection === "prompts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prompts</h2>
                  <button
                    type="button"
                    onClick={addPrompt}
                    disabled={formData.prompts.length >= 3}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Prompt
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add up to 3 prompts to show your personality (Max: {formData.prompts.length}/3)
                </p>
                {formData.prompts.map((prompt, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <select
                        value={prompt.question}
                        onChange={(e) => updatePrompt(idx, "question", e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                      >
                        {PROMPT_QUESTIONS.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removePrompt(idx)}
                        className="ml-3 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <textarea
                      value={prompt.answer}
                      onChange={(e) => updatePrompt(idx, "answer", e.target.value)}
                      rows={3}
                      maxLength={150}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Your answer..."
                    />
                    <p className="text-xs text-gray-500">{prompt.answer.length}/150 characters</p>
                  </div>
                ))}
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dating Preferences</h2>

                {/* Relationship Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Heart className="w-4 h-4 inline mr-1" />
                    What are you looking for?
                  </label>
                  <input
                    type="text"
                    name="relationship_goals"
                    value={formData.relationship_goals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Long-term relationship, New friends, Still figuring it out"
                  />
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Interested in
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["male", "female", "other"] as const).map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => toggleGenderPreference(gender)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors capitalize ${
                          formData.preferences.gender_preference.includes(gender)
                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Age Range: {formData.preferences.age_range.min} - {formData.preferences.age_range.max}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400">Min Age</label>
                      <input
                        type="range"
                        min="18"
                        max="100"
                        value={formData.preferences.age_range.min}
                        onChange={(e) =>
                          handlePreferenceChange("age_range", {
                            ...formData.preferences.age_range,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400">Max Age</label>
                      <input
                        type="range"
                        min="18"
                        max="100"
                        value={formData.preferences.age_range.max}
                        onChange={(e) =>
                          handlePreferenceChange("age_range", {
                            ...formData.preferences.age_range,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Maximum Distance: {formData.preferences.distance} km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={formData.preferences.distance}
                    onChange={(e) => handlePreferenceChange("distance", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Dealbreakers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Dealbreakers
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.preferences.dealbreakers.map((dealbreaker) => (
                      <span
                        key={dealbreaker}
                        className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {dealbreaker}
                        <button type="button" onClick={() => removeDealbreaker(dealbreaker)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDealbreaker}
                      onChange={(e) => setNewDealbreaker(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDealbreaker())}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add a dealbreaker"
                    />
                    <button
                      type="button"
                      onClick={addDealbreaker}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}