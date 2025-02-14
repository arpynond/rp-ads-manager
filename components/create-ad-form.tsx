"use client"

import { useState, useMemo, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { type Ad, type AdsGroup, updateAd } from "@/utils/dataOperations"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { type Campaign, getCampaigns } from "@/utils/dataOperations"
import { createAdAction } from "@/utils/server-actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ad name must be at least 2 characters.",
  }),
  ads_group_id: z.string().min(1, {
    message: "Please select an ads group.",
  }),
  status: z.enum(["active", "paused", "archived"]),
  type: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateAdFormProps {
  initialData?: Ad
  mode: "create" | "edit"
  adsGroups: AdsGroup[]
  preSelectedAdsGroup?: AdsGroup | null
  isStatusDisabled?: boolean
}

export function CreateAdForm({
  initialData,
  mode,
  adsGroups,
  preSelectedAdsGroup,
  isStatusDisabled = false,
}: CreateAdFormProps) {
  console.log("🎨 CreateAdForm - Component mounting:", {
    mode,
    hasInitialData: !!initialData,
    initialDataDetails: initialData,
    adsGroupsCount: adsGroups.length,
    preSelectedGroup: preSelectedAdsGroup?.id,
  })

  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const fetchedCampaigns = await getCampaigns()
      setCampaigns(fetchedCampaigns)
    }
    fetchCampaigns()
  }, [])

  // Calculate initial values once
  const defaultValues = useMemo(() => {
    console.log("🎨 CreateAdForm - Calculating default values")
    const groupIdToUse = initialData?.ads_group_id || preSelectedAdsGroup?.id || ""
    const selectedGroup = adsGroups.find((group) => group.id === groupIdToUse)

    const values = {
      name: initialData?.name || "",
      ads_group_id: groupIdToUse,
      status: initialData?.status || "active",
      type: selectedGroup?.ad_type || initialData?.type || "",
    }

    console.log("🎨 CreateAdForm - Default values calculated:", values)
    return values
  }, [initialData, preSelectedAdsGroup?.id, adsGroups])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Get the current ads group ID from form
  const selectedAdsGroupId = form.watch("ads_group_id")

  // Memoize the selected ads group
  const selectedAdsGroup = useMemo(() => {
    const group = adsGroups.find((group) => group.id === selectedAdsGroupId)
    console.log("🎨 CreateAdForm - Selected group updated:", {
      selectedId: selectedAdsGroupId,
      found: !!group,
      groupDetails: group,
    })
    return group
  }, [adsGroups, selectedAdsGroupId])

  const getReturnUrl = () => {
    if (typeof window !== "undefined") {
      const history = JSON.parse(localStorage.getItem("navigationHistory") || "[]")
      const returnUrl = history.length > 1 ? history[history.length - 2] : `/ads/${selectedAdsGroupId}`
      console.log("🎨 CreateAdForm - Calculated return URL:", {
        historyLength: history.length,
        returnUrl,
        fullHistory: history,
      })
      return returnUrl
    }
    return `/ads/${selectedAdsGroupId}`
  }

  const onSubmit = async (values: FormValues) => {
    console.log("🎨 CreateAdForm - Form submitted:", values)
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        console.log("🎨 CreateAdForm - Creating new ad")
        await createAdAction(values as Ad)
        toast({
          title: "Success",
          description: "Ad created successfully",
        })
      } else {
        console.log("🎨 CreateAdForm - Updating existing ad:", initialData?.id)
        if (!initialData) throw new Error("No initial data for edit mode")
        await updateAd(initialData.id, values)
        toast({
          title: "Success",
          description: "Ad updated successfully",
        })
      }

      router.refresh()
      const returnUrl = getReturnUrl()
      console.log("🎨 CreateAdForm - Navigation after success:", returnUrl)
      router.push(returnUrl)
    } catch (error) {
      console.error("🎨 CreateAdForm - Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save ad",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    const returnUrl = getReturnUrl()
    router.push(returnUrl)
  }

  const campaignName = useMemo(() => {
    if (!selectedAdsGroup?.campaign_id) return "Not assigned"
    const campaign = campaigns.find((c) => c.id === selectedAdsGroup.campaign_id)
    return campaign ? campaign.name : "Not assigned"
  }, [selectedAdsGroup, campaigns])

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Ad name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ads_group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ads Group</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      const newGroup = adsGroups.find((group) => group.id === value)
                      if (newGroup) {
                        form.setValue("type", newGroup.ad_type)
                      }
                    }}
                    value={field.value}
                    disabled={!!preSelectedAdsGroup || mode === "edit"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ads Group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adsGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="campaignId"
              render={() => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormControl>
                          <Input value={campaignName} disabled className="bg-muted cursor-not-allowed" />
                        </FormControl>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This value is based on the selected Ads Group</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Type</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormControl>
                          <Input {...field} disabled className="bg-muted cursor-not-allowed" />
                        </FormControl>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This value is based on the selected Ads Group</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isStatusDisabled}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isStatusDisabled && (
              <p className="text-sm text-muted-foreground mt-1">Status cannot be changed for archived ads.</p>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </div>
                ) : mode === "create" ? (
                  "Create Ad"
                ) : (
                  "Update Ad"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

