"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

type MultiSelectProps = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items..." }: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (option: Option) => {
    if (selected.includes(option.value)) {
      onChange(selected.filter((item) => item !== option.value))
    } else {
      onChange([...selected, option.value])
    }
  }

  const handleRemove = (option: Option) => {
    onChange(selected.filter((item) => item !== option.value))
  }

  const availableOptions = options.filter((option) => !selected.includes(option.value))

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "w-full justify-between",
            "hover:bg-background hover:text-foreground",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2",
          )}
        >
          {selected.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selected.map((selectedValue) => {
                const option = options.find((o) => o.value === selectedValue)
                return option ? (
                  <Badge key={option.value} variant="secondary" className="mr-1">
                    {option.label}
                    <span
                      className="ml-1 cursor-pointer ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(option)
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                ) : null
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {availableOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center px-2 py-1.5 cursor-pointer",
                "hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
          {availableOptions.length === 0 && (
            <div className="px-2 py-1.5 text-muted-foreground">No options available</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

