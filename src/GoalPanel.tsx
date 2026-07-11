import { useMemo, useState } from 'react'
import {
  goal,
  bmi,
  bmiLabel,
  targetCalories,
  proteinGrams,
  daysBetween,
  currentWeightFrom,
  type WeightEntry,
} from './goal'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

interface Props {
  weights: WeightEntry[]
  setWeights: React.Dispatch<React.SetStateAction<WeightEntry[]>>
}

export default function Goal({ weights, setWeights }: Props) {
  const [input, setInput] = useState('')

  // Eng oxirgi o'lchov (yo'q bo'lsa — boshlang'ich vazn)
  const current = currentWeightFrom(weights)

  const lost = +(goal.startWeight - current).toFixed(1)
  const totalToLose = goal.startWeight - goal.targetWeight // 11 kg
  const remaining = +(current - goal.targetWeight).toFixed(1)
  const percent = Math.min(100, Math.max(0, Math.round((lost / totalToLose) * 100)))

  const daysLeft = Math.max(0, daysBetween(new Date(), new Date(goal.deadline)))
  const weeksLeft = Math.max(1, daysLeft / 7)
  const weeklyPace = +(remaining / weeksLeft).toFixed(2)

  const bmiNow = bmi(current)
  const bmiTarget = bmi(goal.targetWeight)

  const kcal = targetCalories(current)
  const protein = proteinGrams(current)

  const addWeight = () => {
    const kg = parseFloat(input.replace(',', '.'))
    if (!kg || kg < 30 || kg > 300) return
    const date = todayStr()
    setWeights((prev) => {
      const rest = prev.filter((w) => w.date !== date) // bir kunda bitta yozuv
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
        <span className="goal-deadline">31-dekabr, 2026 · {daysLeft} kun qoldi</span>
      </div>

      <div className="goal-big">
        <div className="gb-item">
          <span className="gb-label">Hozir</span>
          <span className="gb-value">{current} <small>kg</small></span>
        </div>
        <div className="gb-arrow">→</div>
        <div className="gb-item target">
          <span className="gb-label">Nishon</span>
          <span className="gb-value">{goal.targetWeight} <small>kg</small></span>
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
