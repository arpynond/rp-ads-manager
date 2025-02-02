import { getFromLocalStorage, setToLocalStorage } from "./localStorage"

// Types
export interface AdsGroup {
  id: string
  name: string
  adType: string
  deviceType: string
  template: string
  targetUrl: string
}

export interface Campaign {
  id: string
  name: string
  type: string
  status: "live" | "learning"
  budget: number
  totalBudget: number
  conversions: number
  ctr: number
}

export interface Ad {
  id: string
  name: string
  campaignId: string
  adGroupId: string
  status: "active" | "paused" | "archived"
  type: string
  creativeUrl: string
}

// Ads Groups Operations
export async function getAdsGroups(): Promise<AdsGroup[]> {
  const groups = getFromLocalStorage<AdsGroup[]>("adsGroups")
  return groups || [] // Return an empty array if groups is null or undefined
}

export async function getAdsGroup(id: string): Promise<AdsGroup | undefined> {
  const groups = await getAdsGroups()
  return groups.find((group) => group.id === id)
}

export async function createAdsGroup(group: Omit<AdsGroup, "id">): Promise<AdsGroup> {
  const newGroup: AdsGroup = { ...group, id: generateId() }
  const groups = await getAdsGroups()
  const updatedGroups = [...groups, newGroup]
  setToLocalStorage("adsGroups", updatedGroups)
  return newGroup
}

export async function updateAdsGroup(id: string, group: Partial<AdsGroup>): Promise<AdsGroup | null> {
  const groups = await getAdsGroups()
  const index = groups.findIndex((g) => g.id === id)
  if (index === -1) return null
  const updatedGroup = { ...groups[index], ...group, id } // Ensure id is preserved
  groups[index] = updatedGroup
  setToLocalStorage("adsGroups", groups)
  return updatedGroup
}

export async function deleteAdsGroup(id: string): Promise<boolean> {
  const groups = await getAdsGroups()
  const updatedGroups = groups.filter((group) => group.id !== id)
  setToLocalStorage("adsGroups", updatedGroups)
  return groups.length !== updatedGroups.length
}

// Campaigns Operations
export async function getCampaigns(): Promise<Campaign[]> {
  const campaigns = getFromLocalStorage<Campaign[]>("campaigns")
  return campaigns || []
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const campaigns = await getCampaigns()
  return campaigns.find((campaign) => campaign.id === id)
}

export async function createCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
  const newCampaign: Campaign = { ...campaign, id: generateId() }
  const campaigns = await getCampaigns()
  const updatedCampaigns = [...campaigns, newCampaign]
  setToLocalStorage("campaigns", updatedCampaigns)
  return newCampaign
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign | null> {
  const campaigns = await getCampaigns()
  const index = campaigns.findIndex((c) => c.id === id)
  if (index === -1) return null
  const updatedCampaign = { ...campaigns[index], ...campaign, id }
  campaigns[index] = updatedCampaign
  setToLocalStorage("campaigns", campaigns)
  return updatedCampaign
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const campaigns = await getCampaigns()
  const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== id)
  setToLocalStorage("campaigns", updatedCampaigns)
  return campaigns.length !== updatedCampaigns.length
}

// Ads Operations
export async function getAds(): Promise<Ad[]> {
  const ads = getFromLocalStorage<Ad[]>("ads")
  return ads || []
}

export async function getAd(id: string): Promise<Ad | undefined> {
  const ads = await getAds()
  return ads.find((ad) => ad.id === id)
}

export async function createAd(ad: Omit<Ad, "id">): Promise<Ad> {
  const newAd: Ad = { ...ad, id: generateId() }
  const ads = await getAds()
  const updatedAds = [...ads, newAd]
  setToLocalStorage("ads", updatedAds)
  return newAd
}

export async function updateAd(id: string, ad: Partial<Ad>): Promise<Ad | null> {
  const ads = await getAds()
  const index = ads.findIndex((a) => a.id === id)
  if (index === -1) return null
  const updatedAd = { ...ads[index], ...ad, id }
  ads[index] = updatedAd
  setToLocalStorage("ads", ads)
  return updatedAd
}

export async function deleteAd(id: string): Promise<boolean> {
  const ads = await getAds()
  const updatedAds = ads.filter((ad) => ad.id !== id)
  setToLocalStorage("ads", updatedAds)
  return ads.length !== updatedAds.length
}

// Utility function
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

