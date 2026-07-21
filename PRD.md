# 🏋️ PRD — Gym Reja (Shaxsiy Fitnes Trekker)

**Mahsulot:** Shaxsiy mashq, kardio va ovqatlanish trekkeri
**Maqsad egasi:** Foydalanuvchi (1 kishi, shaxsiy foydalanish)
**Versiya:** 1.0
**Sana:** 2026-07-21
**Muddat (deadline):** 2026-12-31

---

## 1. Qisqacha (Executive Summary)

Bu — bitta foydalanuvchi uchun mo'ljallangan, brauzerda ishlaydigan (offline, localStorage'da saqlanadigan) fitnes trekker. Asosiy vazifasi: foydalanuvchini **86 kg → 75 kg** ga sog'lom sur'atda (haftada ~0.45 kg) olib borish, buni **fazali (3 blokli) mashq rejasi**, **kunlik 1 soat mashq + 1 soat kardio**, va **kaloriya defitsiti bilan ovqatlanish** orqali amalga oshirish.

Mahsulot faqat "reja ko'rsatuvchi" emas — u **jonli trekker**: har kungi vaznni yozadi, progressni hisoblaydi, kaloriya/makrosni vaznga qarab avtomatik qayta hisoblaydi va motivatsiya beradi.

---

## 2. Muammo va Yechim

### Muammo
- Odam gym'ga boradi, lekin **nima qilishni bilmaydi** — tartibsiz mashq qiladi.
- Vazn tashlash **ovqatga bog'liq** (80%), lekin ko'pchilik buni e'tiborsiz qoldiradi.
- Progressni o'lchamasa, **motivatsiya yo'qoladi** va 2-3 haftada tashlab ketiladi.
- Mavjud ilovalar inglizcha, murakkab, va o'zbek taomlari/kontekstiga mos emas.

### Yechim
- **Tayyor, professional, fazalangan reja** — har kuni aniq nima qilishni ko'rsatadi (mashq + set + takror + dam + kardio).
- **Avtomatik kaloriya/makros hisobi** — foydalanuvchi faqat vaznini yozadi.
- **Vizual progress** — vazn grafigi, foiz, qolgan kunlar, BMI — hammasi bitta ekranda.
- **O'zbek tilida** va **o'zbek taomlariga moslangan** menyu.

---

## 3. Maqsadli foydalanuvchi (Persona)

