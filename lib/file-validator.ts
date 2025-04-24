export async function validateCsvFile(file: File): Promise<void> {
  // Check file type
  if (!file.name.endsWith(".csv")) {
    throw new Error("Please upload a CSV file")
  }

  // Check file size (rough estimate for 50,000 entries)
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB as a reasonable limit
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the maximum limit")
  }

  // Read the file to check for SMILES column
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content) {
          reject(new Error("Failed to read file content"))
          return
        }

        // Get the header line
        const lines = content.split("\n")
        if (lines.length === 0) {
          reject(new Error("CSV file is empty"))
          return
        }

        const header = lines[0].trim()
        const columns = header.split(",").map((col) => col.trim().replace(/^"|"$/g, ""))

        // Check for SMILES column
        if (!columns.some((col) => col.toUpperCase() === "SMILES")) {
          reject(new Error('CSV file must contain a "SMILES" column'))
          return
        }

        // Check number of entries (rows)
        if (lines.length > 50001) {
          // Header + 50,000 entries
          reject(new Error("CSV file exceeds the limit of 50,000 entries"))
          return
        }

        resolve()
      } catch (error) {
        reject(new Error("Failed to validate CSV file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read the file"))
    }

    // Read the first few KB to check the header
    const slice = file.slice(0, 4096)
    reader.readAsText(slice)
  })
}
