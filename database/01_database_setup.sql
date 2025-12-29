/* Set-up Script */

-- =======================
-- vocabulary
-- =======================
create table public.vocabulary (
  id serial not null,
  traditional text not null,
  pinyin text null,
  english text null,
  topic text null,
  topic_english text null,
  part_of_speech text null,
  level integer null,
  simplified text null,
  relative_freq_pct real null,
  constraint vocabulary_pkey primary key (id)
) TABLESPACE pg_default;

-- =======================
-- grammar
-- =======================
create table public.grammar (
  id serial not null,
  title text not null,
  description text null,
  examples jsonb null,
  practice jsonb null,
  constraint grammar_pkey primary key (id)
) TABLESPACE pg_default;

-- =======================
-- dialogue
-- =======================
create table public.dialogue (
  id serial not null,
  path text not null,
  title text not null,
  description text null,
  constraint dialogue_pkey primary key (id),
  constraint dialogue_path_key unique (path)
) TABLESPACE pg_default;


-- =======================
-- dialogue_turn
-- =======================
create table public.dialogue_turn (
  id serial not null,
  dialogue_id integer not null,
  turn integer not null,
  speaker text null,
  mandarin text null,
  pinyin text null,
  english text null,
  user_prompt text null,
  target_sentence text null,
  hint text null,
  constraint dialogue_turn_pkey primary key (id),
  constraint dialogue_turn_dialogue_id_turn_key unique (dialogue_id, turn),
  constraint dialogue_turn_dialogue_id_fkey foreign KEY (dialogue_id) references dialogue (id) on delete CASCADE
) TABLESPACE pg_default;

-- =======================
-- lesson
-- =======================
create table public.lesson (
  id serial not null,
  title text not null,
  description text null,
  vocabulary_id integer[] null default '{}'::integer[],
  grammar_id integer[] null default '{}'::integer[],
  dialogue_id integer null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint lesson_pkey primary key (id)
) TABLESPACE pg_default;

-- =======================
-- vocabulary_progress
-- =======================
create table public.vocabulary_progress (
  id serial not null,
  user_id uuid not null,
  vocabulary_id integer not null,
  count_correct integer null default 0,
  count_wrong integer null default 0,
  constraint vocabulary_progress_pkey primary key (id),
  constraint vocabulary_progress_user_vocab_unique unique (user_id, vocabulary_id),
  constraint vocabulary_progress_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint vocabulary_progress_vocabulary_id_fkey foreign KEY (vocabulary_id) references vocabulary (id)
) TABLESPACE pg_default;