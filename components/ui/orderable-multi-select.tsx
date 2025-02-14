"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

type OrderableMultiSelectProps = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function OrderableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
}: OrderableMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

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

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...selected]
    const [reorderedItem] = newOrder.splice(dragIndex, 1)
    newOrder.splice(hoverIndex, 0, reorderedItem)
    onChange(newOrder)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen(!open)}
        >
          {selected.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selected.map((selectedValue, index) => {
                const option = options.find((o) => o.value === selectedValue)
                return option ? (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="mr-1 cursor-move"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString())
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10)
                      handleReorder(dragIndex, index)
                    }}
                  >
                    {option.label}
                    <span
                      className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleSelect(option)} className="cursor-pointer">
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <X className="h-4 w-4" />
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

