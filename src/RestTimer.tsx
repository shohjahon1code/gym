import { useEffect, useRef, useState } from 'react'

const PRESETS = [45, 60, 90, 120] // soniya

export default function RestTimer() {
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState(0) // tanlangan davomiylik
  const [left, setLeft] = useState(0) // qolgan soniya
  const [running, setRunning] = useState(false)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && left > 0) {
      tick.current = setInterval(() => setLeft((l) => l - 1), 1000)
      return () => {
        if (tick.current) clearInterval(tick.current)
      }
    }
    if (left === 0 && running) {
      setRunning(false)
      beep()
      if (navigator.vibrate) navigator.vibrate([200, 80, 200])
    }
  }, [running, left])

  const beep = () => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch {
      /* audio yo'q — muammo emas */
    }
  }

  const start = (secs: number) => {
    setTotal(secs)
    setLeft(secs)
    setRunning(true)
    setOpen(true)
  }
  const stop = () => {
    setRunning(false)
    setLeft(0)
    setTotal(0)
  }
  const addTime = (d: number) => {
    setLeft((l) => Math.max(0, l + d))
    setTotal((t) => Math.max(left + d, t))
  }

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const pct = total ? ((total - left) / total) * 100 : 0
  const active = total > 0

  return (
    <div className={`rest-timer ${open ? 'open' : ''}`}>
      {open && (
        <div className="rt-panel">
          <div className="rt-head">
            <span>⏱️ Dam taymeri</span>
            <button className="rt-x" onClick={() => setOpen(false)}>▾</button>
          </div>

          {active ? (
            <div className="rt-live">
              <div className="rt-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" className="rt-track" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="rt-prog"
                    style={{
                      strokeDasharray: 276.5,
                      strokeDashoffset: 276.5 * (1 - pct / 100),
                    }}
                  />
                </svg>
                <span className={`rt-time ${left === 0 ? 'done' : ''}`}>
                  {left === 0 ? 'Ketdik!' : mmss(left)}
                </span>
              </div>
              <div className="rt-controls">
                <button onClick={() => addTime(-15)}>−15s</button>
                <button onClick={() => setRunning((r) => !r)}>
                  {running ? '⏸' : '▶'}
                </button>
                <button onClick={() => addTime(15)}>+15s</button>
              </div>
              <button className="rt-stop" onClick={stop}>To‘xtatish</button>
            </div>
          ) : (
            <div className="rt-presets">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => start(p)}>{p}s</button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        className={`rt-fab ${active && running ? 'ticking' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Dam taymeri"
      >
        {active ? <span className="rt-fab-time">{mmss(left)}</span> : '⏱️'}
      </button>
    </div>
  )
}
