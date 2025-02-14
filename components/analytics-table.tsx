"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { TableHeader } from "@/components/ui/table" // Import TableHeader
import { OrderableMultiSelect } from "@/components/ui/orderable-multi-select"
import { ArrowUpDown, ChevronDown, Filter, ArrowUp, ArrowDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { AnalyticsData } from "@/types"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const dimensionColumns: (keyof AnalyticsData)[] = ["campaign", "adGroup", "ad"]
const metricColumns: (keyof AnalyticsData)[] = ["clicks", "impressions", "ctr", "cost", "conversions", "revenue"]

const allColumns: ColumnDef<AnalyticsData>[] = [
  {
    accessorKey: "campaign",
    header: "Campaign",
    cell: ({ row }) => <div className="capitalize">{row.getValue("campaign")}</div>,
    filterFn: "multiSelect",
  },
  {
    accessorKey: "adGroup",
    header: "Ad Group",
    cell: ({ row }) => <div className="capitalize">{row.getValue("adGroup")}</div>,
    filterFn: "multiSelect",
  },
  {
    accessorKey: "ad",
    header: "Ad",
    cell: ({ row }) => <div className="capitalize">{row.getValue("ad")}</div>,
    filterFn: "multiSelect",
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => <div className="text-right">{row.getValue("clicks")}</div>,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
    cell: ({ row }) => <div className="text-right">{row.getValue("impressions")}</div>,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "ctr",
    header: "CTR (%)",
    cell: ({ row }) => <div className="text-right">{(row.getValue("ctr") as number).toFixed(2)}%</div>,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "cost",
    header: "Cost ($)",
    cell: ({ row }) => <div className="text-right">${(row.getValue("cost") as number).toFixed(2)}</div>,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
    cell: ({ row }) => <div className="text-right">{row.getValue("conversions")}</div>,
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "revenue",
    header: "Revenue ($)",
    cell: ({ row }) => <div className="text-right">${(row.getValue("revenue") as number).toFixed(2)}</div>,
    filterFn: "inNumberRange",
  },
]

interface AnalyticsTableProps {
  initialData: AnalyticsData[]
}

export function AnalyticsTable({ initialData }: AnalyticsTableProps) {
  const [pivotColumns, setPivotColumns] = useState<string[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnOrder, setColumnOrder] = useState<string[]>([])

  // Add empty state handling
  if (!initialData || initialData.length === 0) {
    return (
      <div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[300px]">
                <OrderableMultiSelect
                  options={dimensionColumns.map((col) => ({
                    label: allColumns.find((c) => c.accessorKey === col)?.header as string,
                    value: col,
                  }))}
                  selected={pivotColumns}
                  onChange={handlePivotChange}
                  placeholder="Select pivot columns"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.accessorKey as string}
                      className="capitalize"
                      checked={table.getColumn(column.accessorKey as string).getIsVisible()}
                      onCheckedChange={(value) =>
                        table.getColumn(column.accessorKey as string).toggleVisibility(!!value)
                      }
                    >
                      {column.header as string}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No analytics data available.</p>
            <p className="text-sm text-muted-foreground">
              Please ensure your analytics table is set up and populated with data.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const pivotedData = useMemo(() => {
    if (pivotColumns.length === 0) return initialData

    const pivoted: Record<string, AnalyticsData> = {}
    initialData.forEach((row) => {
      const pivotKey = pivotColumns.map((col) => row[col as keyof AnalyticsData]).join("|")
      if (!pivoted[pivotKey]) {
        pivoted[pivotKey] = { ...row }
      } else {
        metricColumns.forEach((metric) => {
          pivoted[pivotKey][metric] = ((pivoted[pivotKey][metric] as number) + (row[metric] as number)) as never
        })
      }
    })
    return Object.values(pivoted)
  }, [pivotColumns, initialData])

  const columns = useMemo(() => {
    if (pivotColumns.length === 0) return allColumns
    return [
      ...pivotColumns.map((col) => allColumns.find((c) => c.accessorKey === col)!),
      ...metricColumns.map((metric) => allColumns.find((c) => c.accessorKey === metric)!),
    ]
  }, [pivotColumns])

  const reorderColumn = (draggedColumnId: string, targetColumnId: string) => {
    const currentOrder = columnOrder.length ? columnOrder : columns.map((col) => col.accessorKey as string)
    const newOrder = [...currentOrder]

    const draggedIndex = currentOrder.indexOf(draggedColumnId)
    const targetIndex = currentOrder.indexOf(targetColumnId)

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedColumnId)

    setColumnOrder(newOrder)
  }

  const table = useReactTable({
    data: pivotedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    enableColumnResizing: true,
    enableMultiSort: true,
    filterFns: {
      multiSelect: (row, id, filterValues: string[]) => {
        const value = row.getValue(id)
        return !filterValues.length || filterValues.includes(value)
      },
      inNumberRange: (row, columnId, filterValue: [number, number]) => {
        const rowValue = row.getValue(columnId) as number
        const [min, max] = filterValue
        if (min !== undefined && max !== undefined) {
          return rowValue >= min && rowValue <= max
        } else if (min !== undefined) {
          return rowValue >= min
        } else if (max !== undefined) {
          return rowValue <= max
        }
        return true
      },
    },
  })

  const handlePivotChange = (selected: string[]) => {
    setPivotColumns(selected)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-4">
          <div className="w-[300px]">
            <OrderableMultiSelect
              options={dimensionColumns.map((col) => ({
                label: allColumns.find((c) => c.accessorKey === col)?.header as string,
                value: col,
              }))}
              selected={pivotColumns}
              onChange={handlePivotChange}
              placeholder="Select pivot columns"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.accessorKey as string}
                  className="capitalize"
                  checked={table.getColumn(column.accessorKey as string).getIsVisible()}
                  onCheckedChange={(value) => table.getColumn(column.accessorKey as string).toggleVisibility(!!value)}
                >
                  {column.header as string}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="bg-muted/50">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1 py-1">
                            <div
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation()
                                header.column.getCanPin() && e.dataTransfer.setData("columnId", header.column.id)
                              }}
                              onDragOver={(e) => {
                                e.preventDefault()
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                const draggedColumnId = e.dataTransfer.getData("columnId")
                                if (draggedColumnId && draggedColumnId !== header.column.id) {
                                  reorderColumn(draggedColumnId, header.column.id)
                                }
                              }}
                              className="flex items-center gap-1 cursor-move"
                            >
                              <DragHandleDots2Icon className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => header.column.toggleSorting(undefined, true)}
                                className="-ml-3 h-8 data-[state=open]:bg-accent"
                              >
                                <span className="font-medium">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                {header.column.getIsSorted() === "asc" && <ArrowUp className="ml-1.5 h-3.5 w-3.5" />}
                                {header.column.getIsSorted() === "desc" && <ArrowDown className="ml-1.5 h-3.5 w-3.5" />}
                                {!header.column.getIsSorted() && (
                                  <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
                                )}
                                {header.column.getIsSorted() && (
                                  <span className="ml-1 text-xs text-muted-foreground">
                                    {sorting.findIndex((s) => s.id === header.column.id) + 1}
                                  </span>
                                )}
                              </Button>
                            </div>
                            {header.column.getCanFilter() && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                      "h-7 w-7 p-0 hover:bg-muted",
                                      header.column.getFilterValue() ? "text-primary" : "text-muted-foreground/70",
                                    )}
                                  >
                                    <Filter className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                  {metricColumns.includes(header.column.id as keyof AnalyticsData) ? (
                                    <div className="p-2 space-y-2">
                                      <Label>Range</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          placeholder="Min"
                                          value={(header.column.getFilterValue() as [number, number])?.[0] ?? ""}
                                          onChange={(e) => {
                                            const min = e.target.value ? Number(e.target.value) : undefined
                                            const max = (header.column.getFilterValue() as [number, number])?.[1]
                                            header.column.setFilterValue(min !== undefined ? [min, max] : undefined)
                                          }}
                                          className="w-full"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Max"
                                          value={(header.column.getFilterValue() as [number, number])?.[1] ?? ""}
                                          onChange={(e) => {
                                            const max = e.target.value ? Number(e.target.value) : undefined
                                            const min = (header.column.getFilterValue() as [number, number])?.[0]
                                            header.column.setFilterValue(max !== undefined ? [min, max] : undefined)
                                          }}
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <Command className="rounded-lg">
                                      <CommandInput
                                        placeholder={`Search ${header.column.columnDef.header as string}...`}
                                        className="h-9"
                                      />
                                      <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup className="p-1.5">
                                          {Array.from(
                                            new Set(
                                              table
                                                .getPreFilteredRowModel()
                                                .rows.map((row) => row.getValue(header.column.id)),
                                            ),
                                          ).map((value) => (
                                            <CommandItem
                                              key={value as string}
                                              onSelect={() => {
                                                const currentFilters =
                                                  (header.column.getFilterValue() as string[]) || []
                                                const newFilters = currentFilters.includes(value as string)
                                                  ? currentFilters.filter((v) => v !== value)
                                                  : [...currentFilters, value]
                                                header.column.setFilterValue(newFilters.length ? newFilters : undefined)
                                              }}
                                              className="flex items-center gap-2 px-2"
                                            >
                                              <div
                                                className={cn(
                                                  "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                  ((header.column.getFilterValue() as string[]) || []).includes(
                                                    value as string,
                                                  )
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                                )}
                                              >
                                                <Check className="h-4 w-4" />
                                              </div>
                                              <span>{value as string}</span>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  )}
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

