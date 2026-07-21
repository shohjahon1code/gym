import { useMemo } from 'react'
import type { WeightEntry, Settings } from './goal'
import { formatUz } from './goal'

interface Props {
  weights: WeightEntry[]
  settings: Settings
}

/** Sof SVG chiziqli grafik — tashqi kutubxonasiz. */
export default function WeightChart({ weights, settings }: Props) {
  const W = 640
  const H = 220
  const pad = { l: 38, r: 16, t: 18, b: 26 }

  const model = useMemo(() => {
    if (weights.length < 2) return null

    const pts = weights.map((w) => ({ t: new Date(w.date).getTime(), kg: w.kg, date: w.date }))
    const minT = pts[0].t
    const maxT = pts[pts.length - 1].t
    const spanT = Math.max(1, maxT - minT)

    const kgs = pts.map((p) => p.kg)
    const target = settings.targetWeight
    let lo = Math.min(...kgs, target)
    let hi = Math.max(...kgs, settings.startWeight)
    const margin = Math.max(1, (hi - lo) * 0.15)
    lo -= margin
    hi += margin
    const spanKg = Math.max(1, hi - lo)

    const x = (t: number) => pad.l + ((t - minT) / spanT) * (W - pad.l - pad.r)
    const y = (kg: number) => pad.t + (1 - (kg - lo) / spanKg) * (H - pad.t - pad.b)

    const coords = pts.map((p) => ({ ...p, cx: x(p.t), cy: y(p.kg) }))
    const line = coords.map((c, i) => `${i ? 'L' : 'M'}${c.cx.toFixed(1)},${c.cy.toFixed(1)}`).join(' ')
    const area = `${line} L${coords[coords.length - 1].cx.toFixed(1)},${(H - pad.b).toFixed(1)} L${coords[0].cx.toFixed(1)},${(H - pad.b).toFixed(1)} Z`
    const targetY = y(target)

    // Y o'qi belgilari (lo, o'rta, hi)
    const ticks = [hi, (hi + lo) / 2, lo].map((v) => ({ v, ty: y(v) }))

    return { coords, line, area, targetY, target, ticks, x, y }
  }, [weights, settings])

  if (!model) {
    return (
      <div className="chart-empty">
        📈 Grafik uchun kamida <b>2 ta o'lchov</b> kiriting — keyin vazn yo'lingiz shu yerda chiziladi.
      </div>
    )
  }

  const last = model.coords[model.coords.length - 1]

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-svg"
        preserveAspectRatio="none"
        role="img"
        aria-label="Vazn grafigi"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Y-o'qi to'rlari */}
        {model.ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={t.ty}
              y2={t.ty}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text x={4} y={t.ty + 4} fill="#6f7da0" fontSize="11">
              {t.v.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Nishon liniyasi (75 kg) */}
        <line
          x1={pad.l}
          x2={W - pad.r}
          y1={model.targetY}
          y2={model.targetY}
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          opacity="0.8"
        />
        <text x={W - pad.r} y={model.targetY - 6} fill="#86efac" fontSize="11" textAnchor="end">
          Nishon {model.target}kg
        </text>

        {/* Maydon + chiziq */}
        <path d={model.area} fill="url(#areaFill)" />
        <path
          d={model.line}
          fill="none"
          stroke="url(#lineFill)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Nuqtalar */}
        {model.coords.map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={i === model.coords.length - 1 ? 4.5 : 2.8}
            fill={i === model.coords.length - 1 ? '#22c55e' : '#fff'}
            stroke="#0e1526"
            strokeWidth="1.5"
          >
            <title>{`${formatUz(c.date)} — ${c.kg} kg`}</title>
          </circle>
        ))}
      </svg>

      <div className="chart-meta">
        <span>{formatUz(model.coords[0].date)}</span>
        <span className="chart-now">Oxirgi: <b>{last.kg} kg</b></span>
        <span>{formatUz(last.date)}</span>
      </div>
    </div>
  )
}
