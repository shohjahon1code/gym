import { useState } from 'react'
import { DEFAULT_SETTINGS, type Settings } from './goal'

interface Props {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  onClose: () => void
}

type NumField = 'startWeight' | 'targetWeight' | 'heightCm' | 'age'
type DateField = 'startDate' | 'deadline'

export default function SettingsModal({ settings, setSettings, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>(settings)

  const setNum = (k: NumField, v: string) => {
    const n = parseFloat(v.replace(',', '.'))
    setDraft((d) => ({ ...d, [k]: Number.isFinite(n) ? n : 0 }))
  }
  const setDate = (k: DateField, v: string) => setDraft((d) => ({ ...d, [k]: v }))

  const save = () => {
    setSettings(draft)
    onClose()
  }
  const reset = () => setDraft(DEFAULT_SETTINGS)

  const fields: { key: NumField; label: string; unit: string; step: string }[] = [
    { key: 'startWeight', label: 'Boshlang‘ich vazn', unit: 'kg', step: '0.1' },
    { key: 'targetWeight', label: 'Nishon vazn', unit: 'kg', step: '0.1' },
    { key: 'heightCm', label: 'Bo‘y', unit: 'sm', step: '1' },
    { key: 'age', label: 'Yosh', unit: 'yosh', step: '1' },
  ]

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lb-inner settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}>✕</button>
        <h4>⚙️ Sozlamalar</h4>

        <div className="set-grid">
          {fields.map((f) => (
            <label key={f.key} className="set-field">
              <span className="set-label">{f.label}</span>
              <div className="set-input">
                <input
                  type="number"
                  inputMode="decimal"
                  step={f.step}
                  value={draft[f.key]}
                  onChange={(e) => setNum(f.key, e.target.value)}
                />
                <span className="set-unit">{f.unit}</span>
              </div>
            </label>
          ))}

          <label className="set-field">
            <span className="set-label">Boshlangan sana</span>
            <div className="set-input">
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => setDate('startDate', e.target.value)}
              />
            </div>
          </label>
          <label className="set-field">
            <span className="set-label">Muddat (deadline)</span>
            <div className="set-input">
              <input
                type="date"
                value={draft.deadline}
                onChange={(e) => setDate('deadline', e.target.value)}
              />
            </div>
          </label>
        </div>

        <p className="set-note">
          O‘zgartirilsa, barcha hisoblar (kaloriya, makros, BMI, progress, prognoz) avtomatik
          qayta hisoblanadi. Ma‘lumot faqat shu qurilmada saqlanadi.
        </p>

        <div className="set-actions">
          <button className="set-reset" onClick={reset}>Standartga qaytarish</button>
          <button className="set-save" onClick={save}>Saqlash</button>
        </div>
      </div>
    </div>
  )
}
