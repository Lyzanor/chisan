ALTER TABLE selection_shelves ADD COLUMN input jsonb NOT NULL DEFAULT '{"kind":"auto","instruction":"","title":"Mi selección"}';
--> statement-breakpoint
DROP INDEX selection_shelves_published_idx;
DROP INDEX selection_shelves_pending_idx;
CREATE UNIQUE INDEX selection_shelves_published_idx ON selection_shelves (user_id) WHERE status = 'published' AND selection_id IS NULL;
CREATE UNIQUE INDEX selection_shelves_pending_idx ON selection_shelves (user_id) WHERE status IN ('received','queued','processing','review','ready') AND selection_id IS NULL;
CREATE UNIQUE INDEX selection_shelves_selection_published_idx ON selection_shelves (selection_id) WHERE status = 'published';
CREATE UNIQUE INDEX selection_shelves_selection_pending_idx ON selection_shelves (selection_id) WHERE status IN ('received','queued','processing','review','ready');

--> statement-breakpoint
ALTER TABLE selection_shelves ADD COLUMN event_request jsonb;

--> statement-breakpoint
ALTER TABLE selection_shelf_whatsapp_links ADD COLUMN instruction varchar(600) NOT NULL DEFAULT '';
