import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Forward the request to the actual API endpoint
    const response = await fetch("https://molecular-descriptor.own3.aganitha.ai/calculate-descriptors", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Get the response data
    const data = await response.text()

    // Return the response
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("API proxy error:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch data from API" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
