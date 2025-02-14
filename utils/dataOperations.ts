import * as SupabaseService from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase-client"
import type { Campaign, AdsGroup, Ad } from "@/types"
import { revalidatePath } from "next/cache"

// Utility function
export const generateId = SupabaseService.generateId

// Campaign functions
export async function createCampaign(
  campaign: Omit<Campaign, "id" | "ads_group_ids">,
  ads_group_ids: string[],
): Promise<Campaign> {
  const newId = generateId()
  const newCampaign: Omit<Campaign, "ads_group_ids"> = {
    ...campaign,
    id: newId,
    spend: 0,
    conversions: 0,
    ctr: 0,
  }
  const { data, error } = await supabase.from("campaigns").insert(newCampaign)
  if (error) throw error

  // Update the ads_groups with the new campaign_id
  if (ads_group_ids.length > 0) {
    const { error: updateError } = await supabase
      .from("ads_groups")
      .update({ campaign_id: newId })
      .in("id", ads_group_ids)
    if (updateError) throw updateError
  }

  return { ...newCampaign, ads_group_ids }
}

export async function updateCampaign(
  id: string,
  campaign: Partial<Omit<Campaign, "ads_group_ids">>,
  ads_group_ids: string[],
): Promise<Campaign> {
  const { data, error } = await supabase.from("campaigns").update(campaign).eq("id", id).select().single()
  if (error) throw error

  // Update the ads_groups
  const { error: clearError } = await supabase.from("ads_groups").update({ campaign_id: null }).eq("campaign_id", id)
  if (clearError) throw clearError

  if (ads_group_ids.length > 0) {
    const { error: updateError } = await supabase.from("ads_groups").update({ campaign_id: id }).in("id", ads_group_ids)
    if (updateError) throw updateError
  }

  return { ...data, ads_group_ids }
}

export const deleteCampaign = SupabaseService.deleteCampaign

export async function getCampaigns(): Promise<Campaign[]> {
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

  if (error) {
    console.error("Error fetching campaigns:", error)
    throw error
  }

  if (!data) {
    return []
  }

  // Transform the data to match our Campaign type
  return data.map((campaign) => ({
    ...campaign,
    ads_group_ids: campaign.ads_groups?.map((group: AdsGroup) => group.id) || [],
  }))
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
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
    .eq("id", id)
    .single()

  if (error) throw error

  if (!data) return null

  return {
    ...data,
    ads_group_ids: data.ads_groups?.map((group: AdsGroup) => group.id) || [],
  }
}

// Ads Group functions
export async function createAdsGroup(adsGroup: Omit<AdsGroup, "id">): Promise<AdsGroup> {
  const newId = generateId()
  const newAdsGroup: AdsGroup = {
    ...adsGroup,
    id: newId,
    ad_ids: [],
    campaign_id: adsGroup.campaign_id || null,
  }

  const { data, error } = await supabase.from("ads_groups").insert(newAdsGroup).select().single()

  if (error) throw error
  return data
}

export async function updateAdsGroup(id: string, adsGroup: Partial<AdsGroup>): Promise<AdsGroup | null> {
  const { data: updatedData, error: updateError } = await supabase
    .from("ads_groups")
    .update({
      ...adsGroup,
      campaign_id: adsGroup.campaign_id === "none" ? null : adsGroup.campaign_id,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateError) throw updateError
  return updatedData
}

export async function getAdsGroups(): Promise<AdsGroup[]> {
  const { data, error } = await supabase.from("ads_groups").select("*, campaign:campaign_id(*)")

  if (error) throw error
  return data
}

export async function deleteAdsGroup(id: string): Promise<boolean> {
  try {
    // First delete all associated ads
    const { error: adsError } = await supabase.from("ads").delete().eq("ads_group_id", id)

    if (adsError) throw adsError

    // Then delete the ads group
    const { error: groupError } = await supabase.from("ads_groups").delete().eq("id", id)

    if (groupError) throw groupError

    return true
  } catch (error) {
    console.error("Error deleting ads group:", error)
    throw error
  }
}

export const getAdsGroup = SupabaseService.getAdsGroup

// Ad functions
export async function createAd(ad: Omit<Ad, "id">): Promise<Ad> {
  const newId = generateId()
  const newAd: Ad = { ...ad, id: newId }
  const { data, error } = await supabase.from("ads").insert(newAd).select().single()

  if (error) {
    console.error("Error creating ad:", error)
    throw error
  }

  console.log("Created ad:", data)
  return data
}

// Implement deleteAd locally instead of importing from SupabaseService
export async function deleteAd(id: string): Promise<boolean> {
  const { error } = await supabase.from("ads").delete().eq("id", id)

  if (!error) {
    // Revalidate all paths that might show ads
    revalidatePath("/ads")
    revalidatePath("/ads-groups")
    revalidatePath("/campaigns")
  }

  return !error
}

export const updateAd = SupabaseService.updateAd

export async function getAds(): Promise<Ad[]> {
  const { data, error } = await supabase.from("ads").select(`
    *,
    ads_group:ads_group_id (
      *,
      campaign:campaign_id (*)
    )
  `)

  if (error) {
    console.error("Error fetching ads:", error)
    throw error
  }

  console.log("Fetched ads with related data:", data)
  return data
}

export const getAd = SupabaseService.getAd
export const pauseCampaign = SupabaseService.pauseCampaign
export const stopCampaign = SupabaseService.stopCampaign

// Additional functions
export async function duplicateAdsGroup(id: string): Promise<{ adsGroup: AdsGroup; ads: Ad[] } | null> {
  const groupToDuplicate = await getAdsGroup(id)
  if (!groupToDuplicate) return null

  const newGroupId = generateId()
  const newGroup: AdsGroup = {
    ...groupToDuplicate,
    id: newGroupId,
    name: `${groupToDuplicate.name} (Copy)`,
    ad_ids: [],
    campaign_id: null,
  }

  const createdGroup = await createAdsGroup(newGroup)

  const allAds = await getAds()
  const associatedAds = allAds.filter((ad) => ad.ads_group_id === id)
  const newAds: Ad[] = []

  for (const ad of associatedAds) {
    const newAd = await createAd({
      ...ad,
      name: `${ad.name} (Copy)`,
      ads_group_id: newGroupId,
    })
    newAds.push(newAd)
  }

  await updateAdsGroup(newGroupId, { ad_ids: newAds.map((ad) => ad.id) })

  return { adsGroup: createdGroup, ads: newAds }
}

export async function duplicateAd(id: string): Promise<Ad | null> {
  const adToDuplicate = await getAd(id)
  if (!adToDuplicate) return null

  const adsGroup = await getAdsGroup(adToDuplicate.ads_group_id)
  if (!adsGroup) return null

  const newAd = await createAd({
    ...adToDuplicate,
    name: `${adToDuplicate.name} (Copy)`,
    status: "paused",
    type: adsGroup.ad_type,
  })

  await updateAdsGroup(adsGroup.id, {
    ad_ids: [...adsGroup.ad_ids, newAd.id],
  })

  return newAd
}

