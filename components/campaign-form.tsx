"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { type Campaign, createCampaign, updateCampaign, type AdsGroup, getAdsGroups } from "@/utils/dataOperations"
import { useToast } from "@/components/ui/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  goal: z.enum(["CPA", "ROAS"]),
  budget: z.coerce.number().min(0),
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
  bid_strategy: z.enum(["Highest Volume", "Highest Value", "CPA Goal"]),
  ads_group_ids: z.array(z.string()).default([]),
})

type FormValues = z.infer<typeof formSchema>

interface CampaignFormProps {
  initialData?: Campaign
  mode: "create" | "edit"
}

const categoryOptions = [
  { label: "Beauty", value: "beauty" },
  { label: "Automotive", value: "automotive" },
  { label: "Finance", value: "finance" },
  { label: "Technology", value: "technology" },
  { label: "Travel", value: "travel" },
  { label: "Food & Drink", value: "food_drink" },
]

const demographicOptions = [
  { label: "Age 18-24", value: "age_18_24" },
  { label: "Age 25-34", value: "age_25_34" },
  { label: "Age 35-44", value: "age_35_44" },
  { label: "Age 45-54", value: "age_45_54" },
  { label: "Age 55+", value: "age_55_plus" },
]

const behaviorOptions = [
  { label: "Frequent Online Shoppers", value: "frequent_shoppers" },
  { label: "Tech Enthusiasts", value: "tech_enthusiasts" },
  { label: "Fitness Enthusiasts", value: "fitness_enthusiasts" },
  { label: "Travelers", value: "travelers" },
]

const interestOptions = [
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
  { label: "Movies", value: "movies" },
  { label: "Fashion", value: "fashion" },
  { label: "Cooking", value: "cooking" },
]

export function CampaignForm({ initialData, mode }: CampaignFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [availableAdsGroups, setAvailableAdsGroups] = useState<AdsGroup[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      goal: initialData?.goal || "CPA",
      budget: initialData?.budget || 0,
      ads_group_ids: initialData?.ads_group_ids || [],
      status: initialData?.status || "active",
      contextual_targeting: initialData?.contextual_targeting || {
        categories: [],
        keywords: "",
      },
      user_segmentation: initialData?.user_segmentation || {
        demographics: [],
        behaviors: [],
        interests: [],
      },
      bid_strategy: initialData?.bid_strategy || "Highest Volume",
    },
  })

  useEffect(() => {
    const fetchAdsGroups = async () => {
      try {
        setIsLoading(true)
        const groups = await getAdsGroups()
        const availableGroups = groups.filter((group) => !group.campaignId || group.campaignId === initialData?.id)
        setAvailableAdsGroups(availableGroups)
      } catch (error) {
        console.error("Error fetching ads groups:", error)
        toast({
          title: "Error",
          description: "Failed to load ads groups",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdsGroups()
  }, [toast, initialData])

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        ads_group_ids: initialData.ads_group_ids || [],
        contextual_targeting: initialData.contextual_targeting || {
          categories: [],
          keywords: "",
        },
        user_segmentation: initialData.user_segmentation || {
          demographics: [],
          behaviors: [],
          interests: [],
        },
      })
    }
  }, [initialData, form])

  async function onSubmit(values: FormValues) {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const { ads_group_ids, ...campaignData } = values

      if (mode === "create") {
        await createCampaign(campaignData, ads_group_ids)
        toast({
          title: "Success",
          description: "Campaign created successfully",
        })
      } else {
        if (!initialData) throw new Error("No initial data for edit mode")
        await updateCampaign(initialData.id, campaignData, ads_group_ids)
        toast({
          title: "Success",
          description: "Campaign updated successfully",
        })
      }

      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save campaign",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Enter the basic information for your campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Campaign name" {...field} disabled={mode === "edit"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "edit"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Campaign Goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CPA">CPA</SelectItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <SelectItem value="ROAS" disabled>
                                  ROAS
                                </SelectItem>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>For mature Campaign only</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ads_group_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ads Groups</FormLabel>
                  <MultiSelect
                    options={availableAdsGroups.map((group) => ({
                      label: group.name,
                      value: group.id,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select Ads Groups"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bid_strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bid Strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Highest Volume">Highest Volume</SelectItem>
                      <SelectItem value="Highest Value">Highest Value</SelectItem>
                      <SelectItem value="CPA Goal">CPA Goal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="contextual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contextual">Contextual Targeting</TabsTrigger>
            <TabsTrigger value="user">User Segmentation</TabsTrigger>
          </TabsList>
          <TabsContent value="contextual">
            <Card>
              <CardHeader>
                <CardTitle>Contextual Targeting</CardTitle>
                <CardDescription>
                  Display your ads on web pages and apps with content closely related to your products or services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contextual_targeting.categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Contextual Targeting</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={categoryOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select categories"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contextual_targeting.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keyword Contextual Targeting</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter keywords separated by commas"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Segmentation</CardTitle>
                <CardDescription>
                  Divide your audience into specific groups based on characteristics like demographics, behavior
                  patterns, and interests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="user_segmentation.demographics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demographics</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={demographicOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select demographics"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_segmentation.behaviors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Behaviors</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={behaviorOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select behaviors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_segmentation.interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={interestOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select interests"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </div>
            ) : mode === "create" ? (
              "Create Campaign"
            ) : (
              "Update Campaign"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface Campaign {
  id: string
  name: string
  goal: "CPA" | "ROAS"
  budget: number
  ads_group_ids: string[]
  status?: "active" | "learning" | "learning limited"
  contextual_targeting: {
    categories: string[]
    keywords?: string
  }
  user_segmentation: {
    demographics: string[]
    behaviors: string[]
    interests: string[]
  }
  spend?: number
  conversions?: number
  ctr?: number
  bid_strategy: "Highest Volume" | "Highest Value" | "CPA Goal"
  ads_groups?: { id: string }[]
}

