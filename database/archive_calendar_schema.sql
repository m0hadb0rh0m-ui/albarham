-- Reference for the applied production migration family_archive_source_and_event_calendar.
-- Do not rerun blindly; this is the migration definition, not a full schema export.
ALTER TABLE public.family_member_content ADD COLUMN IF NOT EXISTS event_at timestamptz, ADD COLUMN IF NOT EXISTS source_note text;
ALTER TABLE public.family_member_content ADD CONSTRAINT family_content_event_kind CHECK (event_at IS NULL OR kind='occasion'), ADD CONSTRAINT family_content_source_length CHECK (source_note IS NULL OR char_length(source_note)<=500);
CREATE INDEX IF NOT EXISTS family_content_event_calendar_idx ON public.family_member_content(event_at) WHERE published AND kind='occasion' AND event_at IS NOT NULL;
