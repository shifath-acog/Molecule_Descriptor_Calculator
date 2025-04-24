"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileUp, Loader2 } from "lucide-react"
import { ResultsTable } from "@/components/results-table"
import { validateCsvFile } from "@/lib/file-validator"

export function DescriptorCalculator() {
  const [file, setFile] = useState<File | null>(null)
  const [descriptorType, setDescriptorType] = useState<string>("1D/2D")
  const [method, setMethod] = useState<string>("RDKit")
  const [filterOption, setFilterOption] = useState<string>("None")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any[] | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setResults(null)

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      try {
        await validateCsvFile(selectedFile)
        setFile(selectedFile)
      } catch (err) {
        setFile(null)
        setError(err instanceof Error ? err.message : String(err))
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a CSV file first.")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("descriptor_type", descriptorType)
      formData.append("method", method)
      formData.append("filter_option", filterOption)

      const response = await fetch("/api/calculate-descriptors", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const responseText = await response.text()
      let parsedData
      try {
        parsedData = JSON.parse(responseText)
      } catch {
        throw new Error("Failed to parse API response")
      }

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const columnNames = Object.keys(parsedData[0])
        setColumns(columnNames)

        const chunkSize = 100
        const processedResults = []

        for (let i = 0; i < Math.min(parsedData.length, 1000); i += chunkSize) {
          const chunk = parsedData.slice(i, i + chunkSize)
          processedResults.push(...chunk)
          if (i + chunkSize < parsedData.length) {
            await new Promise((resolve) => setTimeout(resolve, 0))
          }
        }

        setResults(processedResults)
      } else {
        throw new Error("No molecules pass the filter")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 px-4 py-6 md:px-8 lg:px-16 max-w-screen-2xl mx-auto ">
      <Card className="p-6 bg-white shadow-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out mb-6">
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="file-upload" className="block mb-2 text-gray-700">
              Upload CSV File (Max 50,000 entries)
            </Label>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-24 border-2 border-dashed border-grey-300 text-gray-600 hover:bg-gray-50 transition"
              >
                <FileUp className="h-6 w-6 text-emerald-500" />
                <span>{file ? file.name : "Click to upload CSV"}</span>
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descriptor-type" className="text-gray-700">Descriptor Type</Label>
              <Select value={descriptorType} onValueChange={setDescriptorType}>
                <SelectTrigger id="descriptor-type">
                  <SelectValue placeholder="Select descriptor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D/2D">1D/2D</SelectItem>
                  <SelectItem value="3D">3D</SelectItem>
                  <SelectItem value="FF-based">FF-based</SelectItem>
                  <SelectItem value="QM-based">QM-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-method" className="text-gray-700">Calculation Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="calculation-method">
                  <SelectValue placeholder="Select calculation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RDKit">RDKit</SelectItem>
                  <SelectItem value="PaDEL">PaDEL</SelectItem>
                  <SelectItem value="Mordred">Mordred</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-option" className="text-gray-700">Filter Option</Label>
              <Select value={filterOption} onValueChange={setFilterOption}>
                <SelectTrigger id="filter-option">
                  <SelectValue placeholder="Select filter option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Molecular fragment">Molecular fragment</SelectItem>
                  <SelectItem value="SMOL drug">SMOL drug</SelectItem>
                  <SelectItem value="PROTAC">PROTAC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={!file || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Calculate Descriptors"
            )}
          </Button>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Results Table */}
      {results && results.length > 0 && (
  <div className="mt-12">
    <ResultsTable results={results} columns={columns} />
  </div>
)}

    </div>
  )
}
