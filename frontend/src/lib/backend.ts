export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Language = string; // adjust if you have enums on frontend

export interface TextTranslate {
  text: string;
  sourceLang: Language;
  targetLang: Language;
}

export interface TextComparison {
  text_1: string;
  text_2: string;
}

export interface TTSRequest {
  text: string;
  language: string;
}


// POST /translate_text
export async function translateText(body: TextTranslate): Promise<{ text: string }> {
  const res = await fetch(`${API_BASE}/api/v1/api/v1/translate_text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to translate text");
  return res.json();
}

// POST /calculate_similarity
export async function calculateSimilarity(body: TextComparison): Promise<{ score: number }> {
  const res = await fetch(`${API_BASE}/api/v1/calculate_similarity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to calculate similarity");
  return res.json();
}

// POST /transcribe_audio
export async function transcribeAudio(file: Blob, language: string): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", file, "recording.webm");
  formData.append("language", language);

  const res = await fetch(`${API_BASE}/api/v1/transcribe_audio`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to transcribe audio");
  return res.json();
}

// POST /generate_audio
export async function generateAudio(body: TTSRequest): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/v1/generate_audio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to generate audio");
  return res.blob(); // WAV blob you can play or download
}