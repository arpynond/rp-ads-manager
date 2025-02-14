"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { type AdsGroup, createAdsGroup, updateAdsGroup } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"
import type { Campaign } from "@/types"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ads Group name must be at least 2 characters.",
  }),
  ad_type: z.enum(["Banner", "Rewarded", "Playable", "Interstitial"]),
  device_type: z.enum(["Mobile", "Desktop"]),
  template: z.string(),
  target_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  campaign_id: z.string().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateAdsGroupFormProps {
  initialData?: AdsGroup
  mode: "create" | "edit"
  onSave: (group: AdsGroup) => void
  campaigns: Campaign[]
}

export function CreateAdsGroupForm({ initialData, mode, onSave, campaigns }: CreateAdsGroupFormProps) {
  console.log("CreateAdsGroupForm rendered", { initialData, mode, campaigns })

  const [ad_type, setAdType] = useState<string | undefined>(initialData?.ad_type)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      ad_type: undefined,
      device_type: undefined,
      template: undefined,
      target_url: "",
      campaign_id: null,
    },
  })

  useEffect(() => {
    console.log("Form values changed:", form.getValues())
  }, [form.watch(), form.getValues])

  useEffect(() => {
    if (initialData) {
      console.log("Resetting form with initialData:", initialData)
      form.reset({
        ...initialData,
        campaign_id: initialData.campaign_id || null,
      })
      setAdType(initialData.ad_type)
    }
  }, [initialData, form])

  const templateOptions = {
    Banner: ["Image", "Button", "Two-Buttons", "Gallery"],
    Rewarded: ["Video"],
    Playable: ["Interactive HTML"],
    Interstitial: ["Static", "Video", "HTML", "Interactive HTML"],
  }

  async function onSubmit(values: FormValues) {
    console.log("Form submitted with values:", values)
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const submitData = {
        ...values,
        campaign_id: values.campaign_id === "none" ? null : values.campaign_id,
        ad_ids: initialData?.ad_ids || [],
      }

      let result: AdsGroup
      if (mode === "create") {
        console.log("Creating new Ads Group")
        result = await createAdsGroup(submitData as AdsGroup)
        toast({
          title: "Success",
          description: "Ads Group created successfully",
        })
      } else {
        console.log("Updating existing Ads Group")
        if (!initialData) throw new Error("No initial data for edit mode")
        result = await updateAdsGroup(initialData.id, submitData as Partial<AdsGroup>)
        if (!result) throw new Error("Failed to update Ads Group")
        toast({
          title: "Success",
          description: "Ads Group updated successfully",
        })
      }

      console.log("Ads Group operation successful, result:", result)
      onSave(result)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ads Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Ads Group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaign_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Campaign" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Campaign</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
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
          name="ad_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setAdType(value)
                  form.setValue("template", undefined)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ad Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Banner">Banner</SelectItem>
                  <SelectItem value="Rewarded">Rewarded</SelectItem>
                  <SelectItem value="Playable">Playable</SelectItem>
                  <SelectItem value="Interstitial">Interstitial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="device_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Device Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile (Phone/Tablet)</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ad_type &&
                    templateOptions[ad_type as keyof typeof templateOptions].map((template) => (
                      <SelectItem key={template} value={template}>
                        {template}
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
          name="target_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          onClick={() => console.log("Submit button clicked")}
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Ads Group"
              : "Update Ads Group"}
        </Button>
      </form>
    </Form>
  )
}

