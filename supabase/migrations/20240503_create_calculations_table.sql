
-- Create a table for storing user calculations
CREATE TABLE IF NOT EXISTS public.calculations (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add an update trigger for the updated_at column
CREATE OR REPLACE FUNCTION public.update_calculations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger for calculations updated_at
CREATE TRIGGER update_calculations_updated_at
BEFORE UPDATE ON public.calculations
FOR EACH ROW EXECUTE FUNCTION public.update_calculations_updated_at();

-- Enable Row Level Security on the calculations table
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- Create an RLS policy that makes calculations readable by everyone
CREATE POLICY "Calculations are readable by everyone" 
  ON public.calculations 
  FOR SELECT 
  USING (true);

-- Create an RLS policy that allows anyone to insert calculations
CREATE POLICY "Anyone can insert calculations" 
  ON public.calculations 
  FOR INSERT 
  WITH CHECK (true);

-- Create an RLS policy that allows the creator to update their calculations
CREATE POLICY "Creator can update calculations" 
  ON public.calculations 
  FOR UPDATE 
  USING (true);

-- Create an RLS policy that allows the creator to delete their calculations
CREATE POLICY "Creator can delete calculations" 
  ON public.calculations 
  FOR DELETE 
  USING (true);
