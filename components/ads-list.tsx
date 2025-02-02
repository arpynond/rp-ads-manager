"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditAdDialog } from "./edit-ad-dialog"
import { DeleteAdButton } from "./delete-ad-button"
import { CreateAdDialog } from "./create-ad-dialog"
import { useEffect, useState } from "react"
import { type Ad, getAds } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function AdsList() {
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true)
        const fetchedAds = await getAds()
        setAds(fetchedAds)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch ads:", err)
        setError("Failed to load ads. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAds()
  }, [])

  const handleCreateSuccess = (newAd: Ad) => {
    setAds((prevAds) => [...prevAds, newAd])
  }

  const handleUpdateSuccess = (updatedAd: Ad) => {
    setAds((prevAds) => prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)))
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.id !== deletedId))
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
        <h1 className="text-2xl font-bold">Ads</h1>
        <CreateAdDialog onCreateSuccess={handleCreateSuccess} />
      </div>
      {ads.length === 0 ? (
        <div>No ads found. Create one to get started!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>CAMPAIGN</TableHead>
              <TableHead>AD GROUP</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.name}</TableCell>
                <TableCell>{ad.campaignId}</TableCell>
                <TableCell>{ad.adGroupId}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      ad.status === "active"
                        ? "bg-green-100 text-green-800"
                        : ad.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {ad.status}
                  </span>
                </TableCell>
                <TableCell>{ad.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditAdDialog
                      ad={ad}
                      onSave={(updatedAd) => {
                        handleUpdateSuccess(updatedAd)
                        toast({
                          title: "Success",
                          description: "Ad updated successfully",
                        })
                      }}
                    />
                    <DeleteAdButton id={ad.id} name={ad.name} onDelete={() => handleDeleteSuccess(ad.id)} />
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

