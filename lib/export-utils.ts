// export-utils.ts

export function downloadCSV(data: any[], columns: string[], filename = "results.csv") {
  const csvContent =
    columns.join(",") +
    "\n" +
    data
      .map((row) =>
        columns
          .map((col) => {
            let value = row[col] ?? ""
            if (col === "Structure" && typeof value === "string" && value.startsWith("data:image")) {
              const base64 = value.split(",")[1] || ""
              return JSON.stringify(base64)
            }
            return JSON.stringify(value)
          })
          .join(",")
      )
      .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
