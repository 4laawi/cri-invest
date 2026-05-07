-- Run this in your Supabase SQL Editor to add missing columns to the projects table
-- This enables saving all form details for the admin to view.

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS investor_type TEXT,
ADD COLUMN IF NOT EXISTS civility TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS cin TEXT,
ADD COLUMN IF NOT EXISTS commune TEXT,
ADD COLUMN IF NOT EXISTS is_listed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

