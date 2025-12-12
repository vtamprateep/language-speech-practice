import {
  TextTranslate,
  TextComparison,
  TTSRequest,
  Vocabulary,
  VocabularyProgressRecord
} from "./types";


const API_BASE = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:8000";


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

// GET /get_vocabulary_top_n_frequency
export async function getVocabularyTopNFrequency(n: number = 10): Promise<Vocabulary[]> {
  const res = await fetch(`${API_BASE}/api/v1/get_vocabulary_top_n_frequency?n=${n}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}

// GET /get_vocabulary_progress
export async function getVocabularyProgress(
  userId: string,
  arrId: number[]
): Promise<VocabularyProgressRecord[]> {
  // Format query parameter
  const queryParameter = arrId.flatMap((entry) => `arr_id=${entry}`);
  let queryParameterString = queryParameter.join("&");
  queryParameterString = `user_id=${userId}&` + queryParameterString;

  const res = await fetch(`${API_BASE}/api/v1/get_vocabulary_progress?${queryParameterString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}

// PUT /put_vocabulary_progress_new_records


export async function putVocabularyProgressNewRecords(
  userId: string,
  vocabularyId: number[]
): Promise<VocabularyProgressRecord[]> {
  const res = await fetch(`${API_BASE}/api/v1/put_vocabulary_progress_new_records/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "vocabulary_id": vocabularyId
    })
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}


// PUT /put_vocabulary_progress_update_records
export async function putVocabularyProgressUpdateRecords(
  records: VocabularyProgressRecord[]
): Promise<VocabularyProgressRecord[]> {
  // Format body
  const body = records.map((entry) => {
    return {
      id: entry.id,
      user_id: entry.userId,
      vocabulary_id: entry.vocabularyId,
      count_wrong: entry.countWrong,
      count_correct: entry.countCorrect
    }
  })
  const res = await fetch(`${API_BASE}/api/v1/put_vocabulary_progress_update_records`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}

// GET /get_vocabulary_id_by_policy/{user_id}
export async function getVocabularyIdByPolicy(
  userId: string
): Promise<number[]> {
  const res = await fetch(`${API_BASE}/api/v1/get_vocabulary_id_by_policy/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`Failed to get vocabulary: ${res.statusText}`);
  return res.json();
}
