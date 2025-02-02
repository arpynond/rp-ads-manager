import { getFromLocalStorage, setToLocalStorage } from "./localStorage"
import initialData from "@/data/initialData.json"

function log(message: string) {
  if (process.env.NEXT_PUBLIC_ENABLE_LOGS === "true") {
    console.log(message)
  }
}

export function initializeData() {
  log("Initializing data...")

  if (typeof window !== "undefined") {
    const isInitialized = getFromLocalStorage<boolean>("dataInitialized")

    if (!isInitialized) {
      log("Data not initialized. Proceeding with initialization...")

      setToLocalStorage("adsGroups", initialData.adsGroups)
      setToLocalStorage("campaigns", initialData.campaigns)
      setToLocalStorage("dataInitialized", true)

      log("Data initialization complete")
    } else {
      log("Data already initialized. Skipping initialization.")
    }
  } else {
    log("Not in browser environment. Skipping initialization.")
  }
}

