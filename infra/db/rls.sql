ALTER TABLE players       ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars       ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE npcs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_log   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "players_self" ON players
  USING (id = auth.uid());

CREATE POLICY "avatars_owner" ON avatars
  USING (player_id = auth.uid());

CREATE POLICY "story_events_owner" ON story_events
  USING (avatar_id IN (SELECT id FROM avatars WHERE player_id = auth.uid()));

CREATE POLICY "npcs_owner" ON npcs
  USING (avatar_id IN (SELECT id FROM avatars WHERE player_id = auth.uid()));

CREATE POLICY "emotion_log_owner" ON emotion_log
  USING (avatar_id IN (SELECT id FROM avatars WHERE player_id = auth.uid()));

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
