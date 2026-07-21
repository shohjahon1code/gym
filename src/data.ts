// 3 blokli (fazali) reja — 2026-07-11 dan 2026-12-31 gacha.
// Har blok ~8 hafta. Mashqlar bloklar bo'ylab o'sib/o'zgarib boradi.
// Rasmlar: free-exercise-db (ochiq manba) — har mashqda 0.jpg va 1.jpg.

export const IMG_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

export interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  tip: string
  img: string
}

export interface WorkoutDay {
  id: string
  day: string
  subtitle: string
  focus: string
  warmup: string
  exercises: Exercise[]
  cardio: string
  cooldown: string
}

export interface Block {
  id: string
  order: number
  name: string
  months: string
  weeks: string
  startDate: string // YYYY-MM-DD
  endDate: string
  accent: string
  tagline: string
  repFocus: string
  days: WorkoutDay[]
}

export interface Tip {
  icon: string
  title: string
  text: string
}

export const blocks: Block[] = [
  // ================= BLOK 1 — ASOS =================
  {
    id: 'asos',
    order: 1,
    name: 'Asos',
    months: 'Iyul – Avgust',
    weeks: '8 hafta',
    startDate: '2026-07-11',
    endDate: '2026-08-31',
    accent: '#f97316',
    tagline: 'Texnikani o‘rganish va odat qilish',
    repFocus: '12–15 takror · o‘rtacha vazn · toza texnika',
    days: [
      {
        id: 'se',
        day: 'Seshanba',
        subtitle: 'Butun tana A',
        focus: 'Katta mushaklar — ko‘p kaloriya sarfi',
        warmup: '5–7 daqiqa yengil kardio + dinamik cho‘zilish',
        exercises: [
          { name: 'Goblet appirish (squat)', sets: '3', reps: '12–15', rest: '60 s', tip: 'Tizza barmoq chizig‘idan chiqmasin', img: 'Goblet_Squat' },
          { name: 'Ko‘krak press (gantel)', sets: '3', reps: '12', rest: '60 s', tip: 'Pastda 1 soniya to‘xta', img: 'Dumbbell_Bench_Press' },
          { name: 'Lat pulldown / tortilish', sets: '3', reps: '10–12', rest: '60 s', tip: 'Kurakni pastga tort', img: 'Wide-Grip_Lat_Pulldown' },
          { name: 'Yelka press (gantel)', sets: '3', reps: '12', rest: '60 s', tip: 'Belni bukma', img: 'Dumbbell_Shoulder_Press' },
          { name: 'Plank (taxta)', sets: '3', reps: '30–45 s', rest: '45 s', tip: 'Tana to‘g‘ri chiziqda', img: 'Plank' },
        ],
        cardio: '~60 daqiqa: 45 daq barqaror o‘rtacha temp (yurish 6–7 km/soat yoki velosiped, puls 120–140) + 15 daq yengil interval (1 daq tez / 1 daq dam).',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'pa',
        day: 'Payshanba',
        subtitle: 'Butun tana B',
        focus: 'Orqa, ko‘krak, qo‘l + qorin',
        warmup: '5–7 daqiqa yengil kardio + bo‘g‘imlarni aylantirish',
        exercises: [
          { name: 'Rumin o‘lik tortish (RDL)', sets: '3', reps: '12', rest: '60 s', tip: 'Bel to‘g‘ri, oyoq ozroq bukilgan', img: 'Romanian_Deadlift' },
          { name: 'Egilib tortish (row)', sets: '3', reps: '12', rest: '60 s', tip: 'Tirsakni tanaga yaqin tort', img: 'Bent_Over_Two-Dumbbell_Row' },
          { name: 'Qiya ko‘krak press', sets: '3', reps: '12–15', rest: '60 s', tip: 'Yelka pastda tursin', img: 'Incline_Dumbbell_Press' },
          { name: 'Bitseps burma', sets: '3', reps: '12', rest: '45 s', tip: 'Tirsakni qimirlatma', img: 'Dumbbell_Alternate_Bicep_Curl' },
          { name: 'Tritseps (tros)', sets: '3', reps: '12', rest: '45 s', tip: 'To‘liq yozib bajar', img: 'Triceps_Pushdown' },
          { name: 'Rus buralishi', sets: '3', reps: '20', rest: '45 s', tip: 'Ohista, nazorat bilan', img: 'Russian_Twist' },
        ],
        cardio: '~60 daqiqa barqaror o‘rtacha temp (dorojka / velosiped / ellips). Puls 120–140 — gapira olasiz, lekin qiynalasiz. Yog‘ yoqishning oltin zonasi.',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'sh',
        day: 'Shanba',
        subtitle: 'Butun tana C (oyoq)',
        focus: 'Oyoq, dumba + uzoq kardio',
        warmup: '5–7 daqiqa yengil kardio + oyoq cho‘zilishi',
        exercises: [
          { name: 'Vypad (lunges)', sets: '3', reps: '12 / oyoq', rest: '60 s', tip: 'Orqa tizza yerga tegay deydi', img: 'Dumbbell_Lunges' },
          { name: 'Leg press', sets: '3', reps: '15', rest: '60 s', tip: 'To‘liq pastga tush', img: 'Leg_Press' },
          { name: 'Boldir ko‘tarish', sets: '3', reps: '20', rest: '45 s', tip: 'Yuqorida 1 soniya ushla', img: 'Standing_Calf_Raises' },
          { name: 'Tortish (row / pulldown)', sets: '3', reps: '12', rest: '60 s', tip: 'Orqani ishlat', img: 'Wide-Grip_Lat_Pulldown' },
          { name: 'Yelka lateral', sets: '3', reps: '15', rest: '45 s', tip: 'Yengil vazn, toza texnika', img: 'Side_Lateral_Raise' },
          { name: 'Oyoq ko‘tarish', sets: '3', reps: '15', rest: '45 s', tip: 'Belni yerga bosib tur', img: 'Flat_Bench_Lying_Leg_Raise' },
        ],
        cardio: '~60 daqiqa uzoq barqaror kardio (LISS) — haftaning eng ko‘p yog‘ yoqadigan kuni. Yurish, velosiped yoki eshkak.',
        cooldown: '5–7 daqiqa cho‘zilish',
      },
    ],
  },

  // ================= BLOK 2 — KUCH / HAJM =================
  {
    id: 'kuch',
    order: 2,
    name: 'Kuch / Hajm',
    months: 'Sentabr – Oktabr',
    weeks: '8 hafta',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    accent: '#22c55e',
    tagline: 'Og‘irroq vazn — muskul qurish',
    repFocus: '6–12 takror · og‘ir vazn · ko‘proq dam',
    days: [
      {
        id: 'se',
        day: 'Seshanba',
        subtitle: 'Kuch A',
        focus: 'Og‘ir bazaviy harakatlar',
        warmup: '7–10 daqiqa: yengil kardio + yondamalar bilan qizdirish',
        exercises: [
          { name: 'Shtanga bilan appirish', sets: '4', reps: '8–10', rest: '90 s', tip: 'Vaznni asta oshir, bel to‘g‘ri', img: 'Barbell_Squat' },
          { name: 'Ko‘krak press (gantel/shtanga)', sets: '4', reps: '8–10', rest: '90 s', tip: 'Nazorat bilan tushir', img: 'Dumbbell_Bench_Press' },
          { name: 'Turnikda tortilish (chin-up)', sets: '3', reps: '8–10', rest: '90 s', tip: 'Og‘ir bo‘lsa rezina/tayanchdan foydalan', img: 'Chin-Up' },
          { name: 'Yelka press', sets: '3', reps: '10', rest: '75 s', tip: 'Belni bukma', img: 'Dumbbell_Shoulder_Press' },
          { name: 'Osilib oyoq ko‘tarish', sets: '3', reps: '10–12', rest: '60 s', tip: 'Tebranmaslikka harakat qil', img: 'Hanging_Leg_Raise' },
        ],
        cardio: '~60 daqiqa o‘rtacha temp — kuch mashqidan KEYIN bajaring. Puls past-o‘rta (110–135) tuting, shunda kuch tiklanishiga xalaqit bermaydi.',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'pa',
        day: 'Payshanba',
        subtitle: 'Kuch B',
        focus: 'Orqa zanjiri + qo‘l',
        warmup: '7–10 daqiqa qizdirish + bel/son cho‘zilishi',
        exercises: [
          { name: 'Shtanga bilan o‘lik tortish', sets: '4', reps: '6–8', rest: '2 daqiqa', tip: 'Texnika birinchi! Bel qat‘iy to‘g‘ri', img: 'Barbell_Deadlift' },
          { name: 'Egilib tortish (row)', sets: '4', reps: '10', rest: '90 s', tip: 'Kurakni siqib tort', img: 'Bent_Over_Two-Dumbbell_Row' },
          { name: 'Qiya ko‘krak press', sets: '3', reps: '10', rest: '75 s', tip: 'To‘liq amplituda', img: 'Incline_Dumbbell_Press' },
          { name: 'Shtanga bilan bitseps', sets: '3', reps: '10', rest: '60 s', tip: 'Tirsakni qotir', img: 'Barbell_Curl' },
          { name: 'Tritseps (tros)', sets: '3', reps: '10', rest: '60 s', tip: 'Sekin qaytar', img: 'Triceps_Pushdown' },
          { name: 'Yon burilish (wood chop)', sets: '3', reps: '15', rest: '45 s', tip: 'Qorin bilan ishla', img: 'Standing_Cable_Wood_Chop' },
        ],
        cardio: '~60 daqiqa barqaror o‘rtacha temp (velosiped yoki dorojka). Og‘ir tortish kunidan keyin past zarba beruvchi kardio afzal.',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'sh',
        day: 'Shanba',
        subtitle: 'Oyoq + yelka',
        focus: 'Oyoqni izolyatsiya + yelka salomatligi',
        warmup: '7–10 daqiqa qizdirish + tizza aylantirish',
        exercises: [
          { name: 'Vypad (og‘ir gantel)', sets: '3', reps: '10 / oyoq', rest: '75 s', tip: 'Balansni saqla', img: 'Dumbbell_Lunges' },
          { name: 'Leg extension (old son)', sets: '3', reps: '12', rest: '60 s', tip: 'Yuqorida siqib ushla', img: 'Leg_Extensions' },
          { name: 'Leg curl (orqa son)', sets: '3', reps: '12', rest: '60 s', tip: 'Sekin qaytar', img: 'Lying_Leg_Curls' },
          { name: 'Boldir ko‘tarish', sets: '4', reps: '15', rest: '45 s', tip: 'To‘liq amplituda', img: 'Standing_Calf_Raises' },
          { name: 'Yelka lateral', sets: '3', reps: '12', rest: '45 s', tip: 'Yengil, toza', img: 'Side_Lateral_Raise' },
          { name: 'Face pull (yelka orqasi)', sets: '3', reps: '15', rest: '45 s', tip: 'Postura uchun muhim', img: 'Face_Pull' },
        ],
        cardio: '~60 daqiqa uzoq LISS kardio — oyoq kunidan keyin yengil, barqaror temp bilan qon aylanishini oshiring va yog‘ yoqing.',
        cooldown: '5–7 daqiqa cho‘zilish',
      },
    ],
  },

  // ================= BLOK 3 — RELЬEF =================
  {
    id: 'relef',
    order: 3,
    name: 'Relьef',
    months: 'Noyabr – Dekabr',
    weeks: '8 hafta',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    accent: '#3b82f6',
    tagline: 'Superset + ko‘proq kardio — yog‘ni silliqlash',
    repFocus: '15–20 takror · superset · qisqa dam (30–45 s)',
    days: [
      {
        id: 'se',
        day: 'Seshanba',
        subtitle: 'Yuqori tana superset',
        focus: 'Tez temp, yurak urishi baland',
        warmup: '5–7 daqiqa kardio + dinamik qizdirish',
        exercises: [
          { name: 'Goblet appirish', sets: '3', reps: '15', rest: '30 s', tip: 'Ko‘krak press bilan superset', img: 'Goblet_Squat' },
          { name: 'Ko‘krak press', sets: '3', reps: '15', rest: '45 s', tip: 'Appirish bilan ketma-ket', img: 'Dumbbell_Bench_Press' },
          { name: 'Lat pulldown', sets: '3', reps: '15', rest: '30 s', tip: 'Yelka lateral bilan superset', img: 'Wide-Grip_Lat_Pulldown' },
          { name: 'Yelka lateral', sets: '3', reps: '15', rest: '45 s', tip: 'Yengil vazn, uzluksiz', img: 'Side_Lateral_Raise' },
          { name: 'Mountain climbers (finisher)', sets: '3', reps: '40 s', rest: '30 s', tip: 'Tez temp, qorinni tort', img: 'Mountain_Climbers' },
        ],
        cardio: '~60 daqiqa: 20 daq HIIT (30s tez / 30s dam) + 40 daq barqaror o‘rtacha temp. Superset kunida yurak allaqachon qizigan — yog‘ tez yonadi.',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'pa',
        day: 'Payshanba',
        subtitle: 'Orqa/ko‘krak superset',
        focus: 'Nasos (pump) + yog‘ yoqish',
        warmup: '5–7 daqiqa kardio + qizdirish',
        exercises: [
          { name: 'Rumin o‘lik tortish', sets: '3', reps: '15', rest: '45 s', tip: 'Dumbani his qil', img: 'Romanian_Deadlift' },
          { name: 'Cable crossover (ko‘krak)', sets: '3', reps: '15', rest: '30 s', tip: 'Row bilan superset', img: 'Cable_Crossover' },
          { name: 'Egilib tortish (row)', sets: '3', reps: '15', rest: '45 s', tip: 'Kurakni siq', img: 'Bent_Over_Two-Dumbbell_Row' },
          { name: 'Bitseps + Tritseps superset', sets: '3', reps: '15+15', rest: '45 s', tip: 'Ketma-ket, dam yo‘q', img: 'Barbell_Curl' },
          { name: 'Rus buralishi', sets: '3', reps: '25', rest: '30 s', tip: 'Qorinni nazorat qil', img: 'Russian_Twist' },
        ],
        cardio: '~60 daqiqa: 25 daq HIIT (30s tez / 30s dam) + 35 daq barqaror temp. Interval yog‘ yoqishni mashqdan keyin ham davom ettiradi.',
        cooldown: '5 daqiqa cho‘zilish',
      },
      {
        id: 'sh',
        day: 'Shanba',
        subtitle: 'Oyoq + katta kardio',
        focus: 'Eng ko‘p kaloriya yoqadigan kun',
        warmup: '5–7 daqiqa kardio + oyoq cho‘zilishi',
        exercises: [
          { name: 'Zinaga chiqish (step-up)', sets: '3', reps: '15 / oyoq', rest: '45 s', tip: 'Temp yuqori', img: 'Dumbbell_Step_Ups' },
          { name: 'Leg press', sets: '3', reps: '20', rest: '45 s', tip: 'To‘liq amplituda', img: 'Leg_Press' },
          { name: 'Boldir ko‘tarish', sets: '4', reps: '20', rest: '30 s', tip: 'Yonmaguncha', img: 'Standing_Calf_Raises' },
          { name: 'Arg‘amchi sakrash (finisher)', sets: '4', reps: '60 s', rest: '30 s', tip: 'Kuch yetmasa joyida yugur', img: 'Rope_Jumping' },
          { name: 'Osilib oyoq ko‘tarish', sets: '3', reps: '15', rest: '45 s', tip: 'Qorin pastini ishlat', img: 'Hanging_Leg_Raise' },
        ],
        cardio: '~60–70 daqiqa uzoq kardio — dasturdagi eng katta yog‘ yoqish kuni. Yurish + velosiped aralash, oxirini yengil tempda tugating.',
        cooldown: '7 daqiqa cho‘zilish',
      },
    ],
  },
]

