"use server";

import { createClient } from "../supabase/server";
import { UserProfile } from "@/app/profile/page";

// Extended UserProfile type to match the edit form
export interface ExtendedUserProfile {
  id: string;
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
  created_at?: string;
  updated_at?: string;
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  // Return profile with default values for missing fields
  return {
    ...profile,
    photos: profile.photos || [],
    interests: profile.interests || [],
    languages: profile.languages || [],
    lifestyle: profile.lifestyle || {
      smoking: "Never",
      drinking: "Socially",
      exercise: "Active",
      pets: "Dog lover",
    },
    prompts: profile.prompts || [],
    preferences: profile.preferences || {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ["female"],
      dealbreakers: [],
    },
  };
}

export async function updateUserProfile(
  profileData: Partial<ExtendedUserProfile>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // Prepare the update object with all fields
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  // Basic fields
  if (profileData.full_name !== undefined)
    updateData.full_name = profileData.full_name;
  if (profileData.username !== undefined)
    updateData.username = profileData.username;
  if (profileData.bio !== undefined) updateData.bio = profileData.bio;
  if (profileData.gender !== undefined) updateData.gender = profileData.gender;
  if (profileData.birthdate !== undefined)
    updateData.birthdate = profileData.birthdate;
  if (profileData.avatar_url !== undefined)
    updateData.avatar_url = profileData.avatar_url;

  // Additional profile fields
  if (profileData.location !== undefined)
    updateData.location = profileData.location;
  if (profileData.occupation !== undefined)
    updateData.occupation = profileData.occupation;
  if (profileData.education !== undefined)
    updateData.education = profileData.education;
  if (profileData.height !== undefined) updateData.height = profileData.height;

  // Array fields
  if (profileData.photos !== undefined) updateData.photos = profileData.photos;
  if (profileData.interests !== undefined)
    updateData.interests = profileData.interests;
  if (profileData.languages !== undefined)
    updateData.languages = profileData.languages;

  // JSON fields
  if (profileData.lifestyle !== undefined)
    updateData.lifestyle = profileData.lifestyle;
  if (profileData.prompts !== undefined) updateData.prompts = profileData.prompts;
  if (profileData.preferences !== undefined)
    updateData.preferences = profileData.preferences;

  // Social fields
  if (profileData.instagram !== undefined)
    updateData.instagram = profileData.instagram;
  if (profileData.spotify !== undefined)
    updateData.spotify = profileData.spotify;

  // Relationship goals
  if (profileData.relationship_goals !== undefined)
    updateData.relationship_goals = profileData.relationship_goals;

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function uploadProfilePhoto(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

// New function to upload multiple photos
export async function uploadPhotos(files: File[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-photos").getPublicUrl(fileName);

    uploadedUrls.push(publicUrl);
  }

  return { success: true, urls: uploadedUrls };
}

// Function to delete a photo
export async function deletePhoto(photoUrl: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // Extract filename from URL
  const fileName = photoUrl.split("/").pop();

  if (!fileName) {
    return { success: false, error: "Invalid photo URL" };
  }

  const { error } = await supabase.storage
    .from("profile-photos")
    .remove([fileName]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}




