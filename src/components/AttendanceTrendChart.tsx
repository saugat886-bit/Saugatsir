import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { getNepaliDate } from '../utils/nepaliDate';

interface AttendanceTrendChartProps {
  students: Student[];
  records: AttendanceRecord[];
  selectedClass: string;
  selectedSection: string;
}

interface TrendDataPoint {
  date: string;
  displayDate: string;
  nepaliDisplay: string;
  dayOfWeek: string;
  isWeekend: boolean;
  rate: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  totalStudents: number;
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({
  students,
  records,
  selectedClass,
  selectedSection
}) => {
  const [timeRange, setTimeRange] = useState<30 | 14 | 7>(30);
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);

  // Student IDs set for quick membership test
  const studentIdSet = useMemo(() => new Set(students.map(s => s.id)), [students]);

  // Fast index for records
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    records.forEach(r => {
      if (studentIdSet.has(r.studentId)) {
        map.set(`${r.studentId}:${r.date}`, r);
      }
    });
    return map;
  }, [records, studentIdSet]);

  // Compute last N days trend data
  const trendData = useMemo(() => {
    const data: TrendDataPoint[] = [];
    const today = new Date();
    const studentCount = students.length;

    if (studentCount === 0) return [];

    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayOfWeekIdx = d.getDay();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayOfWeek = dayNames[dayOfWeekIdx];
      const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;

      if (!includeWeekends && isWeekend) {
        continue;
      }

      let present = 0;
      let absent = 0;
      let late = 0;
      let excused = 0;
      let recordedCount = 0;

      students.forEach(s => {
        const rec = recordMap.get(`${s.id}:${dateStr}`);
        if (rec) {
          recordedCount++;
          if (rec.status === 'present') present++;
          else if (rec.status === 'absent') absent++;
          else if (rec.status === 'late') late++;
          else if (rec.status === 'excused') excused++;
        }
      });

      // If no records exist for this day (e.g. not recorded yet), we assume 0 or unrecorded
      // Effective attendance = present + (late * 0.5)
      const denominator = recordedCount > 0 ? recordedCount : studentCount;
      const rate = denominator > 0 && recordedCount > 0
        ? Math.round(((present + (late * 0.5)) / denominator) * 100)
        : (isWeekend ? 0 : 0);

      const nep = getNepaliDate(dateStr);

      data.push({
        date: dateStr,
        displayDate: `${monthShortNames[d.getMonth()]} ${d.getDate()}`,
        nepaliDisplay: nep.formattedBadge,
        dayOfWeek,
        isWeekend,
        rate: recordedCount > 0 ? rate : 0,
        present,
        absent,
        late,
        excused,
        totalStudents: studentCount
      });
    }

    return data;
  }, [students, recordMap, timeRange, includeWeekends]);

  // Key stats
  const activeTrendDays = trendData.filter(d => d.present + d.absent + d.late + d.excused > 0);
  const avgRate = activeTrendDays.length > 0
    ? Math.round(activeTrendDays.reduce((acc, d) => acc + d.rate, 0) / activeTrendDays.length)
    : 0;

  const maxDay = activeTrendDays.length > 0
    ? [...activeTrendDays].sort((a, b) => b.rate - a.rate)[0]
    : null;

  const minDay = activeTrendDays.length > 0
    ? [...activeTrendDays].sort((a, b) => a.rate - b.rate)[0]
    : null;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: TrendDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {data.nepaliDisplay}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {data.displayDate} ({data.dayOfWeek}) • {data.date} AD
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
              data.rate >= 90 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : data.rate >= 75
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {data.rate}% Rate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Present: <strong>{data.present}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>Absent: <strong>{data.absent}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Late: <strong>{data.late}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400">
              <Info className="w-3.5 h-3.5" />
              <span>Excused: <strong>{data.excused}</strong></span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
            <span>Total Enrolled:</span>
            <span className="text-slate-200 font-semibold">{data.totalStudents} Students</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>30-Day Attendance Trend</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {selectedClass === 'ALL' ? 'All Classes' : selectedClass} {selectedSection !== 'ALL' ? `• Sec ${selectedSection}` : ''}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Daily classroom attendance percentages and rolling performance metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Action / Range Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Day Window Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange(7)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 7 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange(14)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 14 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange(30)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 30 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Toggle Weekend Filter */}
          <button
            type="button"
            onClick={() => setIncludeWeekends(!includeWeekends)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              includeWeekends
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {includeWeekends ? 'Weekends On' : 'School Days Only'}
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {timeRange}-Day Average
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">{avgRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold">avg rate</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Peak Day Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">
              {maxDay ? `${maxDay.rate}%` : 'N/A'}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {maxDay?.displayDate}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Lowest Day Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">
              {minDay ? `${minDay.rate}%` : 'N/A'}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {minDay?.displayDate}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Logged Sessions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-sky-400">
              {activeTrendDays.length}
            </span>
            <span className="text-xs text-slate-400">days logged</span>
          </div>
        </div>
      </div>

      {/* Line & Area Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        {trendData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            No attendance records available for the selected range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                opacity={0.35} 
                vertical={false} 
              />

              <XAxis 
                dataKey="displayDate" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: '#334155' }}
                axisLine={{ stroke: '#334155' }}
                interval={timeRange === 30 ? 3 : 1}
              />

              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 25, 50, 75, 100]}
                unit="%" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: '#334155' }}
                axisLine={{ stroke: '#334155' }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Benchmark Reference Line at 85% and 75% target */}
              <ReferenceLine 
                y={85} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                strokeOpacity={0.6}
                label={{ value: 'Target 85%', fill: '#10b981', fontSize: 10, position: 'right' }} 
              />

              <Area
                type="monotone"
                dataKey="rate"
                name="Attendance Rate"
                stroke="none"
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />

              <Line
                type="monotone"
                dataKey="rate"
                name="Attendance Percentage"
                stroke="url(#lineColor)"
                strokeWidth={3}
                dot={{ r: 3, fill: '#38bdf8', strokeWidth: 1.5, stroke: '#0f172a' }}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Chart Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"></span>
            Daily Attendance Rate (%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-emerald-500"></span>
            School Target Goal (85%)
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Hover over data points to inspect Present, Absent & Late breakdowns.
        </span>
      </div>

    </div>
  );
};
