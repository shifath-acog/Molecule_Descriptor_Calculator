"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Download, X } from "lucide-react"
import { downloadCSV } from "@/lib/export-utils"
import debounce from "lodash.debounce"

interface ResultsTableProps {
  results: any[]
  columns: string[]
}

export function ResultsTable({ results, columns }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({})
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({
    key: null,
    direction: null,
  })
  const [expandedImage, setExpandedImage] = useState<{ rowIndex: number; colIndex: number; src: string } | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const itemsPerPage = 10

  const displayColumns = useMemo(
    () => columns.filter((col) => !col.includes("fingerprint") && !col.includes("Fingerprint")),
    [columns]
  )

  const filteredResults = useMemo(
    () =>
      results.filter((result) =>
        displayColumns.every((col) => {
          const filterValue = columnFilters[col]?.toLowerCase() ?? ""
          const cellValue = result[col]
          return !filterValue || cellValue?.toString().toLowerCase().includes(filterValue)
        })
      ),
    [results, columnFilters, displayColumns]
  )

  const sortedResults = useMemo(() => {
    const sorted = [...filteredResults]
    if (sortConfig.key && sortConfig.direction) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        const isNumeric = !isNaN(Number(aValue)) && !isNaN(Number(bValue))
        if (isNumeric) {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }
        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })
    }
    return sorted
  }, [filteredResults, sortConfig])

  const paginatedResults = useMemo(
    () => sortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [sortedResults, currentPage]
  )

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : prev.key === key && prev.direction === "desc"
          ? null
          : "asc",
    }))
    setCurrentPage(1)
  }

  const handleExport = () => {
    setIsExporting(true)
    const name = prompt("Enter filename (without extension):", "results") || "results"
    downloadCSV(filteredResults, displayColumns, `${name}.csv`)
    setIsExporting(false)
  }

  const debouncedFilterChange = useMemo(
    () =>
      debounce((col: string, value: string) => {
        setColumnFilters((prev) => ({ ...prev, [col]: value }))
        setCurrentPage(1)
      }, 300),
    []
  )

  const handleImageClick = (rowIndex: number, colIndex: number, src: string) => {
    setExpandedImage({ rowIndex, colIndex, src })
  }

  const closeModal = () => {
    setExpandedImage(null)
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Export Controls */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          Export as CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                {displayColumns.map((column) => (
                  <TableHead
                    key={column}
                    className="text-left whitespace-normal break-words p-2 font-semibold cursor-pointer text-gray-700 dark:text-gray-200"
                    onClick={() => handleSort(column)}
                    style={{ minWidth: column === "SMILES" || column === "Structure" ? "200px" : "120px" }}
                  >
                    <div className="flex items-center justify-between">
                      {column}
                      {sortConfig.key === column && sortConfig.direction !== null ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                    {column !== "Structure" && (
                      <Input
                        type="text"
                        defaultValue={columnFilters[column] || ""}
                        onChange={(e) => debouncedFilterChange(column, e.target.value)}
                        className="text-sm h-7 w-32 py-1 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-gray-800">
              {paginatedResults.length > 0 ? (
                paginatedResults.map((result, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {displayColumns.map((column, colIndex) => (
                      <TableCell
                        key={column}
                        className="p-2 align-top break-words text-gray-700 dark:text-gray-200"
                        style={{ maxWidth: column === "SMILES" || column === "Structure" ? "230px" : "150px" }}
                      >
                        {column === "Structure" ? (
                          result[column]?.startsWith("data:image") ? (
                            <img
                              src={result[column] || "/placeholder.svg"}
                              alt="Structure"
                              className="rounded-md border border-gray-200 dark:border-gray-600 w-12 h-12 cursor-pointer"
                              loading="lazy"
                              onClick={() => handleImageClick(rowIndex, colIndex, result[column])}
                            />
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">No image available</span>
                          )
                        ) : (
                          <div className="text-sm whitespace-normal break-words">
                            {typeof result[column] === "object"
                              ? JSON.stringify(result[column]).substring(0, 50) + "..."
                              : String(result[column]).length > 50
                              ? String(result[column]).substring(0, 50) + "..."
                              : result[column]}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={displayColumns.length} className="h-24 text-center text-gray-700 dark:text-gray-200">
                    No molecules pass the filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {Math.ceil(sortedResults.length / itemsPerPage) > 1 && (
        <Pagination className="text-gray-700 dark:text-gray-200">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                  }
                }}
                className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""} bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3 py-1`}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(sortedResults.length / itemsPerPage) },
              (_, i) => i + 1
            )
              .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(sortedResults.length / itemsPerPage)))
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer ${currentPage === page ? "bg-gray-200 dark:bg-gray-500" : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"} text-gray-700 dark:text-gray-200 rounded-md px-3 py-1`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < Math.ceil(sortedResults.length / itemsPerPage)) {
                    setCurrentPage(currentPage + 1)
                  }
                }}
                className={`cursor-pointer ${
                  currentPage === Math.ceil(sortedResults.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""
                } bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3 py-1`}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-4xl max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Structure View</h3>
              <Button variant="ghost" size="sm" onClick={closeModal} className="p-1">
                <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={expandedImage.src}
                alt="Expanded Structure"
                className="max-h-96 max-w-full object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
