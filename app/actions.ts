"use server"

import { supabase } from "@/lib/supabase-client"
import type { Campaign } from "@/types"

export async function updateCampaignStatus(id: string, status: Campaign["status"]) {
  const { data, error } = await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", id)
    .select(`
      *,
      ads_groups (
        id,
        name,
        ad_type,
        device_type,
        template,
        target_url
      )
    `)
    .single()

  if (error) throw error
  return data as Campaign
}

export async function deleteCampaign(id: string) {
  const { error } = await supabase.from("campaigns").delete().eq("id", id)
  if (error) throw error
  return true
}

