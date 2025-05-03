
-- Create a table for storing AI-generated content
CREATE TABLE IF NOT EXISTS public.ai_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id TEXT NOT NULL REFERENCES public.calculations(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a trigger for updated_at
CREATE TRIGGER update_ai_generated_content_updated_at
BEFORE UPDATE ON public.ai_generated_content
FOR EACH ROW EXECUTE FUNCTION public.update_calculations_updated_at();

-- Create an index on calculation_id and content_type for faster lookups
CREATE INDEX idx_ai_content_calculation_type ON public.ai_generated_content (calculation_id, content_type);

-- Enable Row Level Security
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;

-- Create policies for read/write access
CREATE POLICY "AI generated content is readable by everyone" 
  ON public.ai_generated_content 
  FOR SELECT 
  USING (true);
  
CREATE POLICY "Anyone can insert AI generated content" 
  ON public.ai_generated_content 
  FOR INSERT 
  WITH CHECK (true);
  
CREATE POLICY "Anyone can update AI generated content" 
  ON public.ai_generated_content 
  FOR UPDATE 
  USING (true);

-- Create a table for storing chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id TEXT NOT NULL REFERENCES public.calculations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on calculation_id for faster lookups
CREATE INDEX idx_chat_messages_calculation_id ON public.chat_messages (calculation_id);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for read/write access
CREATE POLICY "Chat messages are readable by everyone" 
  ON public.chat_messages 
  FOR SELECT 
  USING (true);
  
CREATE POLICY "Anyone can insert chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (true);
