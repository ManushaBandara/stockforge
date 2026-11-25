PRAGMA foreign_keys = ON;

-- =========================================================
-- 1. PRODUCTION
-- =========================================================

CREATE TABLE batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    style TEXT,
    target_count INTEGER NOT NULL DEFAULT 0 CHECK (target_count >= 0),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
);


CREATE TABLE stock_ideas (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, trend_research_json TEXT, image_prompt TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, keywords_json TEXT NOT NULL, full_json TEXT NOT NULL, created_at TEXT NOT NULL)


---- Add a relationship between a generated idea and its actual asset.
ALTER TABLE assets
ADD COLUMN stock_idea_id TEXT REFERENCES stock_ideas(id) ON DELETE SET NULL;

CREATE INDEX idx_assets_stock_idea
ON assets(stock_idea_id);


ALTER TABLE assets
ADD COLUMN is_selected INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX idx_assets_one_selected_per_idea
ON assets(stock_idea_id)
WHERE is_selected = 1
  AND stock_idea_id IS NOT NULL;

--------------------------------------------------------------------- do this

CREATE TABLE production_tasks (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT,
    notes TEXT,
    target_count INTEGER NOT NULL DEFAULT 1 CHECK (target_count > 0),
    completed_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_count >= 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'completed', 'failed', 'cancelled')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX idx_production_tasks_batch
    ON production_tasks(batch_id, status);


-- =========================================================
-- 2. ASSET LIBRARY
-- =========================================================

CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
    production_task_id TEXT REFERENCES production_tasks(id) ON DELETE SET NULL,

    original_filename TEXT NOT NULL,
    display_name TEXT,

    content_hash TEXT,
    status TEXT NOT NULL DEFAULT 'imported'
        CHECK (status IN (
            'imported', 'processing', 'metadata_pending',
            'metadata_review', 'ready_to_submit', 'queued',
            'submitting', 'submitted', 'published', 'rejected',
            'failed', 'archived'
        )),

    metadata_status TEXT NOT NULL DEFAULT 'missing'
        CHECK (metadata_status IN (
            'missing', 'generating', 'generated',
            'review_required', 'approved', 'rejected'
        )),

    submission_status TEXT NOT NULL DEFAULT 'not_submitted'
        CHECK (submission_status IN (
            'not_submitted', 'queued', 'uploading',
            'awaiting_confirmation', 'submitted', 'in_review',
            'published', 'rejected', 'failed', 'cancelled'
        )),

    source_type TEXT NOT NULL DEFAULT 'manual'
        CHECK (source_type IN ('manual', 'generated', 'imported', 'other')),
    source_details TEXT,

    is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

CREATE INDEX idx_assets_status
    ON assets(status);

CREATE INDEX idx_assets_batch
    ON assets(batch_id);

CREATE INDEX idx_assets_task
    ON assets(production_task_id);

CREATE INDEX idx_assets_hash
    ON assets(content_hash);

CREATE INDEX idx_assets_created
    ON assets(created_at DESC);

CREATE TABLE asset_files (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,

    file_type TEXT NOT NULL
        CHECK (file_type IN ('original', 'thumbnail', 'preview', 'processed', 'export', 'other')),

    storage_path TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size >= 0),

    width INTEGER CHECK (width IS NULL OR width > 0),
    height INTEGER CHECK (height IS NULL OR height > 0),

    checksum TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX idx_asset_files_asset
    ON asset_files(asset_id);

CREATE INDEX idx_asset_files_type
    ON asset_files(asset_id, file_type);


-- =========================================================
-- 3. TAGS
-- =========================================================

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE asset_tags (
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (asset_id, tag_id)
);


-- =========================================================
-- 4. METADATA
-- =========================================================

CREATE TABLE metadata_revisions (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,

    revision_number INTEGER NOT NULL CHECK (revision_number > 0),

    title TEXT NOT NULL,
    description TEXT,
    keyword_count INTEGER NOT NULL DEFAULT 0 CHECK (keyword_count >= 0),

    generated_by TEXT NOT NULL DEFAULT 'manual',
    model_name TEXT,
    prompt_template_id TEXT,

    generation_job_id TEXT,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'review_required', 'approved', 'rejected')),

    is_current INTEGER NOT NULL DEFAULT 1 CHECK (is_current IN (0, 1)),

    created_at TEXT NOT NULL,
    approved_at TEXT,

    UNIQUE (asset_id, revision_number)
);

CREATE INDEX idx_metadata_asset
    ON metadata_revisions(asset_id, revision_number DESC);

CREATE UNIQUE INDEX idx_metadata_current
    ON metadata_revisions(asset_id)
    WHERE is_current = 1;

