import NepaliDateConverter from 'nepali-date-converter';

// Resolve possible CJS/ESM default export differences
const NepaliDateClass: any = (NepaliDateConverter as any)?.default || NepaliDateConverter;

export interface NepaliMonthInfo {
  index: number; // 0 to 11
  nameEn: string;
  nameNp: string;
}

export const NEPALI_MONTHS: NepaliMonthInfo[] = [
  { index: 0, nameEn: 'Baisakh', nameNp: 'बैशाख' },
  { index: 1, nameEn: 'Jestha', nameNp: 'जेठ' },
  { index: 2, nameEn: 'Asar', nameNp: 'असार' },
  { index: 3, nameEn: 'Shrawan', nameNp: 'श्रावण' },
  { index: 4, nameEn: 'Bhadra', nameNp: 'भाद्र' },
  { index: 5, nameEn: 'Ashwin', nameNp: 'असोज' },
  { index: 6, nameEn: 'Kartik', nameNp: 'कार्तिक' },
  { index: 7, nameEn: 'Mangsir', nameNp: 'मंसिर' },
  { index: 8, nameEn: 'Poush', nameNp: 'पौष' },
  { index: 9, nameEn: 'Magh', nameNp: 'माघ' },
  { index: 10, nameEn: 'Falgun', nameNp: 'फागुन' },
  { index: 11, nameEn: 'Chaitra', nameNp: 'चैत' },
];

export const NEPALI_DAYS = [
  { index: 0, nameEn: 'Sunday', nameNp: 'आइतबार', shortNp: 'आइत' },
  { index: 1, nameEn: 'Monday', nameNp: 'सोमबार', shortNp: 'सोम' },
  { index: 2, nameEn: 'Tuesday', nameNp: 'मंगलबार', shortNp: 'मंगल' },
  { index: 3, nameEn: 'Wednesday', nameNp: 'बुधबार', shortNp: 'बुध' },
  { index: 4, nameEn: 'Thursday', nameNp: 'बिहीबार', shortNp: 'बिही' },
  { index: 5, nameEn: 'Friday', nameNp: 'शुक्रबार', shortNp: 'शुक्र' },
  { index: 6, nameEn: 'Saturday', nameNp: 'शनिबार', shortNp: 'शनि' },
];

export const toDevanagariDigits = (num: number | string): string => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num).replace(/[0-9]/g, (digit) => nepaliDigits[Number(digit)] || digit);
};

export interface ConvertedNepaliDate {
  year: number;
  monthIndex: number; // 0-11
  month: number; // 1-12
  day: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  bsDateStr: string; // YYYY-MM-DD
  bsDateDevanagari: string; // २०८३-०५-१९
  monthNameEn: string;
  monthNameNp: string;
  dayNameEn: string;
  dayNameNp: string;
  formattedEn: string; // 19 Bhadra 2083 B.S.
  formattedNp: string; // १९ भाद्र २०८३, शुक्रबार
  formattedCombined: string; // 19 Bhadra 2083 B.S. (शुक्रबार)
  formattedBadge: string; // १९ भाद्र २०८३ (19 Bhadra 2083 B.S.)
}

/**
 * Converts a Gregorian date (Date object or YYYY-MM-DD string) to Nepali Bikram Sambat date
 */
