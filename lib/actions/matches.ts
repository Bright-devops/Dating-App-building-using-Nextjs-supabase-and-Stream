"use server";

import { UserProfile } from "@/app/profile/page";
import { createClient } from "../supabase/server";

export async function getPotentialMatches(): Promise<UserProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: potentialMatches, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .limit(50);

  if (error) {
    throw new Error("failed to fetch potential matches");
  }

  const { data: userPrefs, error: prefsError } = await supabase
    .from("users")
    .select("preferences")
    .eq("id", user.id)
    .single();

  if (prefsError) {
    throw new Error("Failed to get user preferences");
  }

  const currentUserPrefs = userPrefs.preferences as any;
  const genderPreference = currentUserPrefs?.gender_preference || [];
  const filteredMatches =
    potentialMatches
      .filter((match) => {
        if (!genderPreference || genderPreference.length === 0) {
          return true;
        }

        return genderPreference.includes(match.gender);
      })
      .map((match) => ({
        id: match.id,
        full_name: match.full_name,
        username: match.username,
        email: "",
        gender: match.gender,
        birthdate: match.birthdate,
        bio: match.bio,
        avatar_url: match.avatar_url,
        preferences: match.preferences,
        location_lat: undefined,
        location_lng: undefined,
        last_active: new Date().toISOString(),
        is_verified: true,
        is_online: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) || [];
  return filteredMatches;
}

export async function likeUser(toUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  // STEP 1: Check if this like already exists (prevent duplicate likes)
  const { data: existingLikeCheck, error: existingCheckError } = await supabase
    .from("likes")
    .select("id")
    .eq("from_user_id", user.id)
    .eq("to_user_id", toUserId)
    .maybeSingle();

  if (existingCheckError) {
    console.error("Error checking existing like:", {
      message: existingCheckError.message,
      details: existingCheckError.details,
      hint: existingCheckError.hint,
      code: existingCheckError.code,
    });
    throw new Error(`Database error: ${existingCheckError.message}`);
  }

  // If like already exists, just check for match without inserting again
  if (existingLikeCheck) {
    console.log("Like already exists, checking for match...");
    
    // Check if the other user liked us back
    const { data: mutualLike, error: mutualCheckError } = await supabase
      .from("likes")
      .select("*")
      .eq("from_user_id", toUserId)
      .eq("to_user_id", user.id)
      .maybeSingle();

    if (mutualCheckError) {
      console.error("Error checking mutual like:", mutualCheckError);
    }

    if (mutualLike) {
      // It's a match!
      const { data: matchedUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", toUserId)
        .single();

      if (userError) {
        console.error("Error fetching matched user:", userError);
        throw new Error("Failed to fetch matched user");
      }

      return {
        success: true,
        isMatch: true,
        matchedUser: matchedUser as UserProfile,
      };
    }

    return { success: true, isMatch: false };
  }

  // STEP 2: Insert the new like
  const { data: insertedLike, error: likeError } = await supabase
    .from("likes")
    .insert({
      from_user_id: user.id,
      to_user_id: toUserId,
    })
    .select()
    .single();

  if (likeError) {
    console.error("Detailed like insert error:", {
      message: likeError.message,
      details: likeError.details,
      hint: likeError.hint,
      code: likeError.code,
      from_user_id: user.id,
      to_user_id: toUserId,
    });
    
    // Provide specific error messages based on error code
    if (likeError.code === "23505") {
      throw new Error("You've already liked this user");
    } else if (likeError.code === "23503") {
      throw new Error("Invalid user reference");
    } else if (likeError.code === "42501") {
      throw new Error("Permission denied. Please check your account settings.");
    }
    
    throw new Error(`Failed to create like: ${likeError.message}`);
  }

  console.log("Like created successfully:", insertedLike);

  // STEP 3: Check if the other user already liked us (mutual match)
  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("*")
    .eq("from_user_id", toUserId)
    .eq("to_user_id", user.id)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking for mutual match:", {
      message: checkError.message,
      details: checkError.details,
      hint: checkError.hint,
      code: checkError.code,
    });
    // Don't throw error here, just log it and continue
  }

  // STEP 4: If mutual like exists, create a match and return the matched user
  if (existingLike) {
    console.log("Mutual match found!");
    
    // Optional: Create a match record in a separate matches table
    // This is useful for tracking active matches
    const { error: matchError } = await supabase
      .from("matches")
      .insert({
        user1_id: user.id,
        user2_id: toUserId,
        is_active: true,
      })
      .select()
      .maybeSingle();

    if (matchError && matchError.code !== "23505") {
      // Ignore duplicate match errors (23505), log others
      console.error("Error creating match record:", matchError);
    }

    const { data: matchedUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", toUserId)
      .single();

    if (userError) {
      console.error("Error fetching matched user details:", userError);
      throw new Error("Failed to fetch matched user");
    }

    return {
      success: true,
      isMatch: true,
      matchedUser: matchedUser as UserProfile,
    };
  }

  // No match yet, just a successful like
  return { success: true, isMatch: false };
}

export async function getUserMatches() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }

  const matchedUsers: UserProfile[] = [];

  for (const match of matches || []) {
    const otherUserId =
      match.user1_id === user.id ? match.user2_id : match.user1_id;

    const { data: otherUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", otherUserId)
      .single();

    if (userError) {
      console.error("Error fetching user in match:", userError);
      continue;
    }

    matchedUsers.push({
      id: otherUser.id,
      full_name: otherUser.full_name,
      username: otherUser.username,
      email: otherUser.email,
      gender: otherUser.gender,
      birthdate: otherUser.birthdate,
      bio: otherUser.bio,
      avatar_url: otherUser.avatar_url,
      preferences: otherUser.preferences,
      location_lat: undefined,
      location_lng: undefined,
      last_active: new Date().toISOString(),
      is_verified: true,
      is_online: false,
      created_at: match.created_at,
      updated_at: match.created_at,
    });
  }

  return matchedUsers;
}