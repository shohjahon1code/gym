# 🏋️ Gym — Haftalik mashq va ovqatlanish rejasi

Vazn tashlash (86 → 75 kg) uchun 3 kunlik (Seshanba · Payshanba · Shanba) fazali reja.
React + TypeScript + Vite.

## Imkoniyatlar

- 🎯 **Maqsad paneli** — hozirgi vazn → nishon, qolgan kunlar, haftalik sur'at, BMI
- 📈 **Vazn grafigi** — SVG chiziqli grafik + 75 kg nishon liniyasi
- 🔮 **Prognoz** — joriy sur'atga qarab 75 kg ga qachon yetishing hisoblanadi
- 🔥 **Streak** — ketma-ket faol haftalar, shu hafta va jami sessiyalar
- 📅 **Vaznni kuzatish** — natijalar brauzerda (localStorage) saqlanadi
- 🍽️ **Kunlik defitsit + makros** — vaznga qarab avtomatik hisoblanadi
- 📊 **Kaloriya + suv trekkeri** — bugungi yeganing va ichgan suving kuzatiladi
- 🥗 **Ovqat menyusi** — o'zbek taomlari bilan namunaviy kunlik reja
- 📦 **3 blokli reja** — Asos → Kuch/Hajm → Relьef, avtomatik faza va deload
- 🏋️ **Mashqlar + rasmlar** — har mashqning haqiqiy rasmi (bosilsa kattalashadi)
- 📝 **Mashq vazni jurnali** — har mashqda kg × takror yozib, progressni kuzat
- ⏱️ **Dam taymeri** — set orasida countdown + signal (floating widget)
- ✅ **Sessiya tarixi** — bajarilgan mashqlar oxirgi 4 haftalik kalendar-nuqtalarda
- ⚙️ **Sozlamalar** — vazn/bo'y/yosh/maqsadni UI'dan o'zgartirish
- 📲 **PWA** — telefonga o'rnatiladi va offline ishlaydi
- 📱 **Responsive** — telefon, planshet va kompyuterga moslashgan

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
npm run dev -- --host   # telefonda ochish uchun
```

## Build

```bash
npm run build      # dist/ papkasiga
npm run preview
```

## Texnologiyalar

- React 18 + TypeScript
- Vite
- Mashq rasmlari: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (ochiq manba)
