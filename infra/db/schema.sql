-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enums
CREATE TYPE life_theme    AS ENUM ('romance','career','adventure','freedom','family');
CREATE TYPE subscription  AS ENUM ('free','premium','family');
CREATE TYPE event_type    AS ENUM ('daily','choice','emotional','turning_point','flashback','npc_message','anniversary');
CREATE TYPE emotion_tag   AS ENUM ('joy','sadness','anger','surprise','fear','nostalgia','hope','melancholy','contentment');
CREATE TYPE npc_role      AS ENUM ('friend','lover','rival','mentor','family','acquaintance');

-- Players (extends auth.users)
CREATE TABLE players (
  id               UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT         NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  subscription     subscription NOT NULL DEFAULT 'free',
  onboarding_done  BOOLEAN      NOT NULL DEFAULT false,
  settings         JSONB        NOT NULL DEFAULT '{}',
  monthly_ai_cost  NUMERIC(8,4) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Avatars
CREATE TABLE avatars (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id        UUID         NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name             TEXT         NOT NULL,
  age              INTEGER      NOT NULL CHECK (age BETWEEN 18 AND 120),
  birth_year       INTEGER      NOT NULL,
  hometown         TEXT         NOT NULL,
  current_city     TEXT         NOT NULL,
  occupation       TEXT         NOT NULL,
  dream            TEXT         NOT NULL,
  life_theme       life_theme   NOT NULL,
  appearance       JSONB        NOT NULL DEFAULT '{}',
  personality_vec  JSONB        NOT NULL DEFAULT '{}',
  health           SMALLINT     NOT NULL DEFAULT 60 CHECK (health BETWEEN 0 AND 100),
  wealth           SMALLINT     NOT NULL DEFAULT 40 CHECK (wealth BETWEEN 0 AND 100),
  love             SMALLINT     NOT NULL DEFAULT 50 CHECK (love BETWEEN 0 AND 100),
  reputation       SMALLINT     NOT NULL DEFAULT 50 CHECK (reputation BETWEEN 0 AND 100),
  happiness        SMALLINT     NOT NULL DEFAULT 55 CHECK (happiness BETWEEN 0 AND 100),
  summary_text     TEXT,
  embedding        vector(1536),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ON avatars(player_id);
CREATE INDEX ON avatars USING ivfflat(embedding vector_cosine_ops) WITH (lists = 50);

-- Story Events
CREATE TABLE story_events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id        UUID        NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
  event_date       DATE        NOT NULL,
  type             event_type  NOT NULL,
  title            TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 20),
  body             TEXT        NOT NULL CHECK (char_length(body) BETWEEN 50 AND 600),
  emotion_tag      emotion_tag NOT NULL,
  audio_theme      TEXT        NOT NULL DEFAULT 'daily',
  status_delta     JSONB       NOT NULL DEFAULT '{}',
  image_url        TEXT,
  npc_ids          UUID[]      NOT NULL DEFAULT '{}',
  choices          JSONB,
  selected_choice  TEXT,
  is_ai_generated  BOOLEAN     NOT NULL DEFAULT false,
  embedding        vector(1536),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON story_events(avatar_id, event_date DESC);
CREATE INDEX ON story_events USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);

-- NPCs
CREATE TABLE npcs (
  id               UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id        UUID       NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
  name             TEXT       NOT NULL,
  age              INTEGER,
  role             npc_role   NOT NULL,
  occupation       TEXT       NOT NULL,
  personality_vec  JSONB      NOT NULL,
  meeting_story    TEXT       NOT NULL,
  photo_seed       INTEGER    NOT NULL,
  trust            SMALLINT   NOT NULL DEFAULT  30,
  affection        SMALLINT   NOT NULL DEFAULT  30,
  jealousy         SMALLINT   NOT NULL DEFAULT   0,
  dependence       SMALLINT   NOT NULL DEFAULT  10,
  respect          SMALLINT   NOT NULL DEFAULT  20,
  mood             TEXT       NOT NULL DEFAULT 'neutral',
  last_message     TEXT,
  last_seen_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Emotion Log
CREATE TABLE emotion_log (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  avatar_id  UUID        NOT NULL REFERENCES avatars(id) ON DELETE CASCADE,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  health     SMALLINT    NOT NULL,
  wealth     SMALLINT    NOT NULL,
  love       SMALLINT    NOT NULL,
  reputation SMALLINT    NOT NULL,
  happiness  SMALLINT    NOT NULL
);

-- AI Cost Log
CREATE TABLE ai_cost_log (
  id            BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_id     UUID        NOT NULL REFERENCES players(id),
  model         TEXT        NOT NULL,
  input_tokens  INTEGER     NOT NULL,
  output_tokens INTEGER     NOT NULL,
  cost_usd      NUMERIC(10,6) NOT NULL,
  purpose       TEXT        NOT NULL,
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- World Crossings (Phase 4)
CREATE TABLE world_crossings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id_a   UUID        NOT NULL REFERENCES avatars(id),
  avatar_id_b   UUID        NOT NULL REFERENCES avatars(id),
  crossing_date DATE        NOT NULL,
  scene_text    TEXT        NOT NULL,
  similarity    REAL        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(avatar_id_a, avatar_id_b, crossing_date)
);

-- Trigger: auto updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language plpgsql;

CREATE TRIGGER avatars_updated_at BEFORE UPDATE ON avatars
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER npcs_updated_at BEFORE UPDATE ON npcs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RAG: pgvector similarity search function
CREATE OR REPLACE FUNCTION match_story_events(
  p_avatar_id       UUID,
  p_query_embedding vector(1536),
  p_match_threshold FLOAT,
  p_match_count     INT
) RETURNS TABLE (id UUID, title TEXT, body TEXT, emotion_tag emotion_tag)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT se.id, se.title, se.body, se.emotion_tag
  FROM   story_events se
  WHERE  se.avatar_id = p_avatar_id
    AND  se.embedding IS NOT NULL
    AND  1 - (se.embedding <=> p_query_embedding) > p_match_threshold
  ORDER  BY se.embedding <=> p_query_embedding
  LIMIT  p_match_count;
END;
$$;

-- Purge old emotion logs (run weekly)
SELECT cron.schedule('purge-emotion-logs', '0 3 * * 0',
  $$DELETE FROM emotion_log WHERE logged_at < now() - interval '2 years'$$
);
