import { useEffect, useMemo, useState } from 'react'
import { blocks, restDays, tips, IMG_BASE, type Exercise } from './data'
import {
  pickCurrentBlockId,
  weekInBlock,
  isDeloadWeek,
  loadWeights,
  loadSettings,
  currentWeightFrom,
  todayISO,
  WEIGHTS_KEY,
  SETTINGS_KEY,
  type WeightEntry,
  type Settings,
} from './goal'
import {
  loadSessions,
  toggleToday,
  computeStreak,
  SESSIONS_KEY,
  loadLifts,
  lastLift,
  addLift,
  EXLOG_KEY,
  type LiftLog,
} from './store'
import Goal from './GoalPanel'
import Nutrition from './Nutrition'
import SettingsModal from './Settings'
import RestTimer from './RestTimer'

type DoneMap = Record<string, boolean>

interface Preview {
  name: string
  img: string
}

const STORAGE_KEY = 'gym-progress-v1'

function loadDone(): DoneMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DoneMap) : {}
  } catch {
    return {}
  }
}

/** Bugungi hafta kuni qaysi mashq kuniga to'g'ri keladi (yo'q bo'lsa null) */
function todayDayId(): string | null {
  const map: Record<number, string> = { 2: 'se', 4: 'pa', 6: 'sh' }
  return map[new Date().getDay()] ?? null
}

/** Rasm yuklanguncha shimmer skeleton ko'rsatuvchi thumbnail */
function ExThumb({ img, name, onOpen }: { img: string; name: string; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <button className="ex-thumb" onClick={onOpen} title="Kattalashtirish uchun bosing">
      {!loaded && <span className="thumb-skel" aria-hidden />}
      <img
        src={`${IMG_BASE}/${img}/0.jpg`}
        alt={name}
        loading="lazy"
        className={loaded ? 'loaded' : ''}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <span className="zoom-hint">🔍</span>
    </button>
  )
}

