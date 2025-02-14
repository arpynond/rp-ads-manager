import { z } from "zod"

export interface Campaign {
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
  ads_groups: AdsGroup[]
  ads_group_ids?: string[] // This will be computed from ads_groups
  created_at?: string
  updated_at?: string
}

export interface AdsGroup {
  id: string
  name: string
  ad_type: string
  device_type: string
  template: string
  target_url: string
  campaign_id: string | null
  ad_ids: string[]
}

export interface Ad {
  id: string
  name: string
  ads_group_id: string
  status: "active" | "paused" | "archived"
  type: string
}

export type FormValues = z.infer<typeof formSchema>

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  goal: z.enum(["CPA", "ROAS"]),
  budget: z.coerce.number().min(0),
  ads_group_ids: z.array(z.string()).default([]),
  bid_strategy: z.enum(["Highest Volume", "Highest Value", "CPA Goal"]),
  status: z.enum(["active", "learning", "learning limited"]).optional(),
  contextual_targeting: z.object({
    categories: z.array(z.string()).default([]),
    keywords: z.string().optional(),
  }),
  user_segmentation: z.object({
    demographics: z.array(z.string()).default([]),
    behaviors: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
  }),
})

export interface AnalyticsData {
  id: string
  campaign: string
  adGroup: string
  ad: string
  clicks: number
  impressions: number
  ctr: number
  cost: number
  conversions: number
  revenue: number
}

