// Match enums found in the backend
export const LANGUAGES = ["ENGLISH", "MANDARIN"] as const;
export type Language = typeof LANGUAGES[number];