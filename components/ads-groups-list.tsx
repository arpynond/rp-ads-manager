"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditAdsGroupDialog } from "./edit-ads-group-dialog"
import { DeleteAdsGroupButton } from "./delete-ads-group-button"
import { CreateAdsGroupDialog } from "./create-ads-group-dialog"
import { useEffect, useState } from "react"
import { type AdsGroup, getAdsGroups } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"

export function AdsGroupsList() {
  const [adsGroups, setAdsGroups] = useState<AdsGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdsGroups = async () => {
      try {
        setIsLoading(true)
        const groups = await getAdsGroups()
        setAdsGroups(groups)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch ads groups:", err)
        setError("Failed to load ads groups. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdsGroups()
  }, [])

  const handleCreateSuccess = (newGroup: AdsGroup) => {
    setAdsGroups((prevGroups) => [...prevGroups, newGroup])
  }

  const handleUpdateSuccess = (updatedGroup: AdsGroup) => {
    setAdsGroups((prevGroups) => prevGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)))
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setAdsGroups((prevGroups) => prevGroups.filter((group) => group.id !== deletedId))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ads Groups</h1>
        <CreateAdsGroupDialog onCreateSuccess={handleCreateSuccess} />
      </div>
      {adsGroups.length === 0 ? (
        <div>No ads groups found. Create one to get started!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Ad Type</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Target URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adsGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.adType}</TableCell>
                <TableCell>{group.deviceType}</TableCell>
                <TableCell>{group.template}</TableCell>
                <TableCell className="max-w-xs truncate">{group.targetUrl}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditAdsGroupDialog
                      group={group}
                      onSave={(updatedGroup) => {
                        handleUpdateSuccess(updatedGroup)
                        toast({
                          title: "Success",
                          description: "Ads Group updated successfully",
                        })
                      }}
                    />
                    <DeleteAdsGroupButton
                      id={group.id}
                      name={group.name}
                      onDelete={() => handleDeleteSuccess(group.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

