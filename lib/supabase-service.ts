import { supabase } from "./supabase-client"
import type { Ad, AdsGroup, Campaign } from "@/types"

// Helper function to generate ID
export function generateId(): string {
  return crypto.randomUUID()
}

// Ads operations
export async function createAd(ad: Omit<Ad, "id">): Promise<Ad> {
  const newId = generateId()
  const newAd: Ad = { ...ad, id: newId }
  const { data, error } = await supabase.from("ads").insert(newAd)
  if (error) throw error
  return newAd
}

export async function updateAd(id: string, ad: Partial<Ad>): Promise<Ad | null> {
  const { data, error } = await supabase.from("ads").update(ad).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteAd(id: string): Promise<boolean> {
  const { error } = await supabase.from("ads").delete().eq("id", id)
  return !error
}

export async function getAds(): Promise<Ad[]> {
  const { data, error } = await supabase.from("ads").select("*")
  if (error) throw error
  return data
}

export async function getAd(id: string): Promise<Ad | null> {
  const { data, error } = await supabase.from("ads").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

// Ads Groups operations
export async function createAdsGroup(adsGroup: Omit<AdsGroup, "id">): Promise<AdsGroup> {
  const newId = generateId()
  const newAdsGroup: AdsGroup = { ...adsGroup, id: newId, ad_ids: [] }
  const { data, error } = await supabase.from("ads_groups").insert(newAdsGroup)
  if (error) throw error
  return newAdsGroup
}

export async function updateAdsGroup(id: string, adsGroup: Partial<AdsGroup>): Promise<AdsGroup | null> {
  const { data, error } = await supabase.from("ads_groups").update(adsGroup).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteAdsGroup(id: string): Promise<boolean> {
  const { error: adsError } = await supabase.from("ads").delete().eq("ads_group_id", id)
  if (adsError) throw adsError

  const { error: groupError } = await supabase.from("ads_groups").delete().eq("id", id)
  return !groupError
}

export async function getAdsGroups(): Promise<AdsGroup[]> {
  const { data, error } = await supabase.from("ads_groups").select("*")
  if (error) throw error
  return data
}

export async function getAdsGroup(id: string): Promise<AdsGroup | null> {
  const { data, error } = await supabase.from("ads_groups").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

// Campaigns operations
export async function createCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
  const newId = generateId()
  const newCampaign: Campaign = {
    ...campaign,
    id: newId,
    ads_group_ids: campaign.ads_group_ids || [],
    status: campaign.ads_group_ids && campaign.ads_group_ids.length > 0 ? "active" : "paused",
    spend: campaign.spend || 0,
    conversions: campaign.conversions || 0,
    ctr: campaign.ctr || 0,
  }
  const { data, error } = await supabase.from("campaigns").insert(newCampaign)
  if (error) throw error
  return newCampaign
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
  const { data, error } = await supabase.from("campaigns").update(campaign).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const { error } = await supabase.from("campaigns").delete().eq("id", id)
  return !error
}

export async function getCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase.from("campaigns").select("*")
  if (error) throw error
  return data
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function pauseCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase.from("campaigns").update({ status: "paused" }).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function stopCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase.from("campaigns").update({ status: "stopped" }).eq("id", id).select().single()
  if (error) throw error
  return data
}

