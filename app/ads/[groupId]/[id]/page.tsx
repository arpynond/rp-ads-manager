import { AdPageClient } from "@/components/ad-page-client"

export default function AdPage({ params }: { params: { groupId: string; id: string } }) {
  const { groupId, id } = params

  if (!id || groupId === "all") {
    throw new Error("Invalid parameters")
  }

  return <AdPageClient id={id} groupId={groupId} />
}