CREATE TABLE metadata_keywords (
    id TEXT PRIMARY KEY,
    metadata_revision_id TEXT NOT NULL
        REFERENCES metadata_revisions(id) ON DELETE CASCADE,

    keyword TEXT NOT NULL,
    position INTEGER NOT NULL CHECK (position >= 0),
    created_at TEXT NOT NULL,

    UNIQUE (metadata_revision_id, position)
);

CREATE INDEX idx_metadata_keywords_revision
    ON metadata_keywords(metadata_revision_id);


-- =========================================================
-- 5. QUALITY CONTROL
-- =========================================================

CREATE TABLE quality_checks (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    job_id TEXT,

    check_type TEXT NOT NULL,
    check_name TEXT NOT NULL,

    status TEXT NOT NULL
        CHECK (status IN ('passed', 'failed', 'warning', 'skipped')),

    message TEXT,
    details_json TEXT,

    created_at TEXT NOT NULL
);

CREATE INDEX idx_quality_asset
    ON quality_checks(asset_id, created_at DESC);


-- =========================================================
-- 6. AUTOMATION RUNS
-- =========================================================

CREATE TABLE automation_runs (
    id TEXT PRIMARY KEY,

    run_type TEXT NOT NULL
        CHECK (run_type IN (
            'import', 'processing', 'metadata',
            'submission', 'batch', 'other'
        )),

    name TEXT,

    status TEXT NOT NULL DEFAULT 'idle'
        CHECK (status IN (
            'idle', 'running', 'waiting', 'pausing',
            'paused', 'stopping', 'completed',
            'failed', 'cancelled'
        )),

    total_jobs INTEGER NOT NULL DEFAULT 0,
    completed_jobs INTEGER NOT NULL DEFAULT 0,
    failed_jobs INTEGER NOT NULL DEFAULT 0,
    skipped_jobs INTEGER NOT NULL DEFAULT 0,

    config_json TEXT,

    started_at TEXT,
    finished_at TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX idx_runs_created
    ON automation_runs(created_at DESC);

CREATE INDEX idx_runs_status
    ON automation_runs(status);


-- =========================================================
-- 7. JOBS & RETRIES
-- =========================================================

CREATE TABLE jobs (
    id TEXT PRIMARY KEY,

    run_id TEXT REFERENCES automation_runs(id) ON DELETE SET NULL,
    asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
    batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,

    job_type TEXT NOT NULL
        CHECK (job_type IN (
            'import_asset', 'generate_thumbnail', 'validate_asset',
            'detect_duplicate', 'analyze_image', 'generate_metadata',
            'submit_asset', 'sync_submission_status', 'other'
        )),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending', 'queued', 'running', 'waiting',
            'paused', 'completed', 'failed', 'cancelled', 'skipped'
        )),

    priority INTEGER NOT NULL DEFAULT 0,

    payload_json TEXT,
    result_json TEXT,

    error_code TEXT,
    error_message TEXT,

    max_attempts INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts > 0),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),

    scheduled_at TEXT,
    started_at TEXT,
    finished_at TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX idx_jobs_status
    ON jobs(status, priority DESC, created_at);

CREATE INDEX idx_jobs_run
    ON jobs(run_id);

CREATE INDEX idx_jobs_asset
    ON jobs(asset_id);

CREATE INDEX idx_jobs_scheduled
    ON jobs(status, scheduled_at);

CREATE TABLE job_attempts (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

    attempt_number INTEGER NOT NULL CHECK (attempt_number > 0),

    status TEXT NOT NULL
        CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),

    error_code TEXT,
    error_message TEXT,

    started_at TEXT NOT NULL,
    finished_at TEXT,
    duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),

    UNIQUE (job_id, attempt_number)
);


-- =========================================================
-- 8. SUBMISSION QUEUES
-- =========================================================

