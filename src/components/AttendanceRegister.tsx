import React, { useState, useMemo } from 'react';
import { Calendar, Download, Printer, ChevronLeft, ChevronRight, FileSpreadsheet, CheckCircle2, TrendingUp } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { sortStudents } from '../utils/studentSort';

interface AttendanceRegisterProps {
  students: Student[];
  records: AttendanceRecord[];
  selectedClass: string;
  selectedSection: string;
}

export const AttendanceRegister: React.FC<AttendanceRegisterProps> = ({
  students,
  records,
  selectedClass,
  selectedSection
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // 0-indexed

  // Ensure students are ordered roll-number wise in alphabetical order
  const sortedStudents = useMemo(() => {
    return sortStudents(students, 'roll-asc', true);
  }, [students]);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Number of days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month change navigation
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (day: number) => {
    const m = String(selectedMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${selectedYear}-${m}-${d}`;
  };

  // Helper for day of week name (M, T, W, Th, F, Sa, Su)
  const getDayOfWeek = (day: number) => {
    const d = new Date(selectedYear, selectedMonth, day);
    const dayOfWeek = d.getDay();
    const names = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return { name: names[dayOfWeek], isWeekend: dayOfWeek === 0 || dayOfWeek === 6 };
  };

  // Create fast lookup map: `studentId:YYYY-MM-DD` -> record
  const recordMap = new Map<string, AttendanceRecord>();
  records.forEach(r => {
    recordMap.set(`${r.studentId}:${r.date}`, r);
  });

  // Calculate monthly stats for a student
  const getStudentMonthStats = (studentId: string) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let workingDaysCount = 0;

    daysArray.forEach(day => {
      const { isWeekend } = getDayOfWeek(day);
      if (isWeekend) return;
      
      workingDaysCount++;
      const dateStr = formatDateString(day);
      const rec = recordMap.get(`${studentId}:${dateStr}`);
      if (rec) {
        if (rec.status === 'present') present++;
        else if (rec.status === 'absent') absent++;
        else if (rec.status === 'late') late++;
        else if (rec.status === 'excused') excused++;
      }
    });

    const effectivePresent = present + (late * 0.5);
    const percentage = workingDaysCount > 0 ? Math.round((effectivePresent / workingDaysCount) * 100) : 100;
    return { present, absent, late, excused, workingDaysCount, percentage };
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Class',
      'Section',
      'Student Phone',
      'Address',
      'Parent Name',
      'Parent Relationship',
      'Parent Phone',
      ...daysArray.map(d => `${monthNames[selectedMonth].substring(0,3)} ${d}`),
      'Total Present',
      'Total Absent',
      'Total Late',
      'Total Excused',
      'Attendance %'
    ];

    const rows = sortedStudents.map(student => {
      const stats = getStudentMonthStats(student.id);
      const dayStatuses = daysArray.map(day => {
        const { isWeekend } = getDayOfWeek(day);
        if (isWeekend) return 'Weekend';
        const dateStr = formatDateString(day);
        const rec = recordMap.get(`${student.id}:${dateStr}`);
        return rec ? rec.status.toUpperCase() : '-';
      });

      return [
        `"${student.rollNumber}"`,
        `"${student.fullName}"`,
        `"${student.className}"`,
        `"${student.section}"`,
        `"${student.phone}"`,
        `"${student.address.street}, ${student.address.city}"`,
        `"${student.parents.primaryContactName}"`,
        `"${student.parents.relationship}"`,
        `"${student.parents.phone}"`,
        ...dayStatuses.map(s => `"${s}"`),
        stats.present,
        stats.absent,
        stats.late,
        stats.excused,
        `"${stats.percentage}%"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Register_${selectedClass}_${monthNames[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 30-Day Attendance Trend Line Chart Visualization */}
      <AttendanceTrendChart
        students={students}
        records={records}
        selectedClass={selectedClass}
        selectedSection={selectedSection}
      />

      {/* Month Navigator & Export Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-100 text-sm">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legend & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 mr-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> P = Present</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500"></span> A = Absent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500"></span> L = Late</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500"></span> E = Excused</span>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* Monthly Attendance Grid Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="p-3 sticky left-0 z-20 bg-slate-950 w-12 text-center border-r border-slate-800">Roll</th>
                <th className="p-3 sticky left-12 z-20 bg-slate-950 min-w-[180px] border-r border-slate-800">Student & Class</th>
                
                {/* Days header */}
                {daysArray.map(day => {
                  const { name, isWeekend } = getDayOfWeek(day);
                  return (
                    <th 
                      key={day} 
                      className={`p-1.5 text-center min-w-[28px] border-r border-slate-800/60 ${
                        isWeekend ? 'bg-slate-950/90 text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      <div className="font-bold">{day}</div>
                      <div className="text-[9px] text-slate-500 font-normal">{name}</div>
                    </th>
                  );
                })}

                {/* Summary columns */}
                <th className="p-2.5 text-center bg-emerald-950/20 text-emerald-400 font-bold border-l border-slate-800">P</th>
                <th className="p-2.5 text-center bg-rose-950/20 text-rose-400 font-bold">A</th>
                <th className="p-2.5 text-center bg-amber-950/20 text-amber-400 font-bold">L</th>
                <th className="p-2.5 text-center bg-sky-950/30 text-sky-400 font-bold">Rate</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 6} className="p-10 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                sortedStudents.map((student) => {
                  const stats = getStudentMonthStats(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Roll Number */}
                      <td className="p-2.5 text-center sticky left-0 z-10 bg-slate-900 border-r border-slate-800 font-bold text-slate-300">
                        {student.rollNumber}
                      </td>

                      {/* Student Name & Class */}
                      <td className="p-2.5 sticky left-12 z-10 bg-slate-900 border-r border-slate-800">
                        <div className="font-semibold text-slate-100 truncate">{student.fullName}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {student.className} - Sec {student.section}
                        </div>
                      </td>

                      {/* Day cells */}
                      {daysArray.map(day => {
                        const { isWeekend } = getDayOfWeek(day);
                        const dateStr = formatDateString(day);
                        const rec = recordMap.get(`${student.id}:${dateStr}`);
                        const status = rec?.status;

                        if (isWeekend) {
                          return (
                            <td key={day} className="p-1 text-center bg-slate-950/40 border-r border-slate-800/40 text-slate-600 text-[10px]">
                              -
                            </td>
                          );
                        }

                        let badgeColor = 'text-slate-600 bg-transparent';
                        let char = '-';

                        if (status === 'present') {
                          badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                          char = 'P';
                        } else if (status === 'absent') {
                          badgeColor = 'bg-rose-500/25 text-rose-400 border border-rose-500/40 font-bold';
                          char = 'A';
                        } else if (status === 'late') {
                          badgeColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold';
                          char = 'L';
                        } else if (status === 'excused') {
                          badgeColor = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
                          char = 'E';
                        }

                        return (
                          <td key={day} className="p-1 text-center border-r border-slate-800/40">
                            <span 
                              className={`inline-block w-5 h-5 leading-5 rounded text-[10px] font-semibold text-center ${badgeColor}`}
                              title={rec?.remark ? `${status?.toUpperCase()}: ${rec.remark}` : status?.toUpperCase()}
                            >
                              {char}
                            </span>
                          </td>
                        );
                      })}

                      {/* Monthly Stats */}
                      <td className="p-2 text-center bg-emerald-950/10 font-bold text-emerald-400 border-l border-slate-800">
                        {stats.present}
                      </td>
                      <td className="p-2 text-center bg-rose-950/10 font-bold text-rose-400">
                        {stats.absent}
                      </td>
                      <td className="p-2 text-center bg-amber-950/10 font-bold text-amber-400">
                        {stats.late}
                      </td>
                      <td className="p-2 text-center bg-sky-950/20 font-bold text-sky-400">
                        {stats.percentage}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
