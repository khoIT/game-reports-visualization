"use client"

import type React from "react"

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

interface DraggableNodeProps {
  node: Node
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
  isDragging: boolean
  isBusinessMode?: boolean
}

const getNodeColor = (type: Node["type"], nodeId?: string) => {
  // Intelligence layer nodes (purple/violet) - excluding observability and guardrails
  const intelligenceNodes = ["ingestion", "kb", "trigger", "agent"]
  if (nodeId && intelligenceNodes.includes(nodeId)) {
    return "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 text-purple-900"
  }
  
  // Data sources (amber/gold)
  switch (type) {
    case "source":
      return "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400 text-amber-900"
    case "storage":
      return "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400 text-amber-900"
    case "process":
      return "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-900"
    case "ai":
      return "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-500 text-indigo-900"
    case "output":
      return "bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-900"
    case "consumer":
      return "bg-gradient-to-br from-cyan-100 to-cyan-200 border-cyan-400 text-cyan-900"
    case "feedback":
      return "bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400 text-pink-900"
    case "observability":
      return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 border-dashed text-gray-700"
    default:
      return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 text-gray-900"
  }
}

export default function DraggableNode({ node, onMouseDown, onMouseUp, isDragging, isBusinessMode }: DraggableNodeProps) {
  // Check if this is an outstanding node (AI Agent or Central KB)
  const isOutstanding = node.id === "agent" || node.id === "kb"
  
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={`absolute transition-all ${isDragging ? "z-50 opacity-80" : isOutstanding ? "z-20" : "z-10"}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        cursor: "move",
      }}
    >
      <div
        className={`
          h-full rounded-xl p-4
          ${getNodeColor(node.type, node.id)}
          ${isDragging ? "shadow-2xl cursor-grabbing" : "hover:shadow-lg hover:-translate-y-0.5"}
          ${isOutstanding ? "border-[3px] shadow-xl ring-4 ring-opacity-30" : "border-2 shadow-md"}
          ${node.id === "agent" ? "ring-purple-400" : node.id === "kb" ? "ring-purple-400" : ""}
          ${isBusinessMode ? "ring-2 ring-offset-2 ring-purple-500" : ""}
          transition-all duration-300 cursor-move
        `}
      >
        <div 
          className={`font-bold leading-tight mb-2 ${isOutstanding ? "text-sm" : "text-xs"} animate-fade-in`}
          key={`label-${node.label}`}
        >
          {node.label}
        </div>
        {node.description && (
          <div 
            className={`opacity-80 space-y-1 ${isOutstanding ? "text-[10.5px]" : "text-[10px]"} animate-fade-in`}
            key={`desc-${node.description.join("")}`}
          >
            {node.description.map((line, idx) => (
              <div key={idx} className="leading-tight">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
      `}} />
    </div>
  )
}
