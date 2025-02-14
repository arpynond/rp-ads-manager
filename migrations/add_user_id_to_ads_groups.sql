-- Check if the user_id column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ads_groups' AND column_name = 'user_id'
    ) THEN
        -- Add the user_id column
        ALTER TABLE ads_groups ADD COLUMN user_id UUID;

        -- Add a foreign key constraint
        ALTER TABLE ads_groups
        ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id);

        -- Update the RLS policy to include user_id check
        DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ads_groups;
        
        CREATE POLICY "Allow all operations for authenticated users" ON ads_groups
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

