-- Check if the adsGroupId column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ads' AND column_name = 'adsGroupId'
    ) THEN
        -- Rename the column from adsGroupId to ads_group_id
        ALTER TABLE ads RENAME COLUMN "adsGroupId" TO ads_group_id;
    ELSIF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ads' AND column_name = 'ads_group_id'
    ) THEN
        -- Add the ads_group_id column if it doesn't exist
        ALTER TABLE ads ADD COLUMN ads_group_id UUID;

        -- Add a foreign key constraint
        ALTER TABLE ads
        ADD CONSTRAINT fk_ads_group
        FOREIGN KEY (ads_group_id) 
        REFERENCES ads_groups(id);
    END IF;
END $$;

-- Update the RLS policy to use ads_group_id
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ads;

CREATE POLICY "Allow all operations for authenticated users" ON ads
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM ads_groups
        WHERE ads_groups.id = ads.ads_group_id
        AND ads_groups.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM ads_groups
        WHERE ads_groups.id = ads.ads_group_id
        AND ads_groups.user_id = auth.uid()
    )
);

