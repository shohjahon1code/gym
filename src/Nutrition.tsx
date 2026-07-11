import { macros } from './goal'
import { meals, eatLess, eatMore } from './data'

interface Props {
  weight: number
}

export default function Nutrition({ weight }: Props) {
  const m = macros(weight)
  const mealTotal = meals.reduce((s, x) => s + x.kcal, 0)
  const proteinTotal = meals.reduce((s, x) => s + x.protein, 0)

  // Makros ulushlari (kcal bo'yicha) — chiziqcha uchun
  const pKcal = m.protein * 4
  const cKcal = m.carbs * 4
  const fKcal = m.fat * 9
  const sum = pKcal + cKcal + fKcal || 1

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
