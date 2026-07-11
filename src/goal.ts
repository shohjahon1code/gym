// Foydalanuvchi maqsadi va sog'lom hisob-kitoblar
// Boshlang'ich: 86 kg, 184 sm, 25 yosh -> nishon: 75 kg, muskulli, qorin yog'lari yo'q
// Muddat: 2026-07-11 dan 2026-12-31 gacha

export const goal = {
  startWeight: 86, // kg
  targetWeight: 75, // kg
  heightCm: 184,
  age: 25,
  startDate: '2026-07-11',
  deadline: '2026-12-31',
} as const

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
export function currentWeightFrom(weights: WeightEntry[]): number {
  return weights.length ? weights[weights.length - 1].kg : goal.startWeight
}

const M = goal.heightCm / 100

/** Tana massasi indeksi (BMI) */
export function bmi(weightKg: number): number {
  return weightKg / (M * M)
}

export function bmiLabel(v: number): string {
  if (v < 18.5) return 'Kam vazn'
  if (v < 25) return 'Normal ✅'
  if (v < 30) return 'Ortiqcha vazn'
  return 'Semizlik'
}

/** Mifflin-St Jeor formulasi (erkak) — tinch holatdagi kaloriya */
export function bmr(weightKg: number): number {
  return 10 * weightKg + 6.25 * goal.heightCm - 5 * goal.age + 5
}

/** Kunlik umumiy sarf (haftada 3 kun mashq + qadamlar ~1.5) */
export function tdee(weightKg: number, activity = 1.5): number {
  return bmr(weightKg) * activity
}

/** Vazn tashlash uchun kunlik maqsad kaloriya (~500 kkal defitsit) */
export function targetCalories(weightKg: number): number {
  return Math.round((tdee(weightKg) - 500) / 10) * 10
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
export function macros(weightKg: number): Macros {
  const maintain = Math.round(tdee(weightKg) / 10) * 10
  const kcal = targetCalories(weightKg)
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
