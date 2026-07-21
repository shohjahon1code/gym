// Foydalanuvchi sozlamalari va sog'lom hisob-kitoblar
// Sozlamalar endi UI'dan tahrirlanadi va localStorage'da saqlanadi.

export interface Settings {
  startWeight: number // kg
  targetWeight: number // kg
  heightCm: number
  age: number
  startDate: string // YYYY-MM-DD
  deadline: string // YYYY-MM-DD
}

export const DEFAULT_SETTINGS: Settings = {
  startWeight: 86,
  targetWeight: 75,
  heightCm: 184,
  age: 25,
  startDate: '2026-07-11',
  deadline: '2026-12-31',
}

export const SETTINGS_KEY = 'gym-settings-v1'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export interface WeightEntry {
  date: string // YYYY-MM-DD
  kg: number
}

export const WEIGHTS_KEY = 'gym-weights-v1'

export function loadWeights(): WeightEntry[] {
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY)
    return raw ? (JSON.parse(raw) as WeightEntry[]) : []
  } catch {
    return []
  }
}

/** Eng oxirgi o'lchov (yo'q bo'lsa — boshlang'ich vazn) */
export function currentWeightFrom(weights: WeightEntry[], s: Settings): number {
  return weights.length ? weights[weights.length - 1].kg : s.startWeight
}

/** Tana massasi indeksi (BMI) */
export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

export function bmiLabel(v: number): string {
  if (v < 18.5) return 'Kam vazn'
  if (v < 25) return 'Normal ✅'
  if (v < 30) return 'Ortiqcha vazn'
  return 'Semizlik'
}

/** Mifflin-St Jeor formulasi (erkak) — tinch holatdagi kaloriya */
export function bmr(weightKg: number, s: Settings): number {
  return 10 * weightKg + 6.25 * s.heightCm - 5 * s.age + 5
}

/** Kunlik umumiy sarf (haftada 3 kun mashq + qadamlar ~1.5) */
export function tdee(weightKg: number, s: Settings, activity = 1.5): number {
  return bmr(weightKg, s) * activity
}

/** Vazn tashlash uchun kunlik maqsad kaloriya (~500 kkal defitsit) */
export function targetCalories(weightKg: number, s: Settings): number {
  return Math.round((tdee(weightKg, s) - 500) / 10) * 10
}

/** Muskulni saqlab qolish uchun kunlik protein (g) */
export function proteinGrams(weightKg: number): number {
  return Math.round(weightKg * 1.9)
}

export interface Macros {
  kcal: number
  maintain: number // defitsitsiz kunlik sarf (TDEE)
  deficit: number // kunlik defitsit
  protein: number // g
  fat: number // g
  carbs: number // g
}

/** Kunlik makros taqsimoti (defitsit bilan) */
export function macros(weightKg: number, s: Settings): Macros {
  const maintain = Math.round(tdee(weightKg, s) / 10) * 10
  const kcal = targetCalories(weightKg, s)
  const protein = proteinGrams(weightKg) // ~1.9 g/kg
  const fat = Math.round(weightKg * 0.8) // ~0.8 g/kg
  const carbKcal = kcal - protein * 4 - fat * 9
  const carbs = Math.max(0, Math.round(carbKcal / 4))
  return { kcal, maintain, deficit: maintain - kcal, protein, fat, carbs }
}

/** Ikki sana orasidagi kunlar */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

interface DateRange {
  id: string
  startDate: string
  endDate: string
}

/** Bugungi sanaga qarab qaysi blokda ekanini aniqlaydi */
export function pickCurrentBlockId(ranges: DateRange[]): string {
  const t = todayISO()
  const hit = ranges.find((r) => t >= r.startDate && t <= r.endDate)
  if (hit) return hit.id
  if (t < ranges[0].startDate) return ranges[0].id
  return ranges[ranges.length - 1].id
}

/** Blok ichidagi necha-hafta (1-based). Har 4-hafta — deload (yengil). */
export function weekInBlock(blockStart: string): number {
  const start = new Date(blockStart)
  const now = new Date()
  const w = Math.floor(daysBetween(start, now) / 7) + 1
  return w < 1 ? 1 : w
}

export function isDeloadWeek(blockStart: string): boolean {
  return weekInBlock(blockStart) % 4 === 0
}

/** Vazn tashlash prognozi: so'nggi o'lchovlar sur'atiga qarab 75 kg sanasi. */
export interface Forecast {
  ready: boolean // yetarli ma'lumot bormi
  weeklyRate: number // haftada tashlanayotgan kg (musbat = ozish)
  reachISO: string | null // taxminiy sana
  daysToGoal: number | null
  onTrack: boolean // deadlinegacha ulgurilyaptimi
}

export function forecast(weights: WeightEntry[], s: Settings): Forecast {
  if (weights.length < 2) {
    return { ready: false, weeklyRate: 0, reachISO: null, daysToGoal: null, onTrack: false }
  }
  const first = weights[0]
  const last = weights[weights.length - 1]
  const dayspan = Math.max(1, daysBetween(new Date(first.date), new Date(last.date)))
  const lostPerDay = (first.kg - last.kg) / dayspan // musbat = ozyapti
  const weeklyRate = +(lostPerDay * 7).toFixed(2)
  const remaining = last.kg - s.targetWeight

  if (remaining <= 0) {
    return { ready: true, weeklyRate, reachISO: last.date, daysToGoal: 0, onTrack: true }
  }
  if (lostPerDay <= 0) {
    // ozmayapti yoki vazn ortyapti — prognoz yo'q
    return { ready: true, weeklyRate, reachISO: null, daysToGoal: null, onTrack: false }
  }
  const daysToGoal = Math.ceil(remaining / lostPerDay)
  const reach = new Date(new Date(last.date).getTime() + daysToGoal * 86_400_000)
  const reachISO = reach.toISOString().slice(0, 10)
  const onTrack = reachISO <= s.deadline
  return { ready: true, weeklyRate, reachISO, daysToGoal, onTrack }
}

/** Sanani o'zbekcha qisqa ko'rinishda (masalan "15-noy, 2026") */
export function formatUz(iso: string): string {
  const months = [
    'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
    'iyl', 'avg', 'sen', 'okt', 'noy', 'dek',
  ]
  const d = new Date(iso)
  return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}`
}
