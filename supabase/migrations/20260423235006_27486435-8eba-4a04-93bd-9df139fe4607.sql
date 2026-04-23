-- Add view_count to memes
ALTER TABLE public.memes
ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- Create meme_likes table
CREATE TABLE IF NOT EXISTS public.meme_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meme_id uuid NOT NULL REFERENCES public.memes(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meme_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_meme_likes_meme_id ON public.meme_likes(meme_id);
CREATE INDEX IF NOT EXISTS idx_meme_likes_device_id ON public.meme_likes(device_id);

ALTER TABLE public.meme_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.meme_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add likes"
  ON public.meme_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can remove likes"
  ON public.meme_likes FOR DELETE
  USING (true);

-- Increment view count
CREATE OR REPLACE FUNCTION public.increment_meme_view(_meme_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.memes
  SET view_count = view_count + 1
  WHERE id = _meme_id
  RETURNING view_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Toggle like for a device
CREATE OR REPLACE FUNCTION public.toggle_meme_like(_meme_id uuid, _device_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id uuid;
  total_likes integer;
  is_liked boolean;
BEGIN
  SELECT id INTO existing_id
  FROM public.meme_likes
  WHERE meme_id = _meme_id AND device_id = _device_id;

  IF existing_id IS NOT NULL THEN
    DELETE FROM public.meme_likes WHERE id = existing_id;
    is_liked := false;
  ELSE
    INSERT INTO public.meme_likes (meme_id, device_id) VALUES (_meme_id, _device_id);
    is_liked := true;
  END IF;

  SELECT COUNT(*)::int INTO total_likes
  FROM public.meme_likes WHERE meme_id = _meme_id;

  RETURN json_build_object('liked', is_liked, 'total_likes', total_likes);
END;
$$;

-- Get meme stats
CREATE OR REPLACE FUNCTION public.get_meme_stats(_meme_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_likes integer;
  total_views integer;
BEGIN
  SELECT COUNT(*)::int INTO total_likes
  FROM public.meme_likes WHERE meme_id = _meme_id;

  SELECT view_count INTO total_views
  FROM public.memes WHERE id = _meme_id;

  RETURN json_build_object('likes', COALESCE(total_likes, 0), 'views', COALESCE(total_views, 0));
END;
$$;

-- Total memes generated
CREATE OR REPLACE FUNCTION public.get_total_memes_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.memes;
$$;