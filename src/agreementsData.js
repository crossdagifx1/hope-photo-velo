// src/agreementsData.js — 9 Official Digitized Agreement Templates & Plan Mapping
// Digitized directly from HOPE Photo & Velo physical contracts

export const DEFAULT_AGREEMENTS_9 = [
  {
    id: 'agr-studio-10k',
    name: 'Studio Package — Basic',
    packageTitle: 'Studio Package (የስቱዲዮ ቀረጻ)',
    price: 10000,
    category: 'studio',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-52.jpg',
    deliverables: [
      '1 ቤሎ በመረጡት ዓይነት (1 Gown of your choice)',
      '1 ሱፍ በመረጡት ዓይነት (1 Suit of your choice)',
      'የሀበሻ ልብስ የተሟላ (Full Habesha Dress included)',
      'ካባ በመረጡት ዓይነት (Kaba included)',
      '20 Print Photo (20 የታተሙ ፎቶዎች)',
      '10 Post Photo (10 ፖስት ፎቶዎች)',
      'Professional Makeup (ሜካፕ የተካተተ)',
      'ጥፍር (Nails styling)',
      'ፀጉር (Hair styling)',
      '150 High-Resolution Soft Copies (150 ሶፍት ኮፒዎች)',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ውሉን ሲፈርሙ 50% ቅድመ ክፍያ\n2. ከቀረጻ መልስ የቀሪ ክፍያ ማጠቃለያ\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 10,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} በ {eventDate} ቀን የስቱዲዮ ቤሲክ ፓኬጅ አገልግሎት ያቀርባል። ዝርዝሩ ከላይ እንደተዘረዘረው ነው።', bodyEn: 'HOPE Photo & Velo agrees to provide Studio Basic Package services for {clientName} on {eventDate} as itemized above.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ ዋጋ {agreedPrice}። ቅድሚያ ክፍያ {depositAmount} (50%) ውል ሲፈረም፤ ቀሪ {remainingBalance} ርክክብ ሲጠናቀቅ ይፈጸማል።', bodyEn: 'Total: {agreedPrice}. Advance deposit {depositAmount} (50%) upon signing; remaining {remainingBalance} upon delivery.' },
      { headingAm: '3. የርክክብ ጊዜ', headingEn: '3. Delivery Timeline', bodyAm: 'ሶፍት ኮፒ ፎቶዎች በ 3-5 ቀናት ውስጥ፤ የታተሙ ፎቶዎች በ 2 ሳምንት ውስጥ ይረከባሉ።', bodyEn: 'Soft copy photos delivered within 3-5 days; prints within 2 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: 'ቀን ለውጥ ቢያስፈልግ ቢያንስ 7 ቀናት ቀደም ብሎ ማሳወቅ ይገባል። ክፍት ቀናት ካሉ ያለ ተጨማሪ ክፍያ ይስተናገዳል።', bodyEn: 'Rescheduling requires 7-day advance notice, subject to studio availability.' },
    ],
  },
  {
    id: 'agr-studio-14k',
    name: 'Studio Package — Event',
    packageTitle: 'Studio Package — Event Coverage (የክስተት ሽፋን)',
    price: 14500,
    category: 'studio',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-31.jpg',
    deliverables: [
      '2 ቤሎ በመረጡት ዓይነት (2 Gowns)',
      '2 ሱፍ በመረጡት ዓይነት (2 Suits)',
      'የሀበሻ ልብስ የተሟላ',
      'ካባ በመረጡት ዓይነት',
      '200 የምስጋና ካርዶች (200 Thank-You Cards)',
      '40×60 ቦርድ ፎቶ (40×60 Board Photo)',
      'Professional Makeup (ሜካፕ የተካተተ)',
      'ጥፍር (Nails)',
      'ፀጉር (Hair)',
      '150 High-Res Soft Copies',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ውሉን ሲፈርሙ 50% ቅድመ ክፍያ\n2. ከቀረጻ መልስ የቀሪ ክፍያ ማጠቃለያ\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 14,500 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} በ {eventDate} ቀን Event Coverage ስቱዲዮ አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo agrees to provide Event Coverage Studio Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ ዋጋ {agreedPrice}። ቅድሚያ {depositAmount} (50%) ውል ሲፈረም፤ ቀሪ {remainingBalance} ርክክብ ሲጠናቀቅ።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%) at signing; remaining balance {remainingBalance} upon delivery.' },
      { headingAm: '3. የርክክብ ጊዜ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት፣ ህትመቶች 2-3 ሳምንት።', bodyEn: 'Soft copies 3-5 days, prints 2-3 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ብሎ ማሳወቅ ያስፈልጋል።', bodyEn: '7-day advance notice required for rescheduling.' },
    ],
  },
  {
    id: 'agr-studio-18k',
    name: 'Studio Package — Full Production',
    packageTitle: 'Studio Package — Full Production (ሙሉ ፕሮዳክሽን)',
    price: 18500,
    category: 'studio',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-47.jpg',
    deliverables: [
      '2 ቤሎ በመረጡት ዓይነት (2 Gowns of choice)',
      '2 ሱፍ በመረጡት ዓይነት (2 Suits of choice)',
      'የሀበሻ ልብስ የተሟላ',
      'ካባ በመረጡት ዓይነት',
      '30×45 ላሚኔት አልበም — 10(20 ገጽ) (Laminate Album 30×45)',
      '1 ሳይን ቦርድ (1 Sign Board)',
      '200 የምስጋና ካርዶች (200 Thank-You Cards)',
      'Professional Makeup (ሜካፕ)',
      'ጥፍር (Nails)',
      'ፀጉር (Hair)',
      '150 High-Res Soft Copies',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ውሉን ሲፈርሙ 50% ቅድመ ክፍያ\n2. ከቀረጻ መልስ የቀሪ ክፍያ ማጠቃለያ\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 18,500 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} በ {eventDate} ቀን ሙሉ ፕሮዳክሽን (Full Production) ስቱዲዮ አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo agrees to provide Full Production Studio Suite for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ ዋጋ {agreedPrice}። ቅድሚያ {depositAmount} (50%) ውል ሲፈረም፤ ቀሪ {remainingBalance} ርክክብ ሲጠናቀቅ።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%) at signing; remaining balance {remainingBalance} upon delivery.' },
      { headingAm: '3. የርክክብ ጊዜ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት፣ ላሚኔት አልበም እና ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days, laminate album and sign board 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ብሎ ማሳወቅ ያስፈልጋል።', bodyEn: '7-day advance notice required for rescheduling.' },
    ],
  },
  {
    id: 'agr-special-23k',
    name: 'Special Package 2 (Mesk & Studio) — 23,000',
    packageTitle: 'Special Package — Mesk & Studio (የመስክ እና ስቱዲዮ)',
    price: 23000,
    category: 'mesk',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-41.jpg',
    deliverables: [
      'Laminate Album 30×45 — 10(20) Page',
      '50×80 Wall Board (የሳሎን ግድግዳ ቦርድ)',
      '1 Sign Board (ሳይን ቦርድ)',
      '200 Thank-You Cards (የምስጋና ካርዶች)',
      '150 High-Res Soft Copies',
      'Save the Date 5 Photo',
      'የሰርግ አልባሳት የተሟላ',
      '2 ቤሎ (በመረጡት ዓይነት)',
      '2 ሱፍ (በመረጡት ዓይነት)',
      'ካባ (በመረጡት ዓይነት)',
      'የሀበሻ ቀሚስ ጭምሮ',
      'ሜካፕ + ጥፍር + ፀጉር',
      'የወንድ የውበት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 23,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Special Package (Mesk & Studio) 23,000 ብር አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Special Package (Mesk & Studio) 23K for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice required.' },
    ],
  },
  {
    id: 'agr-special-27k',
    name: 'Special Package 2 (Mesk & Studio) — 27,000',
    packageTitle: 'Special Package — Mesk & Studio 27K (የመስክ እና ስቱዲዮ)',
    price: 27000,
    category: 'mesk',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-36.jpg',
    deliverables: [
      'Laminate Album 30×90 — 10(20) Page (ትልቅ አልበም)',
      '50×80 Wall Board (የሳሎን ግድግዳ ቦርድ)',
      '1 Sign Board (ሳይን ቦርድ)',
      '200 Thank-You Cards (የምስጋና ካርዶች)',
      '150 High-Res Soft Copies',
      'Save the Date 5 Photo',
      'የሰርግ አልባሳት የተሟላ',
      '2 ቤሎ (በመረጡት ዓይነት)',
      '2 ሱፍ (በመረጡት ዓይነት)',
      'ካባ (በመረጡት ዓይነት)',
      'የሀበሻ ቀሚስ ጭምሮ',
      'ሜካፕ + ጥፍር + ፀጉር',
      'የወንድ የውበት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 27,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Special Package 27,000 ብር አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Special Package 27K for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice required.' },
    ],
  },
  {
    id: 'agr-luxury-34k',
    name: 'Luxury Package — 34,000',
    packageTitle: 'Luxury Wedding Package (34,000 ETB)',
    price: 34000,
    category: 'wedding',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-26.jpg',
    deliverables: [
      'Mesk Video Coverage (የመስክ ቪዲዮ ቀረጻ)',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 6-Piece Set (ሄክሳጎን ቦርድ 6 ፍሬ)',
      '40×60 Board Photo',
      '1 Sign Board',
      '200 Thank-You Cards',
      'Save the Date 5 Photo',
      'Slideshow Master Video',
      'All Soft Copies Included',
      'የሰርግ አልባሳት (2 ቤሎ፣ 2 ሱፍ፣ ካባ፣ የሀበሻ ልብስ)',
      'ሜካፕ + ጥፍር + ፀጉር + የወንድ የውበት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ 50%\n2. ከቀረጻ መልስ 50%\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 34,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Luxury Package 34K የሰርግ እና የመስክ አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Luxury Package 34K for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-40k',
    name: 'Luxury Package — 40,000',
    packageTitle: 'Luxury Wedding Package (40,000 ETB)',
    price: 40000,
    category: 'wedding',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-15.jpg',
    deliverables: [
      'Mesk Video Coverage (ሲኒማቲክ የመስክ ቪዲዮ)',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 8-Piece Set (ሄክሳጎን ቦርድ 8 ፍሬ)',
      '50×80 Wall Board (የሳሎን ትልቅ ቦርድ)',
      '1 Sign Board',
      '200 Thank-You Cards',
      'Save the Date 5 Photo',
      'Slideshow Master Video',
      'All Soft Copies Included',
      'የሰርግ አልባሳት የተሟላ (2 ቤሎ፣ 2 ሱፍ፣ ካባ፣ የአበሻ ቀሚስ)',
      'ሜካፕ + ጥፍር + ፀጉር + የወንድ የውበት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ 50%\n2. ከቀረጻ መልስ 50%\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 40,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Luxury Package 40K አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Luxury Package 40K for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-50k',
    name: 'Luxury Package — 50,000',
    packageTitle: 'Luxury Wedding Package (50,000 ETB)',
    price: 50000,
    category: 'wedding',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-21.jpg',
    deliverables: [
      'Mesk Video Coverage (ሲኒማቲክ የመስክ ቪዲዮ)',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 8-Piece Set (ሄክሳጎን ቦርድ 8 ፍሬ)',
      '50×80 Wall Board',
      'Sign Board 1',
      'Thank-You Cards — 200',
      'Save the Date 5 Photo',
      'Slideshow Master Video',
      'All Soft Copies Included',
      'የሰርግ አልባሳት (2 ቤሎ፣ 2 ሱፍ፣ ካባ፣ አበባ የመስክ እና ስቱዲዮ)',
      'የአበሻ ቀሚስ + የሴት ቀሚስ',
      'ሜካፕ + ጥፍር + ፀጉር + የወንድ የውበት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ 50%\n2. ከቀረጻ መልስ 50%\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 50,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Luxury Package 50K አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Luxury Package 50K for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-70k',
    name: 'Luxury Package — Grand (70,000)',
    packageTitle: 'Luxury Grand Royal Package (70,000 ETB)',
    price: 70000,
    category: 'wedding',
    depositRate: 0.5,
    photoRef: 'photo_2026-09-10_05-43-10.jpg',
    deliverables: [
      'Full Cinema Mesk & Wedding Video Coverage',
      'Laminate Album 30×90 — 10(20) Page Masterpiece',
      'Frame Size Board 6-Piece Collection',
      '1 Sign Board Photo',
      'Thank-You Cards — 200',
      'Save the Date 5 Photo',
      'Slideshow Master Film',
      'All Raw & Color-Graded Soft Copies',
      'የሰርግ አልባሳት የተሟላ (2 ቤሎ፣ 2 ሱፍ 1 color፣ ካባ፣ 2 ሱፍ)',
      'አበባ የመስክ እና ስቱዲዮ (1)',
      'የአበሻ ቀሚስ + የሴት ቀሚስ',
      'VIP ሜካፕ + ጥፍር + ፀጉር + የወንድ የውበት ሳሎን',
      'Transport (የትራንስፖርት አገልግሎት)',
      'የመስክ ቦታ መግቢያ ክፍያ የተካተተ',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ 50%\n2. ከቀረጻ መልስ 50%\n3. የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም',
    totalNote: 'ይህን ሁሉ በ 70,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፎቶ እና ቪዲዮ ለ {clientName} Luxury Grand Package አገልግሎት ያቀርባል።', bodyEn: 'HOPE Photo & Velo provides Luxury Grand Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice}። ቅድሚያ {depositAmount} (50%)፤ ቀሪ {remainingBalance}።', bodyEn: 'Total: {agreedPrice}. Advance {depositAmount} (50%); balance {remainingBalance}.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
];

// Helper: 1-to-1 package to agreement mapping
export function resolveAgreementForPackage(pkg, agreementsList) {
  const list = agreementsList && agreementsList.length > 0 ? agreementsList : DEFAULT_AGREEMENTS_9;
  if (!pkg) return list[0];

  const pid = (pkg.id || '').toLowerCase();
  
  if (pid.includes('10k') || pid === 'studio-session') {
    return list.find(a => a.id === 'agr-studio-10k') || list[0];
  }
  if (pid.includes('145k') || pid.includes('14k') || pid === 'studio-event') {
    return list.find(a => a.id === 'agr-studio-14k') || list[1];
  }
  if (pid.includes('185k') || pid.includes('18k') || pid === 'studio-production') {
    return list.find(a => a.id === 'agr-studio-18k') || list[2];
  }
  if (pid.includes('23k') || pid === 'mesk-session') {
    return list.find(a => a.id === 'agr-special-23k') || list[3];
  }
  if (pid.includes('27k') || pid === 'mesk-album' || pid.includes('mesk-grand')) {
    return list.find(a => a.id === 'agr-special-27k') || list[4];
  }
  if (pid.includes('bronze') || pid.includes('34k')) {
    return list.find(a => a.id === 'agr-luxury-34k') || list[5];
  }
  if (pid.includes('silver') || pid.includes('40k') || pid.includes('50k')) {
    return list.find(a => a.id === 'agr-luxury-40k' || a.id === 'agr-luxury-50k') || list[6];
  }
  if (pid.includes('golden') || pid.includes('70k') || pid.includes('75k')) {
    return list.find(a => a.id === 'agr-luxury-70k') || list[8];
  }

  // Price match fallback
  const price = pkg.priceNum || Number(String(pkg.price || '').replace(/[^0-9]/g, ''));
  if (price) {
    const closest = list.reduce((prev, curr) => 
      Math.abs((curr.price || 0) - price) < Math.abs((prev.price || 0) - price) ? curr : prev
    , list[0]);
    return closest;
  }

  return list[0];
}

export const DEFAULT_PACKAGES = [
  { id: 'studio-session', category: 'studio', tier: 'basic', badgeEn: 'Most Popular', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Studio Session', titleAm: 'የስቱዲዮ ቀረጻ', titleOm: 'Waraabbii Istuudiyoo', price: 10000, deliverablesEn: ['20 Print Photos', '10 Post Photos', 'Professional Makeup', '150 Soft Copies'], deliverablesAm: ['20 ፕሪንት ፎቶዎች', '10 ፖስት ፎቶዎች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Suuraalee maxxanfamani 20', 'Suuraalee poostii 10', 'Meek-aappii waliin', 'Soft copy 150'] },
  { id: 'studio-event', category: 'studio', tier: 'standard', badgeEn: 'Best Value', badgeAm: 'ተመራጭ ዋጋ', badgeOm: 'Gatii Gaarii', titleEn: 'Event Coverage', titleAm: 'የክስተት ሽፋን', titleOm: 'Haguggii Qophii', price: 14500, deliverablesEn: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies'], deliverablesAm: ['የምስጋና ካርዶች (200 ፍሬ)', '40×60 ቦርድ ፎቶ', 'ሜካፕ የተካተተ', '10 ፖስት ፎቶዎች', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Kaardii Galataa (200)', 'Suuraa Boordii 40×60', 'Meek-aappii waliin', 'Suuraalee poostii 10', 'Soft copy 150'] },
  { id: 'studio-production', category: 'studio', tier: 'premium', badgeEn: 'Best Choice', badgeAm: 'ምርጥ ምርጫ', badgeOm: 'Filannoo Olaanaa', titleEn: 'Full Production Suite', titleAm: 'ሙሉ ፕሮዳክሽን', titleOm: 'Oomisha Guutuu', price: 18500, deliverablesEn: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies'], deliverablesAm: ['30×45 ላሚኔት አልበም (10/20 ገጽ)', '1 ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Kaardii Galataa', 'Meek-aappii', 'Soft copy 150'] },
  { id: 'wedding-bronze', category: 'wedding', tier: 'basic', badgeEn: 'Essential Cinema', badgeAm: 'መሰረታዊ ሲኒማ', badgeOm: 'Sinimaa Bu\'uuraa', titleEn: 'Bronze Package', titleAm: 'የሰርግ ብሮንዝ ቪዲዮ', titleOm: 'Paakeejii Biriinzi', price: 45000, deliverablesEn: ['2 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Light System', 'Highlight Trailer & Cinema Edit', 'Color Grading', 'All Soft Copies Free'], deliverablesAm: ['2 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 2', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara / fiilmii', 'Kalar gireediingii', 'Soft copy guutuu'] },
  { id: 'wedding-silver', category: 'wedding', tier: 'standard', badgeEn: 'Most Popular', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Silver Package', titleAm: 'የሰርግ ሲልቨር ቪዲዮ', titleOm: 'Paakeejii Siilvarii', price: 60000, deliverablesEn: ['3 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Lighting Setup', 'Trailer & Full Cinema Video', 'Color Grading', '40×60 Board Photo', 'All Soft Copies Free'], deliverablesAm: ['3 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 3', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Boordii 40×60', 'Soft copy guutuu'] },
  { id: 'wedding-golden-plus', category: 'wedding', tier: 'premium', badgeEn: 'Ultimate Royal Suite', badgeAm: 'ልዩ የንግሥና ሱዊት', badgeOm: 'Muuxannoo Mootii', titleEn: 'Golden Plus Suite', titleAm: 'ጎልደን ፕላስ ሱዊት', titleOm: 'Paakeejii Warqee Pilaas', price: 75000, deliverablesEn: ['4 Professional Cameras', 'Ronin Gimbal System', 'Ameran Cinema Light', 'Trailer & Full Cinema Edit', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies Free'], deliverablesAm: ['4 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ', '40×60 ቦርድ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 4', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Albaama 30×90', 'Boordii 50×80', 'Boordii 40×60', 'Soft copy guutuu'] },
  { id: 'mesk-session', category: 'mesk', tier: 'basic', badgeEn: 'Essential Mesk', badgeAm: 'የመስክ መነሻ', badgeOm: 'Dirree Bu\'uuraa', titleEn: 'Mesk Video Session', titleAm: 'የመስክ ቪዲዮ ቀረጻ', titleOm: 'Waraabbii Dirree', price: 16000, deliverablesEn: ['Cinematic Mesk Video', '1 Sign Board Photo', '150 High-Res Soft Copies', 'Color Grading & Cinematic Master'], deliverablesAm: ['የመስክ ቪዲዮ', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ከለር ግሬዲንግ'], deliverablesOm: ['Viidiyoo Dirree', 'Boordii Mallattoo 1', 'Soft copy 150', 'Kalar gireediingii'] },
  { id: 'mesk-album', category: 'mesk', tier: 'standard', badgeEn: 'Best Value', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Mesk Video & Album', titleAm: 'የመስክ ቪዲዮ እና አልበም', titleOm: 'Viidiyoo fi Albaama Dirree', price: 20000, deliverablesEn: ['Cinematic Mesk Video', '30×45 Laminate Album', '1 Sign Board', '150 Soft Copies', 'Cinematic Sound Design'], deliverablesAm: ['የመስክ ቪዲዮ', '30×45 ላሚኔት አልበም', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ድምፅ እና ከለር ቅንብር'], deliverablesOm: ['Viidiyoo Dirree', 'Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Soft copy 150', 'Qindoomina sagalee'] },
  { id: 'mesk-grand-keepsake', category: 'mesk', tier: 'premium', badgeEn: 'Grand Keepsake', badgeAm: 'የዘላቂ ቅርስ ሱዊት', badgeOm: 'Seenaa Bara Baraan', titleEn: 'Grand Keepsake Suite', titleAm: 'ግራንድ ኪፕሴክ ሱዊት', titleOm: 'Paakeejii Giraand Kiippiseek', price: 23000, deliverablesEn: ['30×90 Laminate Album (10/20 Page)', '50×80 Wall Board', '1 Sign Board Photo', '200 Thank-You Cards', '5 Save-the-Date Photos', '150 Soft Copies Free'], deliverablesAm: ['30×90 ላሚኔት አልበም (10/20 ገጽ)', '50×80 የሳሎን ግድግዳ ቦርድ', '1 ሳይን ቦርድ', '200 የምስጋና ካርዶች', '5 ሴቭ ዘ ዴት ፎቶዎች', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Albaama Laamineetii 30×90', 'Boordii Girgiddaa 50×80', 'Boordii Mallattoo 1', 'Kaardii Galataa 200', 'Suuraalee Qophii 5', 'Soft copy 150'] },
];

export const DEFAULT_CONTENT = {
  announcement: {
    active: true,
    textEn: '✨ Special Wedding Season Offer: Book 30+ days in advance & receive a Complimentary 50×80 Gallery Canvas Board!',
    textAm: '✨ ልዩ የወቅቱ ቅናሽ፡ ከ 30 ቀናት በፊት አስቀድመው ሲመዘገቡ የ 50×80 ሳሎን ጋለሪ ካንቫስ ቦርድ በነጻ ያገኛሉ!',
    badgeEn: 'Limited Offer',
    badgeAm: 'ልዩ ቅናሽ'
  },
  story: {
    titleEn: '10+ Years of Pure Cinema & Timeless Moments',
    titleAm: 'ከ 10 ዓመታት በላይ የዘለቀ ሲኒማቲክ የፍቅር ታሪክ',
    subtitleEn: "Capturing Ethiopia's finest weddings, heritage, and studio portraits with museum-grade artistic integrity.",
    subtitleAm: 'የኢትዮጵያ ምርጥ ሰርጎችን፣ ባህላዊ ቅርሶችን እና የስቱዲዮ ፎቶግራፊዎችን በከፍተኛ ጥበባዊ ጥራት እንቀርጻለን።',
    yearsExp: '10+',
    weddingsCount: '850+',
    satisfactionRate: '100%',
    gearSummary: 'Sony Cinema FX Line & Aputure Studio Rig'
  },
  contact: {
    phone: '09 10 52 69 62',
    secondaryPhone: '09 11 00 00 00',
    email: 'contact@hopestudio.et',
    telegramHandle: '@HoopStudioSystemBot',
    channelLink: 'https://t.me/hopephotovelo',
    instagramLink: 'https://instagram.com/hope_photo_velo',
    addressEn: 'Bole Medhanialem & Hayahulet, Addis Ababa, Ethiopia',
    addressAm: 'ቦሌ መድሃኒዓለም እና ሃያ ሁለት፣ አዲስ አበባ፣ ኢትዮጵያ',
    workingHoursEn: 'Mon - Sun: 8:00 AM - 8:00 PM',
    workingHoursAm: 'ከሰኞ - እሑድ፡ ከጠዋቱ 2:00 - ከምሽቱ 2:00'
  },
  faqs: [
    {
      id: 'faq-1',
      qEn: 'How far in advance should we reserve our wedding date?',
      qAm: 'ለሰርጋችን ቀኑን ምን ያህል ቀደም ብለን መያዝ አለብን?',
      aEn: 'We recommend reserving at least 1 to 3 months in advance to secure prime dates and our master cinema team.',
      aAm: 'ተመራጭ ቀኖችን እና ዋናውን የሲኒማ ቡድን ለማስያዝ ቢያንስ ከ1 እስከ 3 ወራት አስቀድመው እንዲይዙ እንመክራለን።'
    },
    {
      id: 'faq-2',
      qEn: 'What is the deposit and payment schedule?',
      qAm: 'የቅድሚያ ክፍያ እና የክፍያ ሁኔታው እንዴት ነው?',
      aEn: 'A 50% deposit secures your date and triggers contract generation. The remaining 50% is settled upon final delivery of master videos and albums.',
      aAm: '50% ቅድሚያ ክፍያ ቀኑን ያስይዛል እንዲሁም ይፋዊ ውል ያመነጫል። ቀሪው 50% የተጠናቀቁ ቪዲዮዎችና አልበሞች ሲረከቡ ይፈጸማል።'
    },
    {
      id: 'faq-3',
      qEn: 'Can we customize our package or request custom add-ons?',
      qAm: 'ፓኬጁን ማስተካከል ወይም ተጨማሪ አገልግሎቶችን ማካተት ይቻላል?',
      aEn: 'Yes! You can choose from our 9 physical contract packages or use our custom agreement builder in the admin portal to craft any scope.',
      aAm: 'አዎ! ከ 9ኙ የውል ፓኬጆች መምረጥ ወይም በአስተዳዳሪ ፖርታል በኩል እንደ ፍላጎትዎ የተዘጋጀ ልዩ ውል ማዘጋጀት ይችላሉ።'
    }
  ]
};