export interface Meal {
  icon: string
  name: string
  kcal: number
  protein: number
  items: string[]
}

// Namunaviy kunlik menyu (~2300 kkal, ~165 g protein) — o'zbek taomlariga moslab.
// Vazningiz kamaygani sari porsiyani biroz kamaytiring.
export const meals: Meal[] = [
  {
    icon: '🍳',
    name: 'Nonushta',
    kcal: 520,
    protein: 35,
    items: [
      '3 ta tuxum omleti (yoki 2 tuxum + 2 oq)',
      '40 g suli (oatmeal) — suvda yoki kam yog‘li sutda',
      '1 dona olma yoki bir hovuch reza meva',
      'Shakarsiz choy / qora qahva',
    ],
  },
  {
    icon: '🍗',
    name: 'Tushlik',
    kcal: 650,
    protein: 45,
    items: [
      '150–180 g tovuq ko‘kragi yoki yog‘siz mol go‘shti (grill/qaynatilgan)',
      '4–5 osh qoshiq guruch yoki grechka (~100 g pishgan)',
      'Katta yangi salat: bodring, pomidor, ko‘kat + 1 osh qoshiq zaytun moyi',
    ],
  },
  {
    icon: '🥛',
    name: 'Gazak (peshin)',
    kcal: 300,
    protein: 32,
    items: [
      '200 g kam yog‘li tvorog yoki 1 protein kokteyl',
      'Bir hovuch yong‘oq/bodom (~20 g)',
    ],
  },
  {
    icon: '🐟',
    name: 'Kechki ovqat',
    kcal: 560,
    protein: 45,
    items: [
      '180–200 g baliq yoki tovuq/go‘sht (qaynatilgan/grill)',
      'Ko‘p yashil sabzavot: karam, brokkoli, bodring salat',
      'Kechqurun uglevodni kamaytiring (non/guruchsiz)',
    ],
  },
  {
    icon: '💪',
    name: 'Mashqdan keyin (ixtiyoriy)',
    kcal: 200,
    protein: 25,
    items: ['1 protein kokteyl yoki 1 stakan kefir + 1 banan'],
  },
]

