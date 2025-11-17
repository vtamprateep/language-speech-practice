export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:8000";

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

export interface Vocabulary {
  topic: string | null;
  traditional: string;
  simplified: string;
  pinyin: string;
  partOfSpeech: string | null;
  level: number;
  topicEnglish: string | null;
  english: string;
  id: number;
  relativeFreqPct: number;
}


// POST /translate_text
export async function translateText(body: TextTranslate): Promise<{ text: string }> {
  const res = await fetch(`${API_BASE}/api/v1/translate_text`, {
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

// GET /get_vocabulary_by_level
export async function getVocabularyByLevel(level: string): Promise<Vocabulary[]> {
  const res = await fetch(`${API_BASE}/api/v1/get_vocabulary_by_level?level=${level}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to get vocabulary");
  return res.json();
}

// GET /get_vocabulary_by_id
export async function getVocabularyById(arrId: number[]): Promise<Vocabulary[]> {
  // Format query parameter
  const queryParameter = arrId.flatMap((entry) => `arr_id=${entry}`);
  const queryParameterString = queryParameter.join("&")

  const res = await fetch(`${API_BASE}/api/v1/get_vocabulary_by_id?${queryParameterString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}
