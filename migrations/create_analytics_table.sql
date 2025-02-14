-- Check if the analytics table exists
DO $$
LANGUAGE plpgsql
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'analytics') THEN
      -- Create the analytics table
      CREATE TABLE analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id UUID,
          ads_group_id UUID,
          ad_id UUID,
          clicks INTEGER DEFAULT 0,
          impressions INTEGER DEFAULT 0,
          ctr DECIMAL(5,2) DEFAULT 0,
          cost DECIMAL(10,2) DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          revenue DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Add foreign key constraints
      ALTER TABLE analytics
          ADD CONSTRAINT fk_analytics_campaign
          FOREIGN KEY (campaign_id)
          REFERENCES campaigns(id)
          ON DELETE SET NULL;

      ALTER TABLE analytics
          ADD CONSTRAINT fk_analytics_ads_group
          FOREIGN KEY (ads_group_id)
          REFERENCES ads_groups(id)
          ON DELETE SET NULL;

      ALTER TABLE analytics
          ADD CONSTRAINT fk_analytics_ad
          FOREIGN KEY (ad_id)
          REFERENCES ads(id)
          ON DELETE SET NULL;

      -- Create indexes for better query performance
      CREATE INDEX idx_analytics_campaign_id ON analytics(campaign_id);
      CREATE INDEX idx_analytics_ads_group_id ON analytics(ads_group_id);
      CREATE INDEX idx_analytics_ad_id ON analytics(ad_id);

      -- Add RLS policy
      ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

      -- Create a more permissive RLS policy for authenticated users
      CREATE POLICY "Enable read access for authenticated users" ON analytics
          FOR SELECT
          TO authenticated
          USING (true);

      -- Create an update trigger for updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_analytics_updated_at
          BEFORE UPDATE ON analytics
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      -- Grant necessary permissions
      GRANT SELECT ON analytics TO authenticated;
  END IF;
END $$;