/** Bitta mashq — belgilash, rasm, vazn jurnali bilan */
function ExerciseItem({
  ex,
  isDone,
  onToggle,
  onPreview,
  lifts,
  onAddLift,
}: {
  ex: Exercise
  isDone: boolean
  onToggle: () => void
  onPreview: () => void
  lifts: LiftLog
  onAddLift: (name: string, kg: number, reps: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [kg, setKg] = useState('')
  const [reps, setReps] = useState('')
  const last = lastLift(lifts, ex.name)

  const save = () => {
    const k = parseFloat(kg.replace(',', '.'))
    const r = parseInt(reps, 10)
    if (!k || k <= 0) return
    onAddLift(ex.name, k, r || 0)
    setKg('')
    setReps('')
  }

  return (
    <li className={`ex ${isDone ? 'done' : ''}`}>
      <label className="ex-check">
        <input type="checkbox" checked={isDone} onChange={onToggle} />
        <span className="checkmark" />
      </label>
      <ExThumb img={ex.img} name={ex.name} onOpen={onPreview} />
      <div className="ex-body">
        <div className="ex-name">{ex.name}</div>
        <div className="ex-tip">💡 {ex.tip}</div>
        <button className={`ex-logtoggle ${last ? 'has' : ''}`} onClick={() => setOpen((o) => !o)}>
          {last ? `📝 So'nggi: ${last.kg}kg × ${last.reps}` : '📝 Vazn yozish'}
        </button>
      </div>
      <div className="ex-meta">
        <span><b>{ex.sets}</b> set</span>
        <span><b>{ex.reps}</b> takror</span>
        <span className="rest">{ex.rest} dam</span>
      </div>

      {open && (
        <div className="ex-log">
          <input
            type="number"
            inputMode="decimal"
            placeholder="kg"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <span className="exl-x">×</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="takror"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <button onClick={save}>Saqlash</button>
          {last && (
            <span className="exl-hint">
              o'tgan safar: <b>{last.kg}kg × {last.reps}</b> — biroz oshirishga harakat qil 💪
            </span>
          )}
        </div>
      )}
    </li>
  )
}

/** Oxirgi 28 kunlik sessiya tarixi (nuqtalar) */
function SessionHistory({ sessions }: { sessions: string[] }) {
  const days = useMemo(() => {
    const set = new Set(sessions)
    const out: { iso: string; on: boolean; today: boolean }[] = []
    const now = new Date(todayISO() + 'T00:00:00')
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000)
      const iso = d.toISOString().slice(0, 10)
      out.push({ iso, on: set.has(iso), today: iso === todayISO() })
    }
    return out
  }, [sessions])

  return (
    <div className="hist">
      <div className="hist-head">
        <h4>📖 Sessiya tarixi</h4>
        <span className="hist-sub">oxirgi 4 hafta</span>
      </div>
      <div className="hist-grid">
        {days.map((d) => (
          <span
            key={d.iso}
            className={`hist-dot ${d.on ? 'on' : ''} ${d.today ? 'today' : ''}`}
            title={`${d.iso}${d.on ? ' — bajarildi ✅' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [blockId, setBlockId] = useState<string>(() => pickCurrentBlockId(blocks))
  const activeBlock = useMemo(() => blocks.find((b) => b.id === blockId) ?? blocks[0], [blockId])

  const [dayId, setDayId] = useState<string>(() => todayDayId() ?? blocks[0].days[0].id)
  const [done, setDone] = useState<DoneMap>(loadDone)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [weights, setWeights] = useState<WeightEntry[]>(loadWeights)
  const [sessions, setSessions] = useState<string[]>(loadSessions)
  const [lifts, setLifts] = useState<LiftLog>(loadLifts)
  const [scrolled, setScrolled] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)) }, [done])
  useEffect(() => { localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights)) }, [weights])
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) }, [settings])
  useEffect(() => { localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)) }, [sessions])
  useEffect(() => { localStorage.setItem(EXLOG_KEY, JSON.stringify(lifts)) }, [lifts])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 260)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentWeight = currentWeightFrom(weights, settings)
  const remaining = Math.max(0, +(currentWeight - settings.targetWeight).toFixed(1))
  const todayId = todayDayId()
  const streak = useMemo(() => computeStreak(sessions), [sessions])
  const doneToday = sessions.includes(todayISO())

  const activeDay = useMemo(
    () => activeBlock.days.find((d) => d.id === dayId) ?? activeBlock.days[0],
    [activeBlock, dayId]
  )

  const totalExercises = useMemo(
    () => activeBlock.days.reduce((s, d) => s + d.exercises.length, 0),
    [activeBlock]
  )
  const doneCount = useMemo(
    () => Object.entries(done).filter(([k, v]) => v && k.startsWith(`${activeBlock.id}-`)).length,
    [done, activeBlock]
  )
  const percent = totalExercises ? Math.round((doneCount / totalExercises) * 100) : 0

  const week = weekInBlock(activeBlock.startDate)
  const deload = isDeloadWeek(activeBlock.startDate)
  const isCurrentBlock = pickCurrentBlockId(blocks) === activeBlock.id

  const toggle = (key: string) => setDone((prev) => ({ ...prev, [key]: !prev[key] }))
  const addLiftEntry = (name: string, kg: number, reps: number) =>
    setLifts((prev) => addLift(prev, name, kg, reps))

  const resetBlock = () => {
    if (confirm('Shu blok belgilashlari tozalansinmi?')) {
      setDone((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((k) => {
          if (k.startsWith(`${activeBlock.id}-`)) delete next[k]
        })
        return next
      })
    }
  }

  return (
    <div className="app" id="top">
      <nav className={`topnav ${scrolled ? 'show' : ''}`}>
        <a className="tn-brand" href="#top">💪 <span>Gym Reja</span></a>
        <div className="tn-links">
          <a href="#maqsad">🎯 <span>Maqsad</span></a>
          <a href="#ovqat">🍽️ <span>Ovqat</span></a>
          <a href="#mashq">🏋️ <span>Mashq</span></a>
        </div>
        <span className="tn-pill">{remaining > 0 ? `${remaining} kg qoldi` : '🎉 Nishon!'}</span>
      </nav>

      <header className="hero">
        <span className="badge">
          Vazn tashlash · {settings.startWeight} → {settings.targetWeight} kg · 3 kun / hafta
        </span>
        <h1>Gym Reja 💪</h1>
        <p className="hero-sub">
          Seshanba · Payshanba · Shanba — har kuni ~1 soat mashq + ~1 soat kardio.
          6 oylik fazali reja bilan dekabrgacha mukammal formaga.
        </p>
      </header>

      <div id="maqsad" className="anchor">
        <Goal
          weights={weights}
          setWeights={setWeights}
          settings={settings}
          streak={streak}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      <div id="ovqat" className="anchor">
        <Nutrition weight={currentWeight} settings={settings} />
      </div>

      {/* ====== BLOK TANLAGICH ====== */}
      <section className="blocks" id="mashq">
        <h3 className="section-title">📦 Reja bosqichi (blok)</h3>
        <div className="block-tabs">
          {blocks.map((b) => (
            <button
              key={b.id}
              className={`block-tab ${b.id === blockId ? 'active' : ''}`}
              style={b.id === blockId ? { borderColor: b.accent, boxShadow: `inset 0 0 0 1.5px ${b.accent}` } : undefined}
              onClick={() => {
                setBlockId(b.id)
                setDayId(todayDayId() ?? b.days[0].id)
              }}
            >
              <span className="bt-num" style={{ color: b.accent }}>{b.order}</span>
              <span className="bt-name">{b.name}</span>
              <span className="bt-months">{b.months}</span>
              {pickCurrentBlockId(blocks) === b.id && <span className="bt-now">Hozir</span>}
            </button>
          ))}
        </div>

        <div className="block-info" style={{ borderColor: activeBlock.accent }}>
          <div className="bi-line">
            <b style={{ color: activeBlock.accent }}>Blok {activeBlock.order}: {activeBlock.name}</b>
            <span>{activeBlock.weeks} · {activeBlock.months}</span>
          </div>
          <p className="bi-tag">{activeBlock.tagline}</p>
          <p className="bi-rep">🎯 {activeBlock.repFocus}</p>
          {isCurrentBlock && (
            <div className={`deload ${deload ? 'on' : ''}`}>
              {deload
                ? `⚠️ ${week}-hafta — DELOAD (yengil hafta): vaznni ~40% kamaytiring, tana tiklansin.`
                : `📅 Blokning ${week}-haftasi. Har 4-hafta deload (yengil) bo‘ladi.`}
            </div>
          )}
        </div>
      </section>

      {/* ====== KUN TABLARI ====== */}
      <nav className="tabs">
        {activeBlock.days.map((d) => (
          <button
            key={d.id}
            className={`tab ${d.id === dayId ? 'active' : ''}`}
            style={d.id === dayId ? { borderColor: activeBlock.accent, color: activeBlock.accent } : undefined}
            onClick={() => setDayId(d.id)}
          >
            {d.id === todayId && <span className="tab-today">Bugun</span>}
            <span className="tab-day">{d.day}</span>
            <span className="tab-sub">{d.subtitle}</span>
          </button>
        ))}
      </nav>

      <main className="card" style={{ '--accent': activeBlock.accent } as React.CSSProperties}>
        <div className="card-head">
          <div>
            <h2>
              {activeDay.day}
              {activeDay.id === todayId && <span className="today-tag">Bugun</span>}
            </h2>
            <p className="focus">{activeDay.focus}</p>
          </div>
          <span className="day-chip">{activeDay.subtitle}</span>
        </div>

        <div className="card-progress">
          <div className="cp-bar">
            <div className="cp-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="cp-meta">
            <span>Blok bo‘yicha: <b>{doneCount}</b>/{totalExercises} · {percent}%</span>
            <button className="reset-btn" onClick={resetBlock}>Tozalash</button>
          </div>
        </div>

        <section className="block warmup">
          <h3>🔥 Qizdirish</h3>
          <p>{activeDay.warmup}</p>
        </section>

        <section className="block">
          <h3>🏋️ Asosiy mashqlar</h3>
          <ul className="ex-list">
            {activeDay.exercises.map((ex, i) => {
              const key = `${activeBlock.id}-${activeDay.id}-${i}`
              return (
                <ExerciseItem
                  key={key}
                  ex={ex}
                  isDone={!!done[key]}
                  onToggle={() => toggle(key)}
                  onPreview={() => setPreview({ name: ex.name, img: ex.img })}
                  lifts={lifts}
                  onAddLift={addLiftEntry}
                />
              )
            })}
          </ul>
        </section>

        <section className="block cardio">
          <h3>🏃 Kardio</h3>
          <p>{activeDay.cardio}</p>
        </section>

        <section className="block cooldown">
          <h3>🧘 Cho‘zilish</h3>
          <p>{activeDay.cooldown}</p>
        </section>

        {/* ====== SESSIYANI YAKUNLASH ====== */}
        <button
          className={`finish-btn ${doneToday ? 'done' : ''}`}
          onClick={() => setSessions((s) => toggleToday(s))}
        >
          {doneToday ? '✅ Bugungi mashq bajarildi (bekor qilish)' : '💪 Bugungi mashqni yakunladim'}
        </button>

        <SessionHistory sessions={sessions} />
      </main>

      <section className="rest-days">
        <h3>Dam olish kunlari</h3>
        <div className="rest-chips">
          {restDays.map((d) => (
            <span key={d} className="rest-chip">{d}</span>
          ))}
        </div>
        <p className="rest-note">
          Dam kunlari to‘liq yotmang — yengil piyoda yurish tez tiklanishga yordam beradi.
        </p>
      </section>

      <section className="tips">
        <h3>Vazn tashlash uchun 6 qoida</h3>
        <div className="tips-grid">
          {tips.map((t) => (
            <div key={t.title} className="tip-card">
              <div className="tip-icon">{t.icon}</div>
              <div className="tip-title">{t.title}</div>
              <div className="tip-text">{t.text}</div>
            </div>
          ))}
        </div>
      </section>

      {preview && (
        <div className="lightbox" onClick={() => setPreview(null)}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setPreview(null)}>✕</button>
            <h4>{preview.name}</h4>
            <div className="lb-images">
              <figure>
                <img src={`${IMG_BASE}/${preview.img}/0.jpg`} alt="Boshlanish" />
                <figcaption>1 — Boshlanish</figcaption>
              </figure>
              <figure>
                <img src={`${IMG_BASE}/${preview.img}/1.jpg`} alt="Yakuniy" />
                <figcaption>2 — Yakuniy holat</figcaption>
              </figure>
            </div>
            <p className="lb-note">Gymdagi uskunani shu rasmlardan taniysiz.</p>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
      )}

      <RestTimer />

      <footer className="foot">
        <p>Sog‘lom bo‘ling! Muntazamlik — natijaning kaliti. 🚀</p>
        <p className="disclaimer">
          Eslatma: jiddiy sog‘liq muammolari bo‘lsa, mashqni boshlashdan oldin shifokor bilan maslahatlashing.
        </p>
      </footer>
    </div>
  )
}
