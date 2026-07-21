import { useMemo, useState } from 'react'
import {
  bmi,
  bmiLabel,
  targetCalories,
  proteinGrams,
  daysBetween,
  currentWeightFrom,
  forecast,
  formatUz,
  type WeightEntry,
  type Settings,
} from './goal'
import type { Streak } from './store'
import WeightChart from './WeightChart'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

interface Props {
  weights: WeightEntry[]
  setWeights: React.Dispatch<React.SetStateAction<WeightEntry[]>>
  settings: Settings
  streak: Streak
  onOpenSettings: () => void
}

export default function Goal({ weights, setWeights, settings, streak, onOpenSettings }: Props) {
  const [input, setInput] = useState('')

  const current = currentWeightFrom(weights, settings)

  const lost = +(settings.startWeight - current).toFixed(1)
  const totalToLose = settings.startWeight - settings.targetWeight
  const remaining = +(current - settings.targetWeight).toFixed(1)
  const percent = Math.min(100, Math.max(0, Math.round((lost / totalToLose) * 100)))

  const daysLeft = Math.max(0, daysBetween(new Date(), new Date(settings.deadline)))
  const weeksLeft = Math.max(1, daysLeft / 7)
  const weeklyPace = +(remaining / weeksLeft).toFixed(2)

  const bmiNow = bmi(current, settings.heightCm)
  const bmiTarget = bmi(settings.targetWeight, settings.heightCm)

  const kcal = targetCalories(current, settings)
  const protein = proteinGrams(current)

  const fc = useMemo(() => forecast(weights, settings), [weights, settings])

  const addWeight = () => {
    const kg = parseFloat(input.replace(',', '.'))
    if (!kg || kg < 30 || kg > 300) return
    const date = todayStr()
    setWeights((prev) => {
      const rest = prev.filter((w) => w.date !== date)
      return [...rest, { date, kg }].sort((a, b) => a.date.localeCompare(b.date))
    })
    setInput('')
  }

  const removeLast = () => setWeights((prev) => prev.slice(0, -1))

  const recent = useMemo(() => [...weights].reverse().slice(0, 5), [weights])

  return (
    <section className="goal">
      <div className="goal-head">
        <h2>🎯 Maqsad: yil oxirigacha mukammal forma</h2>
        <div className="goal-head-right">
          <span className="goal-deadline">{formatUz(settings.deadline)} · {daysLeft} kun</span>
          <button className="gear-btn" onClick={onOpenSettings} title="Sozlamalar">⚙️</button>
        </div>
      </div>

      <div className="goal-big">
        <div className="gb-item">
          <span className="gb-label">Hozir</span>
          <span className="gb-value">{current} <small>kg</small></span>
        </div>
        <div className="gb-arrow">→</div>
        <div className="gb-item target">
          <span className="gb-label">Nishon</span>
          <span className="gb-value">{settings.targetWeight} <small>kg</small></span>
        </div>
        <div className="gb-item">
          <span className="gb-label">Qoldi</span>
          <span className="gb-value">{remaining > 0 ? remaining : 0} <small>kg</small></span>
        </div>
      </div>

      <div className="goal-progress">
        <div className="gp-bar">
          <div className="gp-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="gp-meta">
          <span>{lost > 0 ? `${lost} kg tashlandi` : 'Boshlaymiz!'}</span>
          <span><b>{percent}%</b></span>
        </div>
      </div>

      {/* ====== VAZN GRAFIGI ====== */}
      <WeightChart weights={weights} settings={settings} />

      {/* ====== PROGNOZ ====== */}
      {fc.ready && (
        <div className={`forecast ${fc.reachISO && fc.onTrack ? 'ok' : fc.reachISO ? 'warn' : 'flat'}`}>
          {remaining <= 0 ? (
            <span>🎉 Tabriklaymiz! Nishonga yetdingiz — endi ushlab turing.</span>
          ) : fc.reachISO ? (
            <span>
              🔮 Shu sur'atda (~{fc.weeklyRate} kg/hafta) <b>{settings.targetWeight} kg</b> ga{' '}
              <b>{formatUz(fc.reachISO)}</b> da yetasiz —{' '}
              {fc.onTrack ? '✅ muddatdan oldin!' : '⚠️ muddatdan kechroq, sur\'atni oshiring.'}
            </span>
          ) : (
            <span>📉 Hozircha ozish sur'ati sezilmayapti — defitsitni tekshiring, muntazam o'lchang.</span>
          )}
        </div>
      )}

      {/* ====== STREAK ====== */}
      <div className="streak-row">
        <div className="streak-card fire">
          <div className="sc-value">🔥 {streak.weeks}</div>
          <div className="sc-label">ketma-ket hafta</div>
        </div>
        <div className="streak-card">
          <div className="sc-value">{streak.thisWeek}<small>/3</small></div>
          <div className="sc-label">shu hafta sessiya</div>
        </div>
        <div className="streak-card">
          <div className="sc-value">{streak.total}</div>
          <div className="sc-label">jami mashq</div>
        </div>
      </div>

      <div className="goal-stats">
        <div className="gs-card">
          <div className="gs-icon">⚖️</div>
          <div className="gs-value">{weeklyPace > 0 ? weeklyPace : 0} kg</div>
          <div className="gs-label">haftada tashlash kerak</div>
        </div>
        <div className="gs-card">
          <div className="gs-icon">🔥</div>
          <div className="gs-value">~{kcal}</div>
          <div className="gs-label">kunlik kaloriya</div>
        </div>
        <div className="gs-card">
          <div className="gs-icon">🥩</div>
          <div className="gs-value">~{protein} g</div>
          <div className="gs-label">kunlik protein</div>
        </div>
        <div className="gs-card">
          <div className="gs-icon">📊</div>
          <div className="gs-value">{bmiNow.toFixed(1)}</div>
          <div className="gs-label">BMI · {bmiLabel(bmiNow)}</div>
        </div>
      </div>

      <div className="weight-log">
        <div className="wl-head">
          <h3>📅 Vaznni kuzatish</h3>
          <span className="wl-hint">Har hafta o‘lchab yozib boring</span>
        </div>
        <div className="wl-input">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Bugungi vazn, masalan 85.4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWeight()}
          />
          <button onClick={addWeight}>Qo‘shish</button>
        </div>

        {recent.length > 0 && (
          <ul className="wl-list">
            {recent.map((w, i) => {
              const prev = weights[weights.length - recent.length + (recent.length - 1 - i) - 1]
              const diff = prev ? +(w.kg - prev.kg).toFixed(1) : null
              return (
                <li key={w.date}>
                  <span className="wl-date">{w.date}</span>
                  <span className="wl-kg">{w.kg} kg</span>
                  {diff !== null && (
                    <span className={`wl-diff ${diff <= 0 ? 'down' : 'up'}`}>
                      {diff <= 0 ? '▼' : '▲'} {Math.abs(diff)} kg
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        {weights.length > 0 && (
          <button className="wl-undo" onClick={removeLast}>
            Oxirgi yozuvni o‘chirish
          </button>
        )}
      </div>

      <p className="goal-note">
        Reja: haftasiga ~0.45 kg — bu sog‘lom sur‘at. Sekin tashlansangiz muskul saqlanadi,
        qorin yog‘i asta ketadi. BMI nishoni: <b>{bmiTarget.toFixed(1)}</b> (normal).
      </p>
    </section>
  )
}
