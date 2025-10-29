"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import DraggableNode from "./draggable-node"

interface Node {
  id: string
  label: string
  description?: string[]
  x: number
  y: number
  width: number
  height: number
  type: "source" | "process" | "storage" | "ai" | "output" | "consumer" | "feedback" | "observability"
}

interface Connection {
  from: string
  to: string
  label?: string
  style?: "solid" | "dashed"
}

interface NodeWithIcon extends Node {
  icon?: string
}

const NODES: NodeWithIcon[] = [
  // Data Sources
  {
    id: "src1",
    label: "🎮 Game Key Metrics",
    x: 30,
    y: 80,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src2",
    label: "💳 Payment / Billing",
    x: 30,
    y: 145,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src3",
    label: "🎫 CS Tickets",
    x: 30,
    y: 210,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src4",
    label: "📱 Social Performance",
    x: 30,
    y: 275,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src5",
    label: "📰 News & Events",
    x: 30,
    y: 340,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src6",
    label: "📈 Promotion / Growth",
    x: 30,
    y: 405,
    width: 130,
    height: 55,
    type: "source",
  },
  {
    id: "src7",
    label: "📣 Marketing / Campaign",
    x: 30,
    y: 470,
    width: 130,
    height: 55,
    type: "source",
  },
  // Raw Data Lake
  {
    id: "raw",
    label: "Raw Data Lake",
    description: ["(immutable, auditable)"],
    x: 30,
    y: 560,
    width: 130,
    height: 60,
    type: "storage",
  },
  // LLM Ingestion
  {
    id: "ingestion",
    label: "📊 LLM Ingestion & Normalization",
    description: ["- schema mapping", "- entity linking (Game, Player, Campaign)", "- quality checks"],
    x: 260,
    y: 90,
    width: 160,
    height: 100,
    type: "process",
  },
  // Observability
  {
    id: "observability",
    label: "🔍 Observability & Lineage",
    description: ["(validations, freshness, drift)"],
    x: 330,
    y: 245,
    width: 150,
    height: 75,
    type: "observability",
  },
  // Central Knowledge Base (Top Flow - OUTSTANDING)
  {
    id: "kb",
    label: "🗄️ Central Knowledge Base",
    description: ["(vector + relational store)", "- facts, metrics, events", "- embeddings + citations"],
    x: 580,
    y: 130,
    width: 200,
    height: 130,
    type: "storage",
  },
  // Orchestrator Trigger (Bottom Flow)
  {
    id: "trigger",
    label: "📋 Orchestrator Trigger",
    description: ["(Report Template + Game ID + Period)"],
    x: 280,
    y: 380,
    width: 155,
    height: 85,
    type: "process",
  },
  // AI Agent (Bottom Flow - OUTSTANDING)
  {
    id: "agent",
    label: "🤖 AI Agent (LLM)",
    description: ["retrieves context from KB", "fills template, writes narrative"],
    x: 580,
    y: 375,
    width: 190,
    height: 110,
    type: "ai",
  },
  // Guardrails (Below AI Agent)
  {
    id: "guardrails",
    label: "🛡️ Guardrails & Governance",
    description: ["(PII handling, approvals, prompts)"],
    x: 590,
    y: 530,
    width: 160,
    height: 80,
    type: "observability",
  },
  // Generated Report (Bottom Flow)
  {
    id: "report",
    label: "📄 Generated Report",
    description: ["(Charts, tables, narrative)"],
    x: 880,
    y: 380,
    width: 140,
    height: 75,
    type: "output",
  },
  // Game Operators (Bottom Right)
  {
    id: "operators",
    label: "👥 Game Ops/PM/Marketing",
    description: ["making decision"],
    x: 1180,
    y: 380,
    width: 140,
    height: 80,
    type: "consumer",
  },
  // Report Summaries (Top Right - Feedback Loop)
  {
    id: "summaries",
    label: "📈 KB Ingestion Hub (auto + human-in-the-loop)",
    description: ["(change logs, highlights, annotations)"],
    x: 930,
    y: 90,
    width: 165,
    height: 105,
    type: "consumer",
  },
]