CREATE TABLE submission_queues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),

    daily_limit INTEGER NOT NULL DEFAULT 10 CHECK (daily_limit > 0),
    interval_minutes INTEGER NOT NULL DEFAULT 15 CHECK (interval_minutes >= 0),

    auto_continue INTEGER NOT NULL DEFAULT 0 CHECK (auto_continue IN (0, 1)),

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE queue_items (
    id TEXT PRIMARY KEY,

    queue_id TEXT NOT NULL REFERENCES submission_queues(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,

    position INTEGER NOT NULL CHECK (position >= 0),

    status TEXT NOT NULL DEFAULT 'queued'
        CHECK (status IN (
            'queued', 'processing', 'waiting',
            'awaiting_confirmation', 'submitted',
            'failed', 'skipped', 'cancelled'
        )),

    scheduled_at TEXT,
    last_error TEXT,

    added_at TEXT NOT NULL,
    finished_at TEXT,

    UNIQUE (queue_id, asset_id),
    UNIQUE (queue_id, position)
);

CREATE INDEX idx_queue_items_processing
    ON queue_items(queue_id, status, position);

CREATE TABLE submissions (
    id TEXT PRIMARY KEY,

    queue_item_id TEXT NOT NULL REFERENCES queue_items(id) ON DELETE RESTRICT,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,

    metadata_revision_id TEXT REFERENCES metadata_revisions(id) ON DELETE SET NULL,

    submission_number INTEGER NOT NULL CHECK (submission_number > 0),

    status TEXT NOT NULL
        CHECK (status IN (
            'started', 'uploading', 'awaiting_confirmation',
            'submitted', 'in_review', 'published',
            'rejected', 'failed', 'cancelled'
        )),

    external_reference TEXT,

    started_at TEXT,
    submitted_at TEXT,
    reviewed_at TEXT,
    published_at TEXT,

    rejection_reason TEXT,
    error_message TEXT,

    created_at TEXT NOT NULL,

    UNIQUE (queue_item_id, submission_number)
);

CREATE INDEX idx_submissions_asset
    ON submissions(asset_id, created_at DESC);

CREATE INDEX idx_submissions_status
    ON submissions(status);

CREATE TABLE submission_events (
    id TEXT PRIMARY KEY,

    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

    event_type TEXT NOT NULL,
    message TEXT,
    details_json TEXT,

    created_at TEXT NOT NULL
);

CREATE INDEX idx_submission_events
    ON submission_events(submission_id, created_at);


-- =========================================================
-- 9. BROWSER PROFILES & SESSIONS
-- =========================================================

CREATE TABLE browser_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,

    browser_type TEXT NOT NULL DEFAULT 'chromium',
    profile_path TEXT NOT NULL UNIQUE,

    is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_browser_default
    ON browser_profiles(is_default)
    WHERE is_default = 1;

CREATE TABLE browser_sessions (
    id TEXT PRIMARY KEY,

    profile_id TEXT NOT NULL REFERENCES browser_profiles(id) ON DELETE RESTRICT,
    run_id TEXT REFERENCES automation_runs(id) ON DELETE SET NULL,

    status TEXT NOT NULL
        CHECK (status IN (
            'starting', 'running', 'waiting',
            'paused', 'closed', 'failed'
        )),

    started_at TEXT NOT NULL,
    finished_at TEXT,

    last_url TEXT,
    error_message TEXT
);

CREATE INDEX idx_browser_sessions_status
    ON browser_sessions(status);


-- =========================================================
-- 10. AI PROVIDERS & MODELS
-- =========================================================

CREATE TABLE ai_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,

    provider_type TEXT NOT NULL,
    base_url TEXT,

    is_enabled INTEGER NOT NULL DEFAULT 0 CHECK (is_enabled IN (0, 1)),
    is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),

    config_json TEXT,

    -- Reference to a secret in OS credential storage.
    -- Never store raw API keys here.
    secret_ref TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_ai_default_provider
    ON ai_providers(is_default)
    WHERE is_default = 1;

CREATE TABLE ai_models (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,

    model_name TEXT NOT NULL,
    capabilities_json TEXT,

    is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),

    created_at TEXT NOT NULL,

    UNIQUE (provider_id, model_name)
);

CREATE TABLE prompt_templates (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,
    template_type TEXT NOT NULL
        CHECK (template_type IN (
            'image_analysis', 'title', 'description',
            'keywords', 'metadata', 'other'
        )),

    template_text TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),

    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    UNIQUE (name, version)
);

CREATE TABLE ai_requests (
    id TEXT PRIMARY KEY,

    job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
    provider_id TEXT REFERENCES ai_providers(id) ON DELETE SET NULL,
    model_id TEXT REFERENCES ai_models(id) ON DELETE SET NULL,

    request_type TEXT NOT NULL,
    status TEXT NOT NULL
        CHECK (status IN ('pending', 'running', 'completed', 'failed')),

    prompt_hash TEXT,

    input_tokens INTEGER,
    output_tokens INTEGER,
    duration_ms INTEGER,

    error_message TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX idx_ai_requests_created
    ON ai_requests(created_at DESC);


-- =========================================================
-- 11. APPLICATION SETTINGS
-- =========================================================

CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
);


-- =========================================================
-- 12. ACTIVITY / EVENT HISTORY
-- =========================================================

CREATE TABLE activity_events (
    id TEXT PRIMARY KEY,

    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info'
        CHECK (severity IN ('debug', 'info', 'warning', 'error')),

    entity_type TEXT,
    entity_id TEXT,

    message TEXT NOT NULL,
    details_json TEXT,

    created_at TEXT NOT NULL
);

CREATE INDEX idx_activity_created
    ON activity_events(created_at DESC);

CREATE INDEX idx_activity_entity
    ON activity_events(entity_type, entity_id);
