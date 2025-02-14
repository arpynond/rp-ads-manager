import { CreateAdPageClient } from "@/components/create-ad-page-client"

export default function NewAdPage({ params }: { params: { groupId: string } }) {
  const { groupId } = params

  if (groupId === "all") {
    throw new Error("Invalid group ID")
  }

  return <CreateAdPageClient groupId={groupId} />
}

