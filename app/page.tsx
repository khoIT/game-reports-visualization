"use client"
import ArchitectureDiagram from "@/components/architecture-diagram"

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#667eea] p-5">
      <div className="max-w-[1500px] mx-auto bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-bold text-gray-900 mb-4">
            <span className="text-5xl">🎮</span>
            AI-Powered Game Publishing Reports
          </h1>
          <div className="flex gap-3 justify-center mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#667eea] text-white">
              AI Agents
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#f59e0b] text-white">
              Automated
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#10b981] text-white">
              Template-Driven
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
            Intelligent report generation system for game publishing analytics. 
            AI agents automatically process game data, apply custom templates, and generate comprehensive business insights—no manual intervention required.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200 mb-8">
          <div className="flex gap-0">
            <button className="px-6 py-3 font-semibold text-sm text-[#667eea] border-b-3 border-[#667eea] flex items-center gap-2">
              📊 Report Generation Flow
            </button>
            <button className="px-6 py-3 font-semibold text-sm text-gray-500 flex items-center gap-2">
              ⚙️ Template Configuration
            </button>
          </div>
        </div>

        {/* Diagram */}
        <ArchitectureDiagram />
      </div>
    </main>
  )
}
