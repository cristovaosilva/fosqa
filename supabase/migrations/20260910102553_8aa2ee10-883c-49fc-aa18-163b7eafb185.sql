CREATE TABLE public.ambassador_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ambassador_applications TO anon, authenticated;
GRANT ALL ON public.ambassador_applications TO service_role;
ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an ambassador application"
  ON public.ambassador_applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);