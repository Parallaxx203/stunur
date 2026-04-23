-- Memes table for community feed
CREATE TABLE public.memes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  prompt TEXT,
  author TEXT NOT NULL DEFAULT 'STONER_ANON',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memes"
  ON public.memes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can post memes"
  ON public.memes FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_memes_created_at ON public.memes (created_at DESC);

-- Public storage bucket for generated memes
INSERT INTO storage.buckets (id, name, public)
VALUES ('stoner-memes', 'stoner-memes', true);

CREATE POLICY "Stoner memes are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stoner-memes');

CREATE POLICY "Anyone can upload stoner memes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stoner-memes');