| | |
|---|---|
| **Kim** | 25 yosh, erkak, 184 sm, 86 kg |
| **Maqsad** | Dekabrgacha 75 kg + relьef (qorin yog'lari yo'q) |
| **Kontekst** | To'liq sport zali (gym) — shtanga, gantel, trenajyorlar bor |
| **Rejim** | Kuniga ~1 soat mashq + ~1 soat kardio |
| **Tajriba** | Boshlang'ich–o'rta daraja |
| **Qurilma** | Asosan telefon (gym'da), ba'zan kompyuter |
| **Til** | O'zbekcha |

---

## 4. Maqsadlar va Muvaffaqiyat Metrikalari

### Biznes/shaxsiy maqsad (North Star)
> **31-dekabrgacha 75 kg ga yetish** (BMI ~22.2, "normal" zona).

### Kalit natijalar (KR)
| Metrika | Nishon |
|---|---|
| Yakuniy vazn | ≤ 75 kg (2026-12-31 gacha) |
| Haftalik vazn tashlash sur'ati | 0.4–0.5 kg/hafta |
| Mashq qatnashuvi (consistency) | Haftada ≥ 3 sessiya (85%+) |
| Ilovadan foydalanish | Haftada ≥ 3 marta vazn yozish |
| Muskul saqlash | Kuch bloklarida vaznlar o'sib borishi |

### Mahsulot metrikalari
- Har hafta kamida 1 marta vazn kiritilgan kunlar soni.
- Bloklar bo'yicha bajarilgan mashqlar foizi.

---

## 5. Ko'lam (Scope)

### 5.1 Ichida (In scope — v1.0) ✅
1. **Maqsad paneli** — hozirgi vazn → nishon, qolgan kg, progress bar, qolgan kunlar.
2. **Vaznni kuzatish (weight log)** — kunlik yozuv, oxirgi 5 ta o'zgarish, o'sish/pasayish belgisi.
3. **Avtomatik sog'liq hisobi** — BMI, BMR (Mifflin-St Jeor), TDEE, kaloriya defitsiti, makros (P/U/Y).
4. **Ovqatlanish bo'limi** — kunlik defitsit vizuali, makros ulushi, namunaviy o'zbek menyusi, "ko'p/kam yeng".
5. **Fazali reja (3 blok)** — Asos → Kuch/Hajm → Relьef, sanaga qarab avtomatik faol blok.
6. **Deload mantiqi** — har 4-hafta yengil hafta ogohlantirishi.
7. **Kunlik mashqlar** — set/takror/dam, professional maslahatlar, mashq rasmlari (lightbox bilan kattalashtirish).
8. **Progress kuzatuvi** — belgilangan mashqlar (checkbox), blok bo'yicha foiz.
9. **1 soat mashq + 1 soat kardio** rejimi — har kunning kardio bloki batafsil.
10. **Dam kunlari + 6 qoida** maslahatlar.
11. **To'liq offline** — localStorage, server yo'q. **Responsive** — telefon/planshet/desktop.

### 5.2 Tashqarisida (Out of scope — v1.0) ❌
- Ro'yxatdan o'tish / login / bir nechta foydalanuvchi (bu shaxsiy trekker).
- Backend server, ma'lumotlar bazasi, bulut sinxronizatsiya.
- To'lov, obuna, monetizatsiya.
- Ijtimoiy funksiyalar, do'stlar, reyting.
- AI murabbiy / chat.
- Push-bildirishnomalar (v1.0 da yo'q — v2 ga).

---

## 6. Funksional Talablar (Ekranlar bo'yicha)

Ilova **bitta uzun sahifa** (single-page), yuqoridan pastga oqim:

### 6.1 Hero (sarlavha)
- Maqsad badge'i: "Vazn tashlash · 86 → 75 kg · 3 kun/hafta".
- Sarlavha + qisqa tavsif.

### 6.2 Maqsad paneli (`GoalPanel`)
- **Hozir → Nishon → Qoldi** katta raqamlar bilan.
- Progress bar (tashlangan foiz).
- 4 ta stat karta: haftalik sur'at, kunlik kaloriya, kunlik protein, BMI.
- **Vazn kiritish** input + "Qo'shish" tugma.
- Oxirgi 5 ta o'lchov (sana, kg, farq ▼/▲).
- "Oxirgi yozuvni o'chirish".

**Qabul mezoni:** Vazn kiritilganda barcha hisoblar (kaloriya, makros, BMI, progress) darhol yangilanadi va localStorage'ga saqlanadi.

### 6.3 Ovqatlanish (`Nutrition`)
- Defitsit hisobi: TDEE − Defitsit = Yeyish kerak.
- Makros bar (protein/uglevod/yog' ulushi) + legend.
- Namunaviy kunlik menyu (5 ta ovqat, o'zbek taomlari, kkal + protein).
- "Ko'proq yeng" / "Kamaytiring" ikki ustun.

**Qabul mezoni:** Barcha kaloriya/makros qiymatlari joriy vazndan hisoblanadi.

### 6.4 Blok tanlagich
- 3 ta blok tab (Asos / Kuch / Relьef) + "Hozir" belgisi (sanaga qarab avtomatik).
- Faol blok ma'lumoti: tavsif, takror fokusi, hafta raqami, deload ogohlantirishi.

### 6.5 Kunlik mashq kartasi
- Kun tablari (Seshanba / Payshanba / Shanba).
- Blok bo'yicha progress bar + foiz + "Tozalash".
- 🔥 Qizdirish → 🏋️ Asosiy mashqlar → 🏃 Kardio → 🧘 Cho'zilish.
- Har mashq: checkbox, rasm (bosilsa lightbox), nomi, maslahat, set/takror/dam.

**Qabul mezoni:** Checkbox holati blok bo'yicha saqlanadi; foiz to'g'ri hisoblanadi.

### 6.6 Dam kunlari + Maslahatlar + Footer
- Dam kunlari chiplari.
- Vazn tashlash uchun 6 qoida karta.
- Disclaimer (shifokor bilan maslahat).

---

## 7. Nofunksional Talablar

| Kategoriya | Talab |
|---|---|
| **Ishlash** | Birinchi yuklanish < 2s (Vite build, rasm lazy-load). |
| **Offline** | Internet yo'q bo'lsa ham ishlaydi (rasmlardan tashqari); ma'lumot localStorage'da. |
| **Responsive** | 320px–1440px oralig'ida buzilmaydi; gym'da telefon uchun optimallashtirilgan. |
| **Foydalanish** | Barmoq bilan bosish uchun katta nishonlar (≥ 44px). |
| **Til** | To'liq o'zbekcha. |
| **Dizayn** | Zamonaviy dark UI, premium his, silliq animatsiyalar. |
| **Xavfsizlik** | Shaxsiy ma'lumot faqat qurilmada; hech qayerga jo'natilmaydi. |
| **Barqarorlik** | localStorage buzilsa ham ilova qulamaydi (try/catch). |

---

## 8. Ma'lumot Modeli (Data Model)

Barchasi `localStorage`da (server yo'q):

```
gym-weights-v1   → WeightEntry[]   { date: "YYYY-MM-DD", kg: number }
gym-progress-v1  → DoneMap         { "<blockId>-<dayId>-<index>": boolean }
```

**Sozlamalar (kodda, `goal.ts`):**
```
startWeight: 86, targetWeight: 75, heightCm: 184, age: 25
startDate: 2026-07-11, deadline: 2026-12-31
```

**Hisoblar (formulalar):**
- `BMI = kg / (bo'y_m)²`
- `BMR = 10·kg + 6.25·bo'y − 5·yosh + 5` (Mifflin-St Jeor, erkak)
- `TDEE = BMR × 1.5` (haftada 3 kun mashq + qadamlar)
- `Kunlik kaloriya = TDEE − 500` (≈ haftada 0.45 kg)
- `Protein = kg × 1.9 g`, `Yog' = kg × 0.8 g`, `Uglevod = qolgan kkal / 4`

---

## 9. Mashq Rejasi (Metodologiya)

**Prinsip:** 6 oy, 3 ta 8-haftalik blok, progressiv yuklanish + har 4-hafta deload.

| Blok | Oylar | Fokus | Takror | Dam |
|---|---|---|---|---|
| **1. Asos** | Iyul–Avgust | Texnika, odat | 12–15 | 60s |
| **2. Kuch/Hajm** | Sentabr–Oktabr | Muskul qurish, og'ir vazn | 6–12 | 75–120s |
| **3. Relьef** | Noyabr–Dekabr | Superset, yog' silliqlash | 15–20 | 30–45s |

**Kunlik tuzilma (~2 soat):**
- 🔥 Qizdirish: 5–10 daq
- 🏋️ Mashq (kuch): **~60 daq** (5–6 mashq)
- 🏃 Kardio: **~60 daq** (blokka qarab: barqaror temp yoki HIIT)
- 🧘 Cho'zilish: 5–7 daq

**Kunlar:** Seshanba (butun tana/kuch A) · Payshanba (B) · Shanba (oyoq + katta kardio).
**Dam:** Dushanba, Chorshanba, Juma, Yakshanba (yengil piyoda + 8–10k qadam).

> ⚠️ **Eslatma:** 1 soat kardio har kuni yog' yoqadi, lekin muskulni saqlash uchun protein (≥1.9 g/kg) va yetarli uyqu (7–8 soat) shart. Charchoq oshsa, kardioni 40 daqiqaga tushiring.

---

## 10. Texnik Stek

- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Saqlash:** Browser `localStorage`
- **Mashq rasmlari:** [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (ochiq manba)
- **Uslub:** Vanilla CSS (dizayn tizimi, `styles.css`)
- **Hosting:** Statik (dist/ — Netlify/Vercel/GitHub Pages)

---

## 11. Yo'l Xaritasi (Roadmap)

### ✅ v1.0 — MVP
Maqsad panel, vazn log, ovqatlanish, 3 blokli reja, kardio, progress, premium dizayn.

### ✅ v1.5 (Hozir) — To'liq trekker
- 📈 Vazn grafigi (SVG chiziqli chart, nishon liniyasi).
- 🔮 75 kg prognoz sanasi (sur'atga qarab).
- 🔥 Streak — ketma-ket faol haftalar + sessiya hisobi.
- 📊 Kunlik kaloriya + 💧 suv trekkeri.
- 📝 Mashq vazni jurnali (kg × takror, progressive overload).
- ⏱️ Dam taymeri (floating widget, signal + tebranish).
- ✅ Sessiya tarixi (oxirgi 4 hafta kalendar-nuqtalar).
- ⚙️ Sozlamalar ekrani (vazn/bo'y/yosh/maqsad UI'dan).
- 📲 PWA (telefonga o'rnatish, offline).

### 🔮 v2.0 — Keyingi
- Ma'lumotni eksport/import (JSON backup).
- Foto-progress (oldin/keyin suratlar).
- Push-eslatma (mashq kuni).
- Haftalik/oylik statistika hisoboti.

---

## 12. Risklar va Yumshatish

| Risk | Ta'sir | Yumshatish |
|---|---|---|
| Motivatsiya yo'qolishi | Yuqori | Vizual progress, kichik nishonlar, deload haftalari |
| Haddan tashqari kardio → muskul yo'qolishi | O'rta | Yuqori protein, kuch mashqlari ustuvor, uyqu |
| localStorage tozalanishi (ma'lumot yo'qolishi) | O'rta | v1.1 da eksport/import |
| Plato (vazn to'xtashi) | O'rta | Kaloriya avtomatik qayta hisoblanadi; refeed kunlari |
| Jarohat | Yuqori | Deload, qizdirish, texnika maslahatlari, disclaimer |

---

## 13. Ochiq Savollar

- [ ] Vazn grafigi qaysi versiyada kerak? (v1.1 taxmin qilingan)
- [ ] Sozlamalarni UI'dan o'zgartirish kerakmi yoki kod yetarlimi?
- [ ] Kardio turi (yugurish/velosiped/eshkak) tanlash kerakmi?

---

*Bu hujjat mahsulot rivojlanishi bilan yangilanadi.*
