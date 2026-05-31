/**
 * AI Contact Extractor - Main Page
 * Combines all components into a cohesive single-page application.
 * Features dark mode, glassmorphism, and responsive design.
 */

"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FloatingOrbs } from "@/components/floating-orbs";
import { ExtractorCard } from "@/components/extractor-card";
import { ResultsCard } from "@/components/results-card";
import { Footer } from "@/components/footer";
import { showToast } from "@/components/toast-notification";
import { useExtraction } from "@/hooks/use-extraction";

export default function HomePage() {
  const {
    text,
    setText,
    result,
    isExtracting,
    charCount,
    isDisabled,
    handleExtract,
    handleClear,
    copyEmails,
    copyPhones,
    copyAll,
    exportResults,
  } = useExtraction();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Animated background orbs */}
      <FloatingOrbs />

      {/* Sticky navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10 flex-1">
        {/* Hero section */}
        <Hero />

        {/* Extractor section */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <ExtractorCard
            text={text}
            onTextChange={setText}
            onExtract={handleExtract}
            onClear={handleClear}
            isExtracting={isExtracting}
            isDisabled={isDisabled}
            charCount={charCount}
            hasResults={result.extracted}
          />

          {/* Results section */}
          <div className="mt-8">
            <ResultsCard
              result={result}
              onCopyEmails={copyEmails}
              onCopyPhones={copyPhones}
              onCopyAll={copyAll}
              onExport={exportResults}
              onToast={showToast}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
