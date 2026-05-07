CREATE TABLE IF NOT EXISTS students (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  initials TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
  id      TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  room    TEXT,
  color   TEXT,
  icon    TEXT
);

CREATE TABLE IF NOT EXISTS teachers (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  title    TEXT,
  email    TEXT,
  phone    TEXT,
  initials TEXT,
  color    TEXT
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id TEXT NOT NULL REFERENCES teachers(id),
  class_id   TEXT NOT NULL REFERENCES classes(id),
  PRIMARY KEY (teacher_id, class_id)
);

CREATE TABLE IF NOT EXISTS schedule (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  day        TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time   TEXT NOT NULL,
  class_id   TEXT NOT NULL REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS deadlines (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT NOT NULL,
  title      TEXT NOT NULL,
  class_id   TEXT REFERENCES classes(id),
  type       TEXT NOT NULL,
  note       TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deadlines_date ON deadlines(date);
CREATE INDEX IF NOT EXISTS idx_schedule_day   ON schedule(day);
