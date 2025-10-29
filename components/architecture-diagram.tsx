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
    y: 70,
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
    y: 350,
    width: 140,
    height: 75,
    type: "output",
  },
  // Game Operators (Bottom Right)
  {
    id: "operators",
    label: "👥 Game Operators",
    description: ["Producers / PMs", "Leads / Execs"],
    x: 1100,
    y: 340,
    width: 140,
    height: 80,
    type: "consumer",
  },
  // Report Summaries (Top Right - Feedback Loop)
  {
    id: "summaries",
    label: "📈 Report Summaries & Decisions",
    description: ["(change logs, highlights, annotations)"],
    x: 930,
    y: 90,
    width: 165,
    height: 105,
    type: "feedback",
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
  { from: "report", to: "operators", label: "review" },
  // Report to Summaries
  { from: "report", to: "summaries", label: "auto-summarize", style: "dashed" },
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
      {/* Data Sources Group Background */}
      <div
        className="absolute bg-blue-50/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-blue-300/40"
        style={{
          left: "20px",
          top: "60px",
          width: "150px",
          height: "600px",
        }}
      >
        <div className="absolute -top-6 left-3 bg-white px-3 py-1 rounded-full border border-blue-300 text-xs font-bold text-blue-700">
          Data Sources
        </div>
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
        <circle cx="205" cy="300" r="6" fill="#3b82f6" opacity="0.7" />

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
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity="0.6"
                  className="animated-arrow"
                />
                <circle cx={fromX} cy={fromY} r="3" fill="#3b82f6" opacity="0.7" />
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
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="8,4"
                  fill="none"
                  opacity="0.6"
                  markerEnd="url(#arrowhead-blue)"
                  className="animated-arrow"
                />
                <circle cx={fromX} cy={fromY} r="3" fill="#3b82f6" opacity="0.7" />
                {conn.label && (
                  <text
                    x={(fromX + toX) / 2}
                    y={(fromY + toY) / 2 - 8}
                    textAnchor="middle"
                    fill="#1e40af"
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

          // Determine arrow color based on connection type
          const isDataIngestion = conn.from === "ingestion" && conn.to === "kb"
          const isTriggerFlow = conn.from === "trigger" && conn.to === "agent"
          const isRAGRetrieval = conn.from === "kb" && conn.to === "agent"
          const isAnimated = isDataIngestion || isRAGRetrieval
          
          const arrowColor = isDataIngestion ? "#3b82f6" : isTriggerFlow ? "#10b981" : isRAGRetrieval ? "#8b5cf6" : "#9ca3af"
          const arrowMarker = isDataIngestion ? "url(#arrowhead-blue)" : isTriggerFlow ? "url(#arrowhead-green)" : isRAGRetrieval ? "url(#arrowhead-purple)" : "url(#arrowhead-gray)"
          const strokeWidth = (isDataIngestion || isTriggerFlow || isRAGRetrieval) ? "2.5" : "2"
          const opacity = (isDataIngestion || isTriggerFlow || isRAGRetrieval) ? "0.65" : "0.5"
          const textColor = isDataIngestion ? "#1e40af" : isTriggerFlow ? "#059669" : isRAGRetrieval ? "#7c3aed" : "#6b7280"

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
                  x={midX}
                  y={midY - 8}
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
