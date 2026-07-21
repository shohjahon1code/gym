import { useEffect, useState } from 'react'
import { macros, type Settings } from './goal'
import { meals, eatLess, eatMore } from './data'
import {
  loadWater,
  waterToday,
  setWaterToday,
  WATER_KEY,
  WATER_GOAL,
  loadFood,
  foodToday,
  addFoodToday,
  removeFoodToday,
  FOOD_KEY,
} from './store'

interface Props {
  weight: number
  settings: Settings
}

export default function Nutrition({ weight, settings }: Props) {
  const m = macros(weight, settings)
  const mealTotal = meals.reduce((s, x) => s + x.kcal, 0)
  const proteinTotal = meals.reduce((s, x) => s + x.protein, 0)

  const pKcal = m.protein * 4
  const cKcal = m.carbs * 4
  const fKcal = m.fat * 9
  const sum = pKcal + cKcal + fKcal || 1

  // ===== Suv trekkeri =====
  const [water, setWater] = useState<Record<string, number>>(loadWater)
  useEffect(() => {
    localStorage.setItem(WATER_KEY, JSON.stringify(water))
  }, [water])
  const glasses = waterToday(water)
  const setGlasses = (n: number) => setWater((w) => setWaterToday(w, n))

  // ===== Kaloriya trekkeri (bugungi) =====
  const [food, setFood] = useState(loadFood)
  useEffect(() => {
    localStorage.setItem(FOOD_KEY, JSON.stringify(food))
  }, [food])
  const today = foodToday(food)
  const eatenKcal = today.reduce((s, x) => s + x.kcal, 0)
  const eatenProtein = today.reduce((s, x) => s + x.protein, 0)

  const [labelIn, setLabelIn] = useState('')
  const [kcalIn, setKcalIn] = useState('')
  const [proteinIn, setProteinIn] = useState('')

  const addFood = () => {
    const kcal = parseInt(kcalIn, 10)
    if (!kcal || kcal < 0) return
    setFood((f) =>
      addFoodToday(f, {
        label: labelIn.trim() || 'Ovqat',
        kcal,
        protein: parseInt(proteinIn, 10) || 0,
      })
    )
    setLabelIn('')
    setKcalIn('')
    setProteinIn('')
  }

  const kcalPct = Math.min(100, Math.round((eatenKcal / m.kcal) * 100))
  const proteinPct = Math.min(100, Math.round((eatenProtein / m.protein) * 100))
  const kcalLeft = m.kcal - eatenKcal

  return (
    <section className="nutri">
      <h3 className="section-title">🍽️ Ovqatlanish va kunlik defitsit</h3>

      {/* Defitsit hisobi */}
      <div className="deficit-grid">
        <div className="df-card">
          <div className="df-label">Sarf (TDEE)</div>
          <div className="df-value">{m.maintain}</div>
          <div className="df-unit">kkal / kun</div>
        </div>
        <div className="df-op">−</div>
        <div className="df-card minus">
          <div className="df-label">Defitsit</div>
          <div className="df-value">{m.deficit}</div>
          <div className="df-unit">kkal</div>
        </div>
        <div className="df-op">=</div>
        <div className="df-card target">
          <div className="df-label">Yeyish kerak</div>
          <div className="df-value">{m.kcal}</div>
          <div className="df-unit">kkal / kun</div>
        </div>
      </div>
      <p className="nutri-note">
        {weight} kg uchun hisoblangan. ~{m.deficit} kkal defitsit ≈ haftada <b>0.4–0.5 kg</b> yog‘.
        Ko‘proq och qolmang — muskul yo‘qoladi.
      </p>

      {/* ===== BUGUNGI KALORIYA TREKKERI ===== */}
      <div className="tracker">
        <div className="tracker-head">
          <h4>📊 Bugun yeganim</h4>
          <span className={`tracker-left ${kcalLeft < 0 ? 'over' : ''}`}>
            {kcalLeft >= 0 ? `${kcalLeft} kkal qoldi` : `${-kcalLeft} kkal oshib ketdi`}
          </span>
        </div>
        <div className="tracker-bars">
          <div className="tb">
            <div className="tb-top">
              <span>Kaloriya</span>
              <span><b>{eatenKcal}</b> / {m.kcal}</span>
            </div>
            <div className="tb-bar">
              <div className={`tb-fill kcal ${eatenKcal > m.kcal ? 'over' : ''}`} style={{ width: `${kcalPct}%` }} />
            </div>
          </div>
          <div className="tb">
            <div className="tb-top">
              <span>Protein</span>
              <span><b>{eatenProtein}</b> / {m.protein} g</span>
            </div>
            <div className="tb-bar">
              <div className="tb-fill protein" style={{ width: `${proteinPct}%` }} />
            </div>
          </div>
        </div>

        <div className="food-input">
          <input
            className="fi-label"
            placeholder="Taom (masalan Palov)"
            value={labelIn}
            onChange={(e) => setLabelIn(e.target.value)}
          />
          <input
            className="fi-num"
            type="number"
            inputMode="numeric"
            placeholder="kkal"
            value={kcalIn}
            onChange={(e) => setKcalIn(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFood()}
          />
          <input
            className="fi-num"
            type="number"
            inputMode="numeric"
            placeholder="protein g"
            value={proteinIn}
            onChange={(e) => setProteinIn(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFood()}
          />
          <button onClick={addFood}>＋</button>
        </div>

        {today.length > 0 && (
          <ul className="food-list">
            {today.map((f, i) => (
              <li key={i}>
                <span className="fl-name">{f.label}</span>
                <span className="fl-kcal">{f.kcal} kkal · {f.protein}g</span>
                <button className="fl-del" onClick={() => setFood((ff) => removeFoodToday(ff, i))}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== SUV TREKKERI ===== */}
      <div className="water">
        <div className="water-head">
          <h4>💧 Suv</h4>
          <span className="water-count">{glasses} / {WATER_GOAL} stakan (~{(glasses * 0.25).toFixed(1)} L)</span>
        </div>
        <div className="water-glasses">
          {Array.from({ length: WATER_GOAL }, (_, i) => (
            <button
              key={i}
              className={`glass ${i < glasses ? 'full' : ''}`}
              onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
              title={`${i + 1}-stakan`}
            >
              💧
            </button>
          ))}
        </div>
        <div className="water-actions">
          <button onClick={() => setGlasses(glasses - 1)}>−</button>
          <button onClick={() => setGlasses(glasses + 1)}>+ stakan</button>
        </div>
      </div>

      {/* Makros */}
      <div className="macros">
        <div className="macro-bar">
          <span className="mb-p" style={{ width: `${(pKcal / sum) * 100}%` }} />
          <span className="mb-c" style={{ width: `${(cKcal / sum) * 100}%` }} />
          <span className="mb-f" style={{ width: `${(fKcal / sum) * 100}%` }} />
        </div>
        <div className="macro-legend">
          <div className="ml p">
            <b>{m.protein} g</b>
            <span>Protein</span>
          </div>
          <div className="ml c">
            <b>{m.carbs} g</b>
            <span>Uglevod</span>
          </div>
          <div className="ml f">
            <b>{m.fat} g</b>
            <span>Yog‘</span>
          </div>
        </div>
      </div>

      {/* Kunlik menyu */}
      <div className="menu">
        <div className="menu-head">
          <h4>📋 Namunaviy kunlik menyu</h4>
          <span className="menu-total">
            ~{mealTotal} kkal · ~{proteinTotal} g protein
          </span>
        </div>
        <div className="meal-list">
          {meals.map((meal) => (
            <div key={meal.name} className="meal">
              <div className="meal-top">
                <span className="meal-name">
                  {meal.icon} {meal.name}
                </span>
                <span className="meal-kcal">
                  {meal.kcal} kkal · {meal.protein}g P
                </span>
              </div>
              <ul className="meal-items">
                {meal.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="menu-tip">
          💧 Kuniga 2.5–3 litr suv. Vazningiz kamaygani sari porsiyani biroz kamaytiring —
          sayt kaloriyani avtomatik qayta hisoblaydi.
        </p>
      </div>

      {/* Ko'p / kam */}
      <div className="eat-grid">
        <div className="eat-card more">
          <h4>✅ Ko‘proq yeng</h4>
          <ul>
            {eatMore.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="eat-card less">
          <h4>⛔ Kamaytiring</h4>
          <ul>
            {eatLess.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
