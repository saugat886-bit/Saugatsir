import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  X,
  Check,
  Globe
} from 'lucide-react';
import { 
  getNepaliDate, 
  convertBsToAd, 
  NEPALI_MONTHS, 
  NEPALI_DAYS, 
  toDevanagariDigits 
} from '../utils/nepaliDate';

interface NepaliDateSelectorProps {
  currentDate: string; // YYYY-MM-DD (AD)
  onDateChange: (newAdDate: string) => void;
  compact?: boolean;
}

export const NepaliDateSelector: React.FC<NepaliDateSelectorProps> = ({
  currentDate,
  onDateChange,
  compact = false,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Current calculated Nepali date info
  const nepaliDate = useMemo(() => getNepaliDate(currentDate), [currentDate]);

  // State for the picker modal/popover
  const [pickerYear, setPickerYear] = useState<number>(nepaliDate.year);
  const [pickerMonth, setPickerMonth] = useState<number>(nepaliDate.monthIndex);
  const [pickerDay, setPickerDay] = useState<number>(nepaliDate.day);

  // Available BS years (e.g., 2075 - 2090)
  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = 2075; y <= 2090; y++) {
      years.push(y);
    }
    return years;
  }, []);

  // Days in Nepali months usually range between 29 and 32 days
  const daysInMonth = useMemo(() => {
    // Generate 32 days, user can select any valid day
    const days: number[] = [];
    for (let d = 1; d <= 32; d++) {
      days.push(d);
    }
    return days;
  }, []);

  const openPicker = () => {
    setPickerYear(nepaliDate.year);
    setPickerMonth(nepaliDate.monthIndex);
    setPickerDay(nepaliDate.day);
    setIsPickerOpen(true);
  };

  const handleApplyPicker = () => {
    const newAdDate = convertBsToAd(pickerYear, pickerMonth, pickerDay);
    onDateChange(newAdDate);
    setIsPickerOpen(false);
  };

  const shiftDay = (delta: number) => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const pad = (n: number) => String(n).padStart(2, '0');
    onDateChange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  const setToday = () => {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    onDateChange(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`);
  };

  const isToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return currentDate === todayStr;
  }, [currentDate]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => shiftDay(-1)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="अघिल्लो दिन (Previous Day)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={openPicker}
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-left group"
            title="Open Nepali BS Calendar Picker"
          >
            <CalendarDays className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-white text-xs leading-tight group-hover:text-sky-300 transition-colors">
                {nepaliDate.formattedNp}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">
                {nepaliDate.formattedEn} • {currentDate} AD
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => shiftDay(1)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="पछिल्लो दिन (Next Day)"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={setToday}
          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
            isToday 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
              : 'bg-slate-850 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          आज (Today)
        </button>

        {isPickerOpen && (
          <NepaliCalendarModal
            pickerYear={pickerYear}
            setPickerYear={setPickerYear}
            pickerMonth={pickerMonth}
            setPickerMonth={setPickerMonth}
            pickerDay={pickerDay}
            setPickerDay={setPickerDay}
            availableYears={availableYears}
            daysInMonth={daysInMonth}
            onClose={() => setIsPickerOpen(false)}
            onApply={handleApplyPicker}
            onSetToday={() => {
              setToday();
              setIsPickerOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Main Nepali Date Highlight Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Nepali Bikram Sambat Date Badge & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex flex-col items-center justify-center shadow-md shadow-rose-900/40 flex-shrink-0 border border-rose-500/30">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-100 leading-none">वि.सं.</span>
            <span className="text-base font-black leading-tight mt-0.5">{toDevanagariDigits(nepaliDate.day)}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <span>नेपाली पात्रो (B.S. Calendar)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {nepaliDate.dayNameNp} ({nepaliDate.dayNameEn})
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                {nepaliDate.formattedNp}
              </h4>
              <span className="text-xs sm:text-sm font-semibold text-slate-400">
                ({nepaliDate.formattedEn})
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-400" />
                <span>ई.सं. (Gregorian A.D.): <strong className="text-slate-200 font-mono">{currentDate}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Navigation & Calendar Picker Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
          
          {/* Day stepper */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              id="btn-nepali-prev-day"
              type="button"
              onClick={() => shiftDay(-1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="अघिल्लो दिन (Previous Day)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="btn-open-nepali-calendar"
              type="button"
              onClick={openPicker}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-200 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="नेपाली पात्रो छान्नुहोस् (Select BS Date)"
            >
              <CalendarDays className="w-4 h-4 text-rose-400" />
              <span>वि.सं. छान्नुहोस्</span>
            </button>

            <button
              id="btn-nepali-next-day"
              type="button"
              onClick={() => shiftDay(1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="पछिल्लो दिन (Next Day)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Standard HTML Date Picker for AD input */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
            <CalendarIcon className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
            <input
              id="attendance-ad-date-input"
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              title="Select Gregorian (A.D.) date"
            />
          </div>

          {/* Today Button */}
          <button
            id="btn-nepali-today"
            type="button"
            onClick={setToday}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isToday 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-sm' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            आज (Today)
          </button>
        </div>
      </div>

      {/* Nepali Calendar BS Picker Modal */}
      {isPickerOpen && (
        <NepaliCalendarModal
          pickerYear={pickerYear}
          setPickerYear={setPickerYear}
          pickerMonth={pickerMonth}
          setPickerMonth={setPickerMonth}
          pickerDay={pickerDay}
          setPickerDay={setPickerDay}
          availableYears={availableYears}
          daysInMonth={daysInMonth}
          onClose={() => setIsPickerOpen(false)}
          onApply={handleApplyPicker}
          onSetToday={() => {
            setToday();
            setIsPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface NepaliCalendarModalProps {
  pickerYear: number;
  setPickerYear: (y: number) => void;
  pickerMonth: number;
  setPickerMonth: (m: number) => void;
  pickerDay: number;
  setPickerDay: (d: number) => void;
  availableYears: number[];
  daysInMonth: number[];
  onClose: () => void;
  onApply: () => void;
  onSetToday: () => void;
}

const NepaliCalendarModal: React.FC<NepaliCalendarModalProps> = ({
  pickerYear,
  setPickerYear,
  pickerMonth,
  setPickerMonth,
  pickerDay,
  setPickerDay,
  availableYears,
  daysInMonth,
  onClose,
  onApply,
  onSetToday,
}) => {
  const selectedMonthInfo = NEPALI_MONTHS[pickerMonth] || NEPALI_MONTHS[0];
  const convertedAdPreview = useMemo(() => {
    return convertBsToAd(pickerYear, pickerMonth, pickerDay);
  }, [pickerYear, pickerMonth, pickerDay]);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 text-rose-300 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">नेपाली पात्रो (Bikram Sambat BS Calendar)</h3>
              <p className="text-[11px] text-slate-400">Select Nepali attendance date</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Year & Month Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Year Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                वर्ष (Year BS)
              </label>
              <select
                value={pickerYear}
                onChange={(e) => setPickerYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {availableYears.map(y => (
                  <option key={y} value={y} className="bg-slate-900 text-white">
                    {toDevanagariDigits(y)} वि.सं. ({y} BS)
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                महिना (Month BS)
              </label>
              <select
                value={pickerMonth}
                onChange={(e) => setPickerMonth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {NEPALI_MONTHS.map(m => (
                  <option key={m.index} value={m.index} className="bg-slate-900 text-white">
                    {toDevanagariDigits(m.index + 1)}. {m.nameNp} ({m.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Day selection grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-slate-400">
                गते (Day of {selectedMonthInfo.nameNp})
              </label>
              <span className="text-[11px] font-bold text-rose-400">
                छानिएको: {toDevanagariDigits(pickerDay)} गते ({pickerDay})
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {daysInMonth.map((d) => {
                const isSelected = d === pickerDay;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPickerDay(d)}
                    className={`py-2 px-1 text-xs rounded-lg font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 scale-105'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="text-xs">{toDevanagariDigits(d)}</span>
                    <span className="text-[9px] opacity-70 font-normal">{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Conversion Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date Preview</span>
              <div className="text-xs font-bold text-white mt-0.5">
                {toDevanagariDigits(pickerDay)} {selectedMonthInfo.nameNp} {toDevanagariDigits(pickerYear)} B.S.
              </div>
              <div className="text-[11px] text-slate-400">
                Equivalent Gregorian A.D.: <strong className="text-sky-300 font-mono">{convertedAdPreview}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onSetToday}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              आज (Today)
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-apply-nepali-date"
            type="button"
            onClick={onApply}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-900/30 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Date (मिति लागू गर्नुहोस्)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
