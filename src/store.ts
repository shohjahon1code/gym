// Qo'shimcha trekkerlar uchun localStorage store'lar:
// sessiyalar (mashq tarixi + streak), suv, kaloriya, mashq vazni jurnali.
import { todayISO } from './goal'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/* ================= SESSIYALAR (mashq bajarilgan sanalar) ================= */
export const SESSIONS_KEY = 'gym-sessions-v1'

export function loadSessions(): string[] {
  return read<string[]>(SESSIONS_KEY, [])
}

/** Bugungi sessiyani qo'shadi/olib tashlaydi. Yangi ro'yxatni qaytaradi. */
export function toggleToday(sessions: string[]): string[] {
  const t = todayISO()
  return sessions.includes(t)
    ? sessions.filter((d) => d !== t)
    : [...sessions, t].sort()
}

/** 2024-01-01 (dushanba) ga nisbatan dushanba-asosli hafta indeksi */
function weekIndex(iso: string): number {
  const d = new Date(iso + 'T00:00:00')
  const base = new Date('2024-01-01T00:00:00') // dushanba
  return Math.floor((d.getTime() - base.getTime()) / (7 * 86_400_000))
}

export interface Streak {
  weeks: number // ketma-ket faol haftalar
  thisWeek: number // shu hafta bajarilgan sessiyalar
  total: number // umumiy sessiyalar
}

export function computeStreak(sessions: string[]): Streak {
  const total = sessions.length
  const weeks = new Set(sessions.map(weekIndex))
  const now = weekIndex(todayISO())
  const thisWeek = sessions.filter((d) => weekIndex(d) === now).length

  // Shu hafta yoki o'tgan haftadan boshlab ketma-ket faol haftalarni sanaymiz
  let cursor = weeks.has(now) ? now : now - 1
  let streak = 0
  while (weeks.has(cursor)) {
    streak++
    cursor--
  }
  return { weeks: streak, thisWeek, total }
}

/* ================= SUV (kunlik stakan) ================= */
export const WATER_KEY = 'gym-water-v1'
export const WATER_GOAL = 10 // stakan (~2.5 L)

export function loadWater(): Record<string, number> {
  return read<Record<string, number>>(WATER_KEY, {})
}
export function waterToday(w: Record<string, number>): number {
  return w[todayISO()] ?? 0
}
export function setWaterToday(w: Record<string, number>, glasses: number): Record<string, number> {
  return { ...w, [todayISO()]: Math.max(0, Math.min(20, glasses)) }
}

/* ================= KALORIYA (kunlik yeyilgan) ================= */
export const FOOD_KEY = 'gym-food-v1'

export interface FoodEntry {
  label: string
  kcal: number
  protein: number
}
export type FoodLog = Record<string, FoodEntry[]>

export function loadFood(): FoodLog {
  return read<FoodLog>(FOOD_KEY, {})
}
export function foodToday(f: FoodLog): FoodEntry[] {
  return f[todayISO()] ?? []
}
export function addFoodToday(f: FoodLog, entry: FoodEntry): FoodLog {
  const t = todayISO()
  return { ...f, [t]: [...(f[t] ?? []), entry] }
}
export function removeFoodToday(f: FoodLog, index: number): FoodLog {
  const t = todayISO()
  const list = (f[t] ?? []).filter((_, i) => i !== index)
  return { ...f, [t]: list }
}

/* ================= MASHQ VAZNI JURNALI ================= */
// Mashq nomi bo'yicha (bloklar bo'ylab davomiy) og'irlik x takror tarixi.
export const EXLOG_KEY = 'gym-exlog-v1'

export interface LiftEntry {
  date: string
  kg: number
  reps: number
}
export type LiftLog = Record<string, LiftEntry[]>

export function loadLifts(): LiftLog {
  return read<LiftLog>(EXLOG_KEY, {})
}
export function lastLift(log: LiftLog, name: string): LiftEntry | null {
  const list = log[name]
  return list && list.length ? list[list.length - 1] : null
}
export function addLift(log: LiftLog, name: string, kg: number, reps: number): LiftLog {
  const entry: LiftEntry = { date: todayISO(), kg, reps }
  return { ...log, [name]: [...(log[name] ?? []), entry] }
}
