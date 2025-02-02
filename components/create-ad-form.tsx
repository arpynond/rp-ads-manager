"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { type Ad, createAd, updateAd } from "@/utils/dataOperations"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ad name must be at least 2 characters.",
  }),
  campaignId: z.string().min(1, {
    message: "Please select a campaign.",
  }),
  adGroupId: z.string().min(1, {
    message: "Please select an ad group.",
  }),
  status: z.enum(["active", "paused", "archived"]),
  type: z.string().min(1, {
    message: "Please select an ad type.",
  }),
  creativeUrl: z.string().url({
    message: "Please enter a valid URL for the creative.",
  }),
})

interface CreateAdFormProps {
  initialData?: Ad
  mode: "create" | "edit"
  onSave: (ad: Ad) => void
  onCreateSuccess?: (newAd: Ad) => void
}

export function CreateAdForm({ initialData, mode, onSave, onCreateSuccess }: CreateAdFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      campaignId: "",
      adGroupId: "",
      status: "active",
      type: "",
      creativeUrl: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let newAd: Ad

    if (mode === "create") {
      newAd = await createAd(values)
      if (onCreateSuccess) {
        onCreateSuccess(newAd)
      }
    } else {
      if (!initialData) return
      newAd = (await updateAd(initialData.id, values)) as Ad
    }

    onSave(newAd)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="campaignId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Campaign" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Fetch and populate campaigns */}
                  <SelectItem value="campaign1">Campaign 1</SelectItem>
                  <SelectItem value="campaign2">Campaign 2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adGroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ad Group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Fetch and populate ad groups */}
                  <SelectItem value="adgroup1">Ad Group 1</SelectItem>
                  <SelectItem value="adgroup2">Ad Group 2</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ad Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creativeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Creative URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/creative.jpg" {...field} />
              </FormControl>
              <FormDescription>Enter the URL for the ad creative</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{mode === "create" ? "Create Ad" : "Update Ad"}</Button>
      </form>
    </Form>
  )
}

