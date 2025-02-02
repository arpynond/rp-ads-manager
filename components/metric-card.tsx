import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ElementType
  positive?: boolean
}

export function MetricCard({ title, value, change, icon: Icon, positive = true }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-2">{value}</h3>
            <p className={cn("text-sm mt-2", positive ? "text-green-600" : "text-red-600")}>{change} vs last month</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

