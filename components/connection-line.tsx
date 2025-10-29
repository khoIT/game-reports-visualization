interface ConnectionLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
  isDashed?: boolean
}

export default function ConnectionLine({ x1, y1, x2, y2, label, isDashed }: ConnectionLineProps) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isDashed ? "#94a3b8" : "#60a5fa"}
        strokeWidth="2"
        strokeDasharray={isDashed ? "5,5" : "none"}
      />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" fill="#cbd5e1" fontSize="12">
          {label}
        </text>
      )}
    </g>
  )
}
