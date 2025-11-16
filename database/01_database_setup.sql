-- ======================================================
--  Language Learning App: Database Schema (PostgreSQL)
--  Safe to run multiple times (idempotent)
-- ======================================================

-- =======================
-- Vocabulary Table
-- =======================
CREATE TABLE IF NOT EXISTS vocabulary (
    id SERIAL PRIMARY KEY,
    vocabulary TEXT NOT NULL,                  -- e.g., 名字
    pinyin TEXT,                               -- e.g., míngzi
    vocabulary_english TEXT,                   -- e.g., name
    topic TEXT,                                -- e.g., 個人資料
    topic_english TEXT,                        -- e.g., personal information
    part_of_speech TEXT,                       -- e.g., (N)
    level INTEGER,                             -- HSK level or custom level
);

-- =======================
-- Grammar Table
-- =======================
CREATE TABLE IF NOT EXISTS grammar (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,                       -- e.g., "Basic sentence order"
    description TEXT,                          -- explanation
    examples JSONB,                            -- array of example sentences
    practice JSONB,                            -- array of GrammarPracticeItem objects
);

-- =======================
-- Dialogue Table
-- =======================
CREATE TABLE IF NOT EXISTS dialogue (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,                 -- e.g., "at-a-restaurant"
    title TEXT NOT NULL,                       -- human-readable title
    description TEXT,                          -- scenario summary
);


-- =======================
-- Dialogue Turn Table
-- =======================
CREATE TABLE IF NOT EXISTS dialogue_turn (
    id SERIAL PRIMARY KEY,
    dialogue_id INTEGER NOT NULL REFERENCES dialogue(id) ON DELETE CASCADE,
    turn INTEGER NOT NULL,                     -- turn number in dialogue
    speaker TEXT,                              -- e.g., "Server", "User"
    mandarin TEXT,                             -- Mandarin text
    pinyin TEXT,                               -- pinyin text
    english TEXT,                              -- English translation
    user_prompt TEXT,                          -- instruction to user
    target_sentence TEXT,                      -- expected user response
    hint TEXT,                                 -- helpful hint
    UNIQUE(dialogue_id, turn)
);

-- =======================
-- Lesson Table
-- =======================
CREATE TABLE IF NOT EXISTS lesson (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    -- We'll store related vocab, grammar, and dialogue references in arrays for flexibility
    vocabulary_id INTEGER[] DEFAULT '{}',
    grammar_id INTEGER[] DEFAULT '{}',
    dialogue_id INTEGER,  -- each lesson can optionally link to one dialogue
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- Trigger: Auto-update updated_at
-- =======================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to all tables that have updated_at
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS update_%I_timestamp ON %I;',
            tbl.tablename, tbl.tablename
        );
        EXECUTE format(
            'CREATE TRIGGER update_%I_timestamp
             BEFORE UPDATE ON %I
             FOR EACH ROW
             EXECUTE FUNCTION update_timestamp();',
            tbl.tablename, tbl.tablename
        );
    END LOOP;
END $$;
