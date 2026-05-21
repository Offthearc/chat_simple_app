-- Default chat rooms
insert into chat_rooms (name, description, is_default) values
  ('general', 'General discussion for everyone', true),
  ('ai-news', 'Latest AI research and news', true),
  ('tech-talk', 'Software, tools, and engineering', true),
  ('random', 'Off-topic and fun stuff', true)
on conflict do nothing;
