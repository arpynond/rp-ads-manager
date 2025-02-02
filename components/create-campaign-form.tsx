"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { type Campaign, createCampaign, updateCampaign } from "@/utils/dataOperations"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  type: z.enum(["CPA", "ROAS"]),
  status: z.enum(["live", "learning"]),
  budget: z.number().min(0),
  totalBudget: z.number().min(0),
  conversions: z.number().min(0),
  ctr: z.number().min(0).max(100),
})

interface CreateCampaignFormProps {
  initialData?: Campaign
  mode: "create" | "edit"
  onSave: (campaign: Campaign) => void
  onCreateSuccess?: (newCampaign: Campaign) => void
}

export function CreateCampaignForm({ initialData, mode, onSave, onCreateSuccess }: CreateCampaignFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: undefined,
      status: undefined,
      budget: 0,
      totalBudget: 0,
      conversions: 0,
      ctr: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let newCampaign: Campaign

    if (mode === "create") {
      newCampaign = await createCampaign(values)
      if (onCreateSuccess) {
        onCreateSuccess(newCampaign)
      }
    } else {
      if (!initialData) return
      newCampaign = (await updateCampaign(initialData.id, values)) as Campaign
    }

    onSave(newCampaign)
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
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Campaign name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Campaign Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CPA">CPA</SelectItem>
                  <SelectItem value="ROAS">ROAS</SelectItem>
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
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
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
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Budget</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conversions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversions</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ctr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTR (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{mode === "create" ? "Create Campaign" : "Update Campaign"}</Button>
      </form>
    </Form>
  )
}

