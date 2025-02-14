import fs from "fs"
import path from "path"

function findDuplicateReact() {
  const nodeModules = path.join(process.cwd(), "node_modules")
  const reactInstances = []

  function searchDir(dir: string) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        if (item === "react" && fs.existsSync(path.join(fullPath, "package.json"))) {
          const pkg = JSON.parse(fs.readFileSync(path.join(fullPath, "package.json"), "utf8"))
          reactInstances.push({
            path: fullPath,
            version: pkg.version,
          })
        } else if (item !== "node_modules") {
          const nestedNodeModules = path.join(fullPath, "node_modules")
          if (fs.existsSync(nestedNodeModules)) {
            searchDir(nestedNodeModules)
          }
        }
      }
    }
  }

  searchDir(nodeModules)
  return reactInstances
}

const duplicates = findDuplicateReact()
if (duplicates.length > 1) {
  console.error("Multiple React instances found:")
  duplicates.forEach((instance) => {
    console.error(`- ${instance.path} (version ${instance.version})`)
  })
  process.exit(1)
} else {
  console.log("Only one React instance found:", duplicates[0]?.path)
}