export function getNepaliDate(dateInput?: string | Date | null): ConvertedNepaliDate {
  try {
    let jsDate: Date;
    if (!dateInput) {
      jsDate = new Date();
    } else if (typeof dateInput === 'string') {
      // Avoid UTC midnight timezone roll-back by parsing year, month, day
      const parts = dateInput.split('T')[0].split('-');
      if (parts.length === 3) {
        jsDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
      } else {
        jsDate = new Date(dateInput);
      }
    } else {
      jsDate = dateInput;
    }

    const nepaliDate = new NepaliDateClass(jsDate);
    const bs = nepaliDate.getBS();
    const year = bs.year;
    const monthIndex = bs.month; // 0-indexed in getBS()
    const month = monthIndex + 1;
    const day = bs.date;
    const dayOfWeek = jsDate.getDay();

    const monthObj = NEPALI_MONTHS[monthIndex] || {
      index: monthIndex,
      nameEn: `Month ${month}`,
      nameNp: `महिना ${month}`,
    };
    const dayObj = NEPALI_DAYS[dayOfWeek] || {
      index: dayOfWeek,
      nameEn: 'Day',
      nameNp: 'दिन',
      shortNp: 'दिन',
    };

    const pad = (n: number) => String(n).padStart(2, '0');
    const bsDateStr = `${year}-${pad(month)}-${pad(day)}`;
    const bsDateDevanagari = `${toDevanagariDigits(year)}-${toDevanagariDigits(pad(month))}-${toDevanagariDigits(pad(day))}`;

    const formattedEn = `${day} ${monthObj.nameEn} ${year} B.S.`;
    const formattedNp = `${toDevanagariDigits(day)} ${monthObj.nameNp} ${toDevanagariDigits(year)}, ${dayObj.nameNp}`;
    const formattedCombined = `${day} ${monthObj.nameEn} ${year} B.S. (${dayObj.nameNp})`;
    const formattedBadge = `${toDevanagariDigits(day)} ${monthObj.nameNp} ${toDevanagariDigits(year)}`;

    return {
      year,
      monthIndex,
      month,
      day,
      dayOfWeek,
      bsDateStr,
      bsDateDevanagari,
      monthNameEn: monthObj.nameEn,
      monthNameNp: monthObj.nameNp,
      dayNameEn: dayObj.nameEn,
      dayNameNp: dayObj.nameNp,
      formattedEn,
      formattedNp,
      formattedCombined,
      formattedBadge,
    };
  } catch (error) {
    // Graceful fallback in case of out of range dates
    const d = new Date();
    const approxYear = d.getFullYear() + 57;
    return {
      year: approxYear,
      monthIndex: 0,
      month: 1,
      day: d.getDate(),
      dayOfWeek: d.getDay(),
      bsDateStr: `${approxYear}-01-01`,
      bsDateDevanagari: `${toDevanagariDigits(approxYear)}-०१-०१`,
      monthNameEn: 'Baisakh',
      monthNameNp: 'बैशाख',
      dayNameEn: 'Friday',
      dayNameNp: 'शुक्रबार',
      formattedEn: `${d.getDate()} Baisakh ${approxYear} B.S.`,
      formattedNp: `${toDevanagariDigits(d.getDate())} बैशाख ${toDevanagariDigits(approxYear)}`,
      formattedCombined: `${d.getDate()} Baisakh ${approxYear} B.S.`,
      formattedBadge: `${toDevanagariDigits(d.getDate())} बैशाख ${toDevanagariDigits(approxYear)}`,
    };
  }
}

/**
 * Converts a Nepali BS date (Year, month index 0-11, day) to Gregorian AD YYYY-MM-DD string
 */
export function convertBsToAd(year: number, monthIndex: number, day: number): string {
  try {
    const nd = new NepaliDateClass(year, monthIndex, day);
    const jsDate: Date = nd.toJsDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${jsDate.getFullYear()}-${pad(jsDate.getMonth() + 1)}-${pad(jsDate.getDate())}`;
  } catch {
    // Fallback: approximate
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${year - 57}-${pad(monthIndex + 1)}-${pad(day)}`;
  }
}

/**
 * Format any date string to Nepali B.S. string
 */
export function formatToNepaliDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const converted = getNepaliDate(dateInput);
  return converted.formattedEn;
}

/**
 * Format any date string to dual display: e.g. "2026-09-04 (19 Bhadra 2083 B.S.)"
 */
export function formatDualDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const converted = getNepaliDate(dateInput);
  const adStr = typeof dateInput === 'string' ? dateInput.split('T')[0] : dateInput.toISOString().split('T')[0];
  return `${adStr} (${converted.formattedEn})`;
}