const CONNECTIONS: Connection[] = [
  // Sources to convergence point (will be drawn specially)
  { from: "src1", to: "convergence", style: "dashed" },
  { from: "src2", to: "convergence", style: "dashed" },
  { from: "src3", to: "convergence", style: "dashed" },
  { from: "src4", to: "convergence", style: "dashed" },
  { from: "src5", to: "convergence", style: "dashed" },
  { from: "src6", to: "convergence", style: "dashed" },
  { from: "src7", to: "convergence", style: "dashed" },
  // Convergence to Ingestion
  { from: "convergence", to: "ingestion", label: "extract/ELT", style: "dashed" },
  // Raw Data Lake to Ingestion
  { from: "raw", to: "ingestion", label: "batch/stream", style: "dashed" },
  // Ingestion to KB
  { from: "ingestion", to: "kb", label: "structured facts + embeddings" },
  // Ingestion to Observability
  { from: "ingestion", to: "observability", style: "dashed" },
  // KB to Agent
  { from: "kb", to: "agent", label: "RAG retrieval" },
  // Trigger to Agent
  { from: "trigger", to: "agent", label: "flow starts" },
  // Agent to Report
  { from: "agent", to: "report", label: "populate template" },
  // Agent to Guardrails
  { from: "agent", to: "guardrails", style: "dashed" },
  // Report to Operators
  { from: "report", to: "operators", label: "consume" },
  // Report to Summaries
  { from: "report", to: "summaries", label: "review", style: "dashed" },
  // Summaries to KB
  { from: "summaries", to: "kb", label: "store as knowledge", style: "dashed" },
]

// Node information mapping
const NODE_INFO: Record<string, { label: string; explanation: string }> = {
  ingestion: {
    label: "Smart Data Ingestion",
    explanation: "📥 Automatically structures and validates data across systems.",
  },
  kb: {
    label: "Enterprise Knowledge Graph",
    explanation: "🧠 Consolidates all company intelligence — metrics, history, and learnings.",
  },
  agent: {
    label: "AI Report Assistant",
    explanation: "🟢 Understands goals, pulls data, and generates reports.",
  },
  trigger: {
    label: "Automated Workflow (RPA)",
    explanation: "⚙️ Kicks off report generation based on templates or schedules.",
  },
  summaries: {
    label: "Learning Loop",
    explanation: "🔁 Feedback enriches the knowledge base — AI gets smarter over time",
  },
  observability: {
    label: "Trust & Quality Layer",
    explanation: "✅ Ensures every report is accurate, timely, and traceable.",
  },
}

