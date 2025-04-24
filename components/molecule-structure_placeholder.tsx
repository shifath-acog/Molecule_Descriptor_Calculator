"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MoleculeStructureProps {
  smiles: string
  size?: "small" | "medium" | "large"
}

export function MoleculeStructure({ smiles, size = "small" }: MoleculeStructureProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoleculeImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // This is a placeholder for an actual API call to generate molecule images
        // In a real application, you would call an API that generates molecule images from SMILES
        // For example: RDKit, CDK, or a service like PubChem

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demonstration, we're using a placeholder image
        // In a real app, you would set the actual image URL from the API response
        setImageUrl(`/placeholder.svg?height=150&width=150&text=${encodeURIComponent(smiles.substring(0, 10))}`)
      } catch (err) {
        setError("Failed to load molecule structure")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (smiles) {
      fetchMoleculeImage()
    }
  }, [smiles])

  // Size mappings
  const dimensions = {
    small: { width: 100, height: 100 },
    medium: { width: 150, height: 150 },
    large: { width: 200, height: 200 },
  }

  const { width, height } = dimensions[size]

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 rounded-md" style={{ width, height }} />
  }

  if (error) {
    return <div className="text-red-500 text-xs">Error loading structure</div>
  }

  return imageUrl ? (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={`Molecular structure of ${smiles}`}
      width={width}
      height={height}
      className="rounded-md"
    />
  ) : null
}
