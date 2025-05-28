import { DescriptorCalculator } from "@/components/descriptor-calculator";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-100 via-white to-white min-h-screen" suppressHydrationWarning>
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-300 shadow-md flex justify-start items-center">
        <img
          src="https://www.aganitha.ai/wp-content/uploads/2023/05/aganitha-logo.png"
          alt="Aganitha Logo"
          className="h-10"
        />
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-20 text-center mb-0">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    {/* Optional background image or gradient could go here */}
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto">
    {/* Heading with neutral accent */}
    <h1 className="text-[6.5rem] font-extrabold text-gray-900 leading-tight mb-0 animate__animated animate__fadeIn animate__delay-1s ml-10 font-weight-500">
      MolScreener
    </h1>


          {/* Description */}
          <p className="text-xl text-gray-600 mb-10 animate__animated animate__fadeIn animate__delay-2s">
          Filtering high-quality, medchem-ready drug candidates from AI-generated or virtually screened molecules.
          </p>

          {/* Call to Action */}
          <div className="flex justify-center gap-4">
            {/* <a
              href="#calculator"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg border border-gray-300 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-3s"
            >
              Get Started
            </a> */}
          </div>
        </div>
      </section>

      {/* Descriptor Calculator Section */}
      <section id="calculator" className="container mx-auto py-0 px-4">
        <DescriptorCalculator />
      </section>
    </main>
  );
}