export default function ArchitectureDiagram() {
  const [nodes, setNodes] = useState<Node[]>(NODES)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [businessModeNodes, setBusinessModeNodes] = useState<Set<string>>(new Set())
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    
    setDraggingId(id)
    const node = nodes.find((n) => n.id === id)
    if (node && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y,
      })
      
      // Store start position to detect click vs drag
      ;(e.target as any).dragStartX = startX
      ;(e.target as any).dragStartY = startY
    }
  }
  
  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    // Check if this was a drag or a click
    const startX = (e.target as any).dragStartX || e.clientX
    const startY = (e.target as any).dragStartY || e.clientY
    const distance = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2))
    
    // If movement was less than 5px, consider it a click
    if (distance < 5 && NODE_INFO[id]) {
      // Toggle business mode for this node
      setBusinessModeNodes((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - offset.x
    const y = e.clientY - rect.top - offset.y

    setNodes((prevNodes) => prevNodes.map((node) => (node.id === draggingId ? { ...node, x, y } : node)))
  }

  const handleMouseUp = () => {
    setDraggingId(null)
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white overflow-auto rounded-xl border border-gray-200"
      style={{ height: "700px", minWidth: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      {/* Flow Stage Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-amber-50 via-purple-50 via-50% via-green-50 to-cyan-50 border-b-2 border-gray-200 flex items-center justify-between px-8 z-30">
        {/* Stage 1: Data Sources */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-amber-300 shadow-sm">
          <div className="flex gap-1">
            <span className="text-base">📁</span>
            <span className="text-base">💾</span>
          </div>
          <span className="text-xs font-bold text-amber-700">Data Sources</span>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 text-xl">→</div>

        {/* Stage 2: Intelligence (with glow) */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-purple-400 shadow-lg ring-4 ring-purple-200 animate-pulse-subtle">
          <div className="flex gap-1">
            <span className="text-base">🤖</span>
            <span className="text-base">⚙️</span>
            <span className="text-base">🧠</span>
          </div>
          <span className="text-xs font-bold text-purple-700">Intelligent Automation</span>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 text-xl">→</div>

        {/* Stage 3: Reports */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-green-300 shadow-sm">
          <div className="flex gap-1">
            <span className="text-base">📊</span>
            <span className="text-base">📄</span>
          </div>
          <span className="text-xs font-bold text-green-700">Reports</span>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 text-xl">→</div>

        {/* Stage 4: Decisions */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-cyan-300 shadow-sm">
          <div className="flex gap-1">
            <span className="text-base">👥</span>
            <span className="text-base">💡</span>
            <span className="text-base">📈</span>
          </div>
          <span className="text-xs font-bold text-cyan-700">Decisions & Actions</span>
        </div>
      </div>

      {/* Custom CSS for subtle pulse animation */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.3);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        @keyframes pulse-subtle-box {
          0%, 100% {
            box-shadow: 0 0 20px 0 rgba(168, 85, 247, 0.15), inset 0 0 30px rgba(168, 85, 247, 0.05);
          }
          50% {
            box-shadow: 0 0 30px 5px rgba(168, 85, 247, 0.25), inset 0 0 40px rgba(168, 85, 247, 0.1);
          }
        }
        .animate-pulse-subtle-box {
          animation: pulse-subtle-box 4s ease-in-out infinite;
        }
      `}</style>

      {/* Data Sources Group Background */}
      <div
        className="absolute bg-amber-50/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-300/40"
        style={{
          left: "20px",
          top: "75px",
          width: "150px",
          height: "585px",
        }}
      >
      </div>

      {/* Intelligence Layer Highlight */}
      <div
        className="absolute bg-purple-50/20 backdrop-blur-sm rounded-3xl border-2 border-purple-300/40 animate-pulse-subtle-box"
        style={{
          left: "210px",
          top: "75px",
          width: "630px",
          height: "563px",
          pointerEvents: "none",
        }}
      >
      </div>

      {/* SVG for connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "700px" }}
      >
        <defs>
          <marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#3b82f6" opacity="0.7" />
          </marker>
          <marker id="arrowhead-gray" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#9ca3af" opacity="0.9" />
          </marker>
          <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" opacity="0.7" />
          </marker>
          <marker id="arrowhead-purple" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#8b5cf6" opacity="0.7" />
          </marker>
          
          {/* Animation for automated data flow */}
          <style>
            {`
              @keyframes dash-flow {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .animated-arrow {
                animation: dash-flow 1s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* Convergence point for data sources */}
        <circle cx="205" cy="300" r="6" fill="#a855f7" opacity="0.7" />

        {CONNECTIONS.map((conn, idx) => {
          // Handle convergence point specially
          if (conn.to === "convergence") {
            const fromNode = nodes.find((n) => n.id === conn.from)
            if (!fromNode) return null

            const fromX = fromNode.x + fromNode.width
            const fromY = fromNode.y + fromNode.height / 2
            const toX = 205
            const toY = 300

            return (
              <g key={idx}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity="0.6"
                  className="animated-arrow"
                />
                <circle cx={fromX} cy={fromY} r="3" fill="#a855f7" opacity="0.7" />
              </g>
            )
          }

          // Handle convergence to ingestion
          if (conn.from === "convergence") {
            const toNode = nodes.find((n) => n.id === conn.to)
            if (!toNode) return null

            const fromX = 205
            const fromY = 300
            const toX = toNode.x
            const toY = toNode.y + toNode.height / 2

            return (
              <g key={idx}>
                <path
                  d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="8,4"
                  fill="none"
                  opacity="0.6"
                  markerEnd="url(#arrowhead-purple)"
                  className="animated-arrow"
                />
                <circle cx={fromX} cy={fromY} r="3" fill="#a855f7" opacity="0.7" />
                {conn.label && (
                  <text
                    x={(fromX + toX) / 2}
                    y={(fromY + toY) / 2 - 5}
                    textAnchor="middle"
                    fill="#7c3aed"
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            )
          }

          const fromNode = nodes.find((n) => n.id === conn.from)
          const toNode = nodes.find((n) => n.id === conn.to)

          if (!fromNode || !toNode) return null

          // Calculate edge-to-edge connection points
          const getConnectionPoints = () => {
            const fromCenterX = fromNode.x + fromNode.width / 2
            const fromCenterY = fromNode.y + fromNode.height / 2
            const toCenterX = toNode.x + toNode.width / 2
            const toCenterY = toNode.y + toNode.height / 2

            const dx = toCenterX - fromCenterX
            const dy = toCenterY - fromCenterY
            const angle = Math.atan2(dy, dx)

            let fromX, fromY, toX, toY

            // Determine exit point from source node
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              // Horizontal dominant
              if (dx > 0) {
                fromX = fromNode.x + fromNode.width
                fromY = fromCenterY
              } else {
                fromX = fromNode.x
                fromY = fromCenterY
              }
            } else {
              // Vertical dominant
              if (dy > 0) {
                fromX = fromCenterX
                fromY = fromNode.y + fromNode.height
              } else {
                fromX = fromCenterX
                fromY = fromNode.y
              }
            }

            // Determine entry point to target node
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              // Horizontal dominant
              if (dx > 0) {
                toX = toNode.x
                toY = toCenterY
              } else {
                toX = toNode.x + toNode.width
                toY = toCenterY
              }
            } else {
              // Vertical dominant
              if (dy > 0) {
                toX = toCenterX
                toY = toNode.y
              } else {
                toX = toCenterX
                toY = toNode.y + toNode.height
              }
            }

            return { fromX, fromY, toX, toY }
          }

          const { fromX, fromY, toX, toY } = getConnectionPoints()

          // Calculate control point for smooth curve
          const midX = (fromX + toX) / 2
          const midY = (fromY + toY) / 2
          const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2)
          const curvature = Math.min(distance * 0.15, 30)
          const dx = toX - fromX
          const dy = toY - fromY
          const perpX = (-dy / distance) * curvature
          const perpY = (dx / distance) * curvature
          const controlX = midX + perpX * 0.2
          const controlY = midY + perpY * 0.2

          const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`

          // Calculate label position along the curve (at t=0.5 on quadratic bezier)
          // Q(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
          const t = 0.5
          const labelX = (1-t)*(1-t)*fromX + 2*(1-t)*t*controlX + t*t*toX
          const labelY = (1-t)*(1-t)*fromY + 2*(1-t)*t*controlY + t*t*toY
          
          // Offset perpendicular to edge for better visibility
          const edgeAngle = Math.atan2(toY - fromY, toX - fromX)
          const labelOffsetX = -Math.sin(edgeAngle) * 10
          const labelOffsetY = Math.cos(edgeAngle) * 10

          // Determine arrow color based on connection type
          const isDataIngestion = conn.from === "ingestion" && conn.to === "kb"
          const isTriggerFlow = conn.from === "trigger" && conn.to === "agent"
          const isRAGRetrieval = conn.from === "kb" && conn.to === "agent"
          const isAnimated = isDataIngestion || isRAGRetrieval
          
          const arrowColor = isDataIngestion ? "#a855f7" : isTriggerFlow ? "#10b981" : isRAGRetrieval ? "#8b5cf6" : "#9ca3af"
          const arrowMarker = isDataIngestion ? "url(#arrowhead-purple)" : isTriggerFlow ? "url(#arrowhead-green)" : isRAGRetrieval ? "url(#arrowhead-purple)" : "url(#arrowhead-gray)"
          const strokeWidth = (isDataIngestion || isTriggerFlow || isRAGRetrieval) ? "2.5" : "2"
          const opacity = (isDataIngestion || isTriggerFlow || isRAGRetrieval) ? "0.65" : "0.5"
          const textColor = isDataIngestion ? "#7c3aed" : isTriggerFlow ? "#059669" : isRAGRetrieval ? "#7c3aed" : "#6b7280"

          return (
            <g key={idx}>
              {/* Arrow path */}
              <path
                d={pathD}
                stroke={arrowColor}
                strokeWidth={strokeWidth}
                strokeDasharray="8,4"
                fill="none"
                opacity={opacity}
                markerEnd={arrowMarker}
                className={isAnimated ? "animated-arrow" : ""}
              />
              {/* Start circle */}
              <circle
                cx={fromX}
                cy={fromY}
                r="3"
                fill={arrowColor}
                opacity={opacity}
              />
              {/* Label */}
              {conn.label && (
                <text
                  x={labelX + labelOffsetX}
                  y={labelY + labelOffsetY - 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {conn.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      <div className="absolute inset-0">
        {nodes.map((node) => {
          const isBusinessMode = businessModeNodes.has(node.id)
          const nodeInfo = NODE_INFO[node.id]
          
          // Create display node with business-friendly text if in business mode
          const displayNode = isBusinessMode && nodeInfo
            ? {
                ...node,
                // Extract original icon (emoji) from technical label and combine with business label
                label: node.label.match(/^(\p{Emoji})/u) 
                  ? `${node.label.match(/^(\p{Emoji})/u)![0]} ${nodeInfo.label}`
                  : nodeInfo.label,
                description: [nodeInfo.explanation],
              }
            : node
          
          return (
            <DraggableNode
              key={node.id}
              node={displayNode}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              onMouseUp={(e) => handleNodeClick(node.id, e)}
              isDragging={draggingId === node.id}
              isBusinessMode={isBusinessMode}
            />
          )
        })}
      </div>
    </div>
  )
}
