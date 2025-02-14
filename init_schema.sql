-- Enable RLS on the ads_groups table
ALTER TABLE ads_groups ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON ads_groups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- If you want to restrict operations based on user_id, you can modify the policy like this:
-- Assuming you have a user_id column in your ads_groups table
-- CREATE POLICY "Allow all operations for authenticated users on their own ads groups" ON ads_groups
--     FOR ALL
--     TO authenticated
--     USING (auth.uid() = user_id)
--     WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions to the authenticated role
GRANT ALL ON ads_groups TO authenticated;