export const eatLess: string[] = [
  'Shirin ichimlik, gazli suv, paketli sharbat',
  'Somsa, patir, oq non — ko‘p miqdorda',
  'Qandolat, tort, shokolad, muzqaymoq',
  'Fast-food, kartoshka fri, mayonez',
  'Katta porsiya palov (kechqurun umuman yo‘q)',
]

export const eatMore: string[] = [
  'Tuxum, tovuq, baliq, yog‘siz go‘sht',
  'Tvorog, kefir, kam yog‘li sut',
  'Grechka, suli, dukkaklilar (loviya, no‘xat)',
  'Yashil sabzavot, bodring, pomidor, karam',
  'Meva (kuniga 1–2), yong‘oq (bir hovuch)',
]

export const restDays: string[] = ['Dushanba', 'Chorshanba', 'Juma', 'Yakshanba']

export const tips: Tip[] = [
  { icon: '🍽️', title: 'Kaloriya defitsiti', text: 'Vazn tashlashning 80%i ovqatda. Kunlik ~300–500 kkal kam iste’mol qiling.' },
  { icon: '🥩', title: 'Protein', text: 'Har 1 kg vaznga ~1.6–2 g protein: tuxum, tovuq, baliq, tvorog, dukkaklilar.' },
  { icon: '💧', title: 'Suv', text: 'Kuniga 2.5–3 litr suv iching. Mashqdan oldin va keyin ham.' },
  { icon: '🚶', title: 'Qadamlar', text: 'Dam kunlari ham kuniga 8 000–10 000 qadam yuring — bu yog‘ yoqadi.' },
  { icon: '😴', title: 'Uyqu', text: 'Kuniga 7–8 soat uxlang. Kam uyqu ochlik gormonini oshiradi.' },
  { icon: '📈', title: 'Progressiya', text: 'Har hafta vaznni yoki takrorni ozgina oshiring. Nazorat qilib boring.' },
]
