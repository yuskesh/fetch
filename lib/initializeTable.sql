CREATE TABLE IF NOT EXISTS fetch_history (
     id INTEGER PRIMARY KEY,
     domain TEXT DEFAULT "",
     links INTEGER DEFAULT 0,
     images INTEGER DEFAULT 0,
     fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);