import { AdsList } from "@/components/ads-list"

export default function AdsGroupPage({ params }: { params: { groupId: string } }) {
  return <AdsList groupId={params.groupId} />
}

