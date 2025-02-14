// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string
          name: string
          goal: "CPA" | "ROAS"
          status: "active" | "paused" | "stopped" | "learning" | "learning limited"
          budget: number
          spend: number
          conversions: number
          ctr: number
          bid_strategy: "Highest Volume" | "Highest Value" | "CPA Goal"
          contextual_targeting: {
            categories: string[]
            keywords: string
          }
          user_segmentation: {
            demographics: string[]
            behaviors: string[]
            interests: string[]
          }
          ads_group_ids: string[]
          created_at?: string
          updated_at?: string
        }
      }
      ads_groups: {
        Row: {
          id: string
          name: string
          ad_type: string
          device_type: string
          template: string
          target_url: string
          campaign_id: string | null
          ad_ids: string[]
          user_id: string
        }
      }
      ads: {
        Row: {
          id: string
          name: string
          ads_group_id: string
          status: "active" | "paused" | "archived"
          type: string
        }
      }
    }
  }
}

