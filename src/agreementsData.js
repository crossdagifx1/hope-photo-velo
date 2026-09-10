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
