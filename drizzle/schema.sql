CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK(category IN ('Job', 'Project', 'Health', 'Friend', 'Fun', 'Life')),
  title TEXT NOT NULL,
  section TEXT NOT NULL CHECK(section IN ('TODO', 'DOING', 'DONE')) DEFAULT 'TODO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  key TEXT NOT NULL CHECK(key IN ('goal', 'done', 'remaining', 'note', 'outcome', 'deadline', 'target')),
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_section ON tasks(section);
CREATE INDEX IF NOT EXISTS idx_task_attributes_task_id ON task_attributes(task_id);
