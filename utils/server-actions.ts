"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase-client"
import type { Campaign, AdsGroup, Ad, AnalyticsData } from "@/types"

// Helper function for generating UUIDs that works in both server and client environments
function generateUUID() {
  return self.crypto.randomUUID()
}

export async function fetchCampaigns() {
  const { data, error } = await supabase.from("campaigns").select(`
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

  if (error) throw error
  return data as Campaign[]
}

export async function fetchAdsGroups() {
  const { data, error } = await supabase.from("ads_groups").select("*, campaign:campaign_id(*)")

  if (error) throw error
  return data as AdsGroup[]
}

export async function fetchAds() {
  const { data, error } = await supabase.from("ads").select(`
    *,
    ads_group:ads_group_id (
      *,
      campaign:campaign_id (*)
    )
  `)

  if (error) throw error
  return data as Ad[]
}

export async function deleteAdAction(id: string) {
  const { error } = await supabase.from("ads").delete().eq("id", id)
  if (error) throw error

  // Revalidate all relevant paths
  revalidatePath("/ads")
  revalidatePath("/ads-groups")
  revalidatePath("/campaigns")
  return true
}

export async function createAdAction(ad: Omit<Ad, "id">) {
  const { data, error } = await supabase.from("ads").insert(ad).select().single()
  if (error) throw error

  // Revalidate the ads list
  revalidatePath("/ads")
  revalidatePath("/ads-groups")

  return data
}

export async function updateAdType(adId: string, adsGroupId: string) {
  // Get the ads group to determine the correct type
  const { data: adsGroup } = await supabase.from("ads_groups").select("ad_type").eq("id", adsGroupId).single()

  if (!adsGroup) throw new Error("Ads group not found")

  // Update the ad with the correct type
  const { data: updatedAd, error } = await supabase
    .from("ads")
    .update({ type: adsGroup.ad_type })
    .eq("id", adId)
    .select()
    .single()

  if (error) throw error

  // Revalidate all relevant paths
  revalidatePath("/ads")
  revalidatePath("/ads-groups")

  return updatedAd
}

export async function fetchAnalyticsData(): Promise<AnalyticsData[]> {
  try {
    // Use explicit joins instead of implicit relationships
    const { data, error } = await supabase
      .from("analytics")
      .select(`
        id,
        clicks,
        impressions,
        ctr,
        cost,
        conversions,
        revenue,
        campaigns:campaign_id(name),
        ads_groups:ads_group_id(name),
        ads:ad_id(name)
      `)
      .limit(1000)

    // If there's a table existence error, log it but don't throw
    if (error && error.code === "42P01") {
      // PostgreSQL code for undefined_table
      console.log("Analytics table does not exist yet")
      return []
    }

    // For other errors, log them but return empty array
    if (error) {
      console.error("Error fetching analytics data:", error)
      return []
    }

    // If no data exists yet, return empty array
    if (!data || data.length === 0) {
      return []
    }

    // Map the data to our AnalyticsData type with proper null checking
    return data.map((item) => ({
      id: item.id || generateUUID(),
      campaign: item.campaigns?.name || "Unknown",
      adGroup: item.ads_groups?.name || "Unknown",
      ad: item.ads?.name || "Unknown",
      clicks: item.clicks || 0,
      impressions: item.impressions || 0,
      ctr: item.ctr || 0,
      cost: item.cost || 0,
      conversions: item.conversions || 0,
      revenue: item.revenue || 0,
    }))
  } catch (error) {
    // Log the error but don't throw
    console.error("Error in fetchAnalyticsData:", error)
    return []
  }
}

