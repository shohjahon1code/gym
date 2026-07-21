import { useEffect, useMemo, useState } from 'react'
import { blocks, restDays, tips, IMG_BASE } from './data'
import {
  pickCurrentBlockId,
  weekInBlock,
  isDeloadWeek,
  loadWeights,
  currentWeightFrom,
  WEIGHTS_KEY,
  type WeightEntry,
} from './goal'
import Goal from './GoalPanel'
import Nutrition from './Nutrition'

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

export default function App() {
  const [blockId, setBlockId] = useState<string>(() => pickCurrentBlockId(blocks))
  const activeBlock = useMemo(
    () => blocks.find((b) => b.id === blockId) ?? blocks[0],
    [blockId]
  )

  const [dayId, setDayId] = useState<string>(activeBlock.days[0].id)
  const [done, setDone] = useState<DoneMap>(loadDone)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [weights, setWeights] = useState<WeightEntry[]>(loadWeights)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
  }, [done])

  useEffect(() => {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights))
  }, [weights])

  const currentWeight = currentWeightFrom(weights)

  const activeDay = useMemo(
    () => activeBlock.days.find((d) => d.id === dayId) ?? activeBlock.days[0],
    [activeBlock, dayId]
  )

  // Progress — faqat shu blok mashqlari bo'yicha
  const totalExercises = useMemo(
    () => activeBlock.days.reduce((s, d) => s + d.exercises.length, 0),
    [activeBlock]
  )
  const doneCount = useMemo(
    () =>
      Object.entries(done).filter(
        ([k, v]) => v && k.startsWith(`${activeBlock.id}-`)
      ).length,
    [done, activeBlock]
  )
  const percent = totalExercises ? Math.round((doneCount / totalExercises) * 100) : 0

  const week = weekInBlock(activeBlock.startDate)
  const deload = isDeloadWeek(activeBlock.startDate)
  const isCurrentBlock = pickCurrentBlockId(blocks) === activeBlock.id

  const toggle = (key: string) =>
    setDone((prev) => ({ ...prev, [key]: !prev[key] }))

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
    <div className="app">
      <header className="hero">
        <span className="badge">Vazn tashlash · 86 → 75 kg · 3 kun / hafta</span>
        <h1>Gym Reja 💪</h1>
        <p className="hero-sub">
          Seshanba · Payshanba · Shanba — har kuni ~1 soat mashq + ~1 soat kardio.
          6 oylik fazali reja bilan dekabrgacha mukammal formaga.
        </p>
      </header>

      <Goal weights={weights} setWeights={setWeights} />

      <Nutrition weight={currentWeight} />

      {/* ====== BLOK TANLAGICH ====== */}
      <section className="blocks">
        <h3 className="section-title">📦 Reja bosqichi (blok)</h3>
        <div className="block-tabs">
          {blocks.map((b) => (
            <button
              key={b.id}
              className={`block-tab ${b.id === blockId ? 'active' : ''}`}
              style={
                b.id === blockId
                  ? { borderColor: b.accent, boxShadow: `inset 0 0 0 1.5px ${b.accent}` }
                  : undefined
              }
              onClick={() => {
                setBlockId(b.id)
                setDayId(b.days[0].id)
              }}
            >
              <span className="bt-num" style={{ color: b.accent }}>{b.order}</span>
              <span className="bt-name">{b.name}</span>
              <span className="bt-months">{b.months}</span>
              {pickCurrentBlockId(blocks) === b.id && (
                <span className="bt-now">Hozir</span>
              )}
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
            style={
              d.id === dayId
                ? { borderColor: activeBlock.accent, color: activeBlock.accent }
                : undefined
            }
            onClick={() => setDayId(d.id)}
          >
            <span className="tab-day">{d.day}</span>
            <span className="tab-sub">{d.subtitle}</span>
          </button>
        ))}
      </nav>

      <main className="card" style={{ '--accent': activeBlock.accent } as React.CSSProperties}>
        <div className="card-head">
          <div>
            <h2>{activeDay.day}</h2>
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
              const isDone = !!done[key]
              return (
                <li key={key} className={`ex ${isDone ? 'done' : ''}`}>
                  <label className="ex-check">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggle(key)}
                    />
                    <span className="checkmark" />
                  </label>
                  <button
                    className="ex-thumb"
                    onClick={() => setPreview({ name: ex.name, img: ex.img })}
                    title="Kattalashtirish uchun bosing"
                  >
                    <img
                      src={`${IMG_BASE}/${ex.img}/0.jpg`}
                      alt={ex.name}
                      loading="lazy"
                    />
                    <span className="zoom-hint">🔍</span>
                  </button>
                  <div className="ex-body">
                    <div className="ex-name">{ex.name}</div>
                    <div className="ex-tip">💡 {ex.tip}</div>
                  </div>
                  <div className="ex-meta">
                    <span><b>{ex.sets}</b> set</span>
                    <span><b>{ex.reps}</b> takror</span>
                    <span className="rest">{ex.rest} dam</span>
                  </div>
                </li>
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
            <button className="lb-close" onClick={() => setPreview(null)}>
              ✕
            </button>
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

      <footer className="foot">
        <p>Sog‘lom bo‘ling! Muntazamlik — natijaning kaliti. 🚀</p>
        <p className="disclaimer">
          Eslatma: jiddiy sog‘liq muammolari bo‘lsa, mashqni boshlashdan oldin shifokor bilan maslahatlashing.
        </p>
      </footer>
    </div>
  )
}
