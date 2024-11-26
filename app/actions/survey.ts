"use server";

import { EYMParentSurvey } from "@/types/survey";
import { createClient } from "@/utils/supabase/server";

class SurveyError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "SurveyError";
  }
}

export async function submitParentSurvey(
  data: Omit<EYMParentSurvey, "id" | "created_at" | "user_id">,
) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new SurveyError("Unauthorized");

  const { data: survey, error } = await supabase
    .from("parent_surveys")
    .insert([{
      parent_id: user.user.id,
      ...data,
    }]);

  if (error) {
    console.error("Supabase error:", error);
    // Check specifically for the unique constraint violation
    if (error.code === "23505") { // PostgreSQL unique violation code
      throw new SurveyError(
        "You have already submitted a survey for this child. Only one submission per child is allowed.",
        "DUPLICATE_ENTRY",
      );
    }
    throw new SurveyError(`Failed to submit survey: ${error.message}`);
  }
  return survey;
}

export async function getSurveySubmissions() {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new SurveyError("Unauthorized");

  const { data, error } = await supabase
    .from("parent_surveys")
    .select("*")
    .eq("parent_id", user.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new SurveyError(`Failed to fetch surveys: ${error.message}`);
  }
  return data;
}

export async function updateSurveySubmission(data: EYMParentSurvey) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new SurveyError("Unauthorized");

  const { data: updated, error } = await supabase
    .from("parent_surveys")
    .update(data)
    .eq("id", data.id)
    .eq("parent_id", user.user.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new SurveyError(`Failed to update survey: ${error.message}`);
  }
  return updated;
}

export async function deleteSurveySubmission(id: string) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new SurveyError("Unauthorized");

  const { error } = await supabase
    .from("parent_surveys")
    .delete()
    .eq("id", id)
    .eq("parent_id", user.user.id);

  if (error) {
    console.error("Supabase error:", error);
    throw new SurveyError(`Failed to delete survey: ${error.message}`);
  }

  return { success: true };
}

export async function createSurveySubmission(
  data: Omit<EYMParentSurvey, "id" | "created_at">,
) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new SurveyError("Unauthorized");

  const { data: result, error } = await supabase
    .from("parent_surveys")
    .insert({
      ...data,
      parent_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    if (error.code === "23505") {
      throw new SurveyError(
        "You have already submitted a survey for this child. Only one submission per child is allowed.",
        "DUPLICATE_ENTRY",
      );
    }
    throw new SurveyError(`Failed to submit survey: ${error.message}`);
  }
  return result;
}
