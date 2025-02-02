"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { type AdsGroup, createAdsGroup, updateAdsGroup } from "@/utils/dataOperations"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ads Group name must be at least 2 characters.",
  }),
  adType: z.enum(["Banner", "Rewarded", "Playable", "Interstitial"]),
  deviceType: z.enum(["Mobile", "Desktop"]),
  template: z.string(),
  targetUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
})

interface CreateAdsGroupFormProps {
  initialData?: AdsGroup
  mode: "create" | "edit"
  onSave: (group: AdsGroup) => void
  onCreateSuccess?: (newGroup: AdsGroup) => void
}

export function CreateAdsGroupForm({ initialData, mode, onSave, onCreateSuccess }: CreateAdsGroupFormProps) {
  const [adType, setAdType] = useState<string | undefined>(initialData?.adType)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      adType: undefined,
      deviceType: undefined,
      template: undefined,
      targetUrl: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
      setAdType(initialData.adType)
    }
  }, [initialData, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let newGroup: AdsGroup

    if (mode === "create") {
      newGroup = await createAdsGroup(values)
      if (onCreateSuccess) {
        onCreateSuccess(newGroup)
      }
    } else {
      if (!initialData) return
      newGroup = (await updateAdsGroup(initialData.id, values)) as AdsGroup
    }

    onSave(newGroup)
    router.refresh()
  }

  const templateOptions = {
    Banner: ["Image", "Button", "Two-Buttons", "Gallery"],
    Rewarded: ["Video"],
    Playable: ["Interactive HTML"],
    Interstitial: ["Static", "Video", "HTML", "Interactive HTML"],
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="adType"
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
          name="deviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type Compatibility</FormLabel>
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
                  {adType &&
                    templateOptions[adType as keyof typeof templateOptions].map((template) => (
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
          name="targetUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>Enter the landing page or app store link for your ad.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{mode === "create" ? "Create Ads Group" : "Update Ads Group"}</Button>
      </form>
    </Form>
  )
}

