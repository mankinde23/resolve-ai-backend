
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL CHECK (length(trim(text)) > 0),
    predicted_category VARCHAR(100) NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    confidence DOUBLE PRECISION
        CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at
    ON tickets (created_at DESC);
