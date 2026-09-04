// SUNGABHA CONNECT (सुनगाभा कनेक्ट) — Main Application Shell
// Sungabha Public Secondary School, Sainamaina-03, Rupandehi, Nepal (ISO 9001:2015 Certified)

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Student,
  AttendanceRecord,
  AttendanceStatus,
  ClassSection,
  HouseStats,
  BusRoute,
  Homework,
  FeeRecord,
  ExamRecord,
  Notice,
  ECAEvent,
  TimetablePeriod,
  ViewTab,
  StudentPortfolioItem,
  HouseType
} from './types';
import {
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_HOUSES,
  INITIAL_BUS_ROUTES,
  INITIAL_HOMEWORK,
  INITIAL_FEES,
  INITIAL_EXAMS,
  INITIAL_NOTICES,
  INITIAL_ECA_EVENTS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  generateInitialAttendance
} from './data/initialData';
import { sortStudents, resequenceRollNumbersAlphabetically } from './utils/studentSort';

// Component imports
import { Header } from './components/Header';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentPortal } from './components/ParentPortal';
import { StudentBackpack } from './components/StudentBackpack';
import { StudentDirectory } from './components/StudentDirectory';
import { AttendanceSheet } from './components/AttendanceSheet';
import { AttendanceRegister } from './components/AttendanceRegister';
import { ClassSectionManager } from './components/ClassSectionManager';
import { ExamReportCardModule } from './components/ExamReportCardModule';
import { FeeManagementModule } from './components/FeeManagementModule';
import { TransportModule } from './components/TransportModule';
import { HouseModule } from './components/HouseModule';
import { HostelModule } from './components/HostelModule';
import { ECAModule } from './components/ECAModule';
import { NoticeBoardModule } from './components/NoticeBoardModule';
import { AIAssistantModule } from './components/AIAssistantModule';
import { TimetableModule } from './components/TimetableModule';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { AuthModal } from './components/AuthModal';

const STORAGE_PREFIX = 'sungabha_';

export function App() {
  // 1. Current Active User & Role
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEMO_USERS[1]; // Default to Principal (Rameshwar Adhikari)
  });

  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 2. School Core State
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}students`);
    if (!saved) return INITIAL_STUDENTS;
    try {
      const parsed: Student[] = JSON.parse(saved);
      return sortStudents(parsed, 'roll-asc', true);
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [classes, setClasses] = useState<ClassSection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [currentDate, setCurrentDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [houses, setHouses] = useState<HouseStats[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}houses`);
    return saved ? JSON.parse(saved) : INITIAL_HOUSES;
  });

  const [buses, setBuses] = useState<BusRoute[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}buses`);
    return saved ? JSON.parse(saved) : INITIAL_BUS_ROUTES;
  });

  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}homework`);
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [fees, setFees] = useState<FeeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}fees`);
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [exams, setExams] = useState<ExamRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [ecaEvents, setEcaEvents] = useState<ECAEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}eca_events`);
    if (!saved) return INITIAL_ECA_EVENTS;
    try {
      const parsed: ECAEvent[] = JSON.parse(saved);
      return parsed.map(ev => ({
        ...ev,
        winners: Array.isArray(ev.winners) ? ev.winners : (ev.winnerStudentNames && ev.winnerStudentNames.length > 0
          ? ev.winnerStudentNames.map((name, idx) => ({
              position: (idx === 0 ? 1 : idx === 1 ? 2 : 3) as 1 | 2 | 3,
              studentName: name,
              house: ev.winnerHouse || 'Sagarmatha',
              points: idx === 0 ? 50 : 30
            }))
          : []),
        location: ev.location || ev.venue || 'School Campus',
        venue: ev.venue || ev.location || 'School Campus',
        status: ev.status || ((ev.winners && ev.winners.length > 0) || (ev.winnerStudentNames && ev.winnerStudentNames.length > 0) ? 'COMPLETED' : 'UPCOMING')
      }));
    } catch {
      return INITIAL_ECA_EVENTS;
    }
  });

  const [timetable, setTimetable] = useState<TimetablePeriod[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}timetable`);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  // 3. Modals State
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}houses`, JSON.stringify(houses));
  }, [houses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}fees`, JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}eca_events`, JSON.stringify(ecaEvents));
  }, [ecaEvents]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handler: Change Role Switcher
  const handleSelectRole = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'PARENT') {
      setActiveTab('parent_portal');
    } else if (user.role === 'STUDENT') {
      setActiveTab('student_backpack');
    } else if (user.role === 'TEACHER' || user.role === 'ACADEMIC_COORDINATOR') {
      setActiveTab('teacher_hub');
    } else if (user.role === 'ACCOUNTANT') {
      setActiveTab('fees');
    } else if (user.role === 'HOSTEL_WARDEN') {
      setActiveTab('hostel');
    } else if (user.role === 'ECA_COORDINATOR') {
      setActiveTab('eca');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Attendance Handlers
  const handleMarkAttendance = (studentId: string, status: AttendanceStatus, remark?: string) => {
    const student = students.find(s => s.id === studentId);
    setRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === currentDate);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          status,
          remark: remark !== undefined ? remark : updated[idx].remark,
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att_${studentId}_${currentDate}`,
          studentId,
          className: student?.className || 'Grade 6',
          section: student?.section || 'Moon',
          date: currentDate,
          status,
          remark,
          markedBy: currentUser.fullName,
          updatedAt: new Date().toISOString()
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleBatchMarkAll = (status: AttendanceStatus) => {
    setRecords(prev => {
      const map = new Map<string, AttendanceRecord>();
      prev.forEach(r => map.set(`${r.studentId}::${r.date}`, r));

      students.forEach(st => {
        const key = `${st.id}::${currentDate}`;
        const existing = map.get(key);
        map.set(key, {
          id: existing ? existing.id : `att_${st.id}_${currentDate}`,
          studentId: st.id,
          className: st.className,
          section: st.section,
          date: currentDate,
          status,
          remark: existing?.remark,
          markedBy: currentUser.fullName,
          updatedAt: new Date().toISOString()
        });
      });

      return Array.from(map.values());
    });
  };

  const handleClearDate = () => {
    if (confirm(`Clear marked attendance for date: ${currentDate}?`)) {
      setRecords(prev => prev.filter(r => r.date !== currentDate));
    }
  };

  // Class Management Handlers
  const handleAddClassSection = (newClass: Omit<ClassSection, 'id'>) => {
    const created: ClassSection = {
      ...newClass,
      id: `cs_${Date.now()}`
    };
    setClasses(prev => [...prev, created]);
  };

  const handleUpdateClassSection = (updated: ClassSection) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteClassSection = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Exam & Marks Handlers
  const handleSaveExamRecord = (newRecord: ExamRecord) => {
    setExams(prev => {
      const idx = prev.findIndex(e => e.id === newRecord.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });
  };

  // House Points Handlers
  const handleAwardHousePoints = (houseName: string, category: string, points: number, reason: string) => {
    setHouses(prev => prev.map(h => {
      if (h.house === houseName) {
        return {
          ...h,
          totalPoints: Math.max(0, h.totalPoints + points),
          recentActivities: [
            { event: reason || `${category} Points Awarded`, points, date: new Date().toISOString().split('T')[0] },
            ...h.recentActivities
          ]
        };
      }
      return h;
    }));
  };

  // Hostel Handlers
  const handleUpdateHostelStatus = (studentId: string, isHostel: boolean, room?: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isHostel, hostelRoom: room } : s));
  };

  // ECA Handlers
  const handleAddECAEvent = (event: Omit<ECAEvent, 'id'>) => {
    const created: ECAEvent = {
      ...event,
      id: `eca_${Date.now()}`,
      winners: event.winners || [],
      status: event.status || 'UPCOMING'
    };
    setEcaEvents(prev => [created, ...prev]);
  };

  const handleRecordECAWinner = (eventId: string, winner: { position: 1 | 2 | 3; studentId?: string; studentName: string; house?: string; points?: number }) => {
    setEcaEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const currentWinners = Array.isArray(ev.winners) ? ev.winners : [];
        const updatedWinners = [...currentWinners.filter(w => w.position !== winner.position), winner].sort((a, b) => a.position - b.position);
        return {
          ...ev,
          status: 'COMPLETED',
          winners: updatedWinners,
          winnerStudentNames: updatedWinners.map(w => w.studentName),
          winnerHouse: (winner.house as HouseType) || ev.winnerHouse
        };
      }
      return ev;
    }));

    if (winner.house && winner.points) {
      handleAwardHousePoints(winner.house, 'ECA & Sports', winner.points, `Podium Winner in ECA: ${winner.studentName}`);
    }
  };

  // Notice Handlers
  const handleAddNotice = (notice: Omit<Notice, 'id'>) => {
    const created: Notice = {
      ...notice,
      id: `notice_${Date.now()}`,
      publisherRole: currentUser.role
    };
    setNotices(prev => [created, ...prev]);
  };

  const handleToggleEmergency = (noticeId: string) => {
    setNotices(prev => prev.map(n => n.id === noticeId ? { ...n, isEmergency: !n.isEmergency } : n));
  };

  // Fee Collection Handler
  const handleRecordPayment = (studentId: string, amount: number, paymentMode: 'CASH' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER') => {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    setFees(prev => {
      const existing = prev.find(f => f.studentId === studentId);
      if (existing) {
        return prev.map(f => f.studentId === studentId ? {
          ...f,
          paidAmount: f.paidAmount + amount,
          dueAmount: Math.max(0, f.amount - (f.paidAmount + amount)),
          status: (f.paidAmount + amount) >= f.amount ? 'PAID' : 'PARTIAL',
          receiptNumber: `REC-2082-${Math.floor(1000 + Math.random() * 9000)}`,
          lastPaymentDate: new Date().toISOString().split('T')[0]
        } : f);
      } else {
        const newFee: FeeRecord = {
          id: `fee_${Date.now()}`,
          studentId,
          studentName: st.fullName,
          className: st.className,
          section: st.section,
          feeType: 'Tuition',
          amount: 3200,
          paidAmount: amount,
          dueAmount: Math.max(0, 3200 - amount),
          dueDate: '2082-04-30',
          status: amount >= 3200 ? 'PAID' : 'PARTIAL',
          receiptNumber: `REC-2082-${Math.floor(1000 + Math.random() * 9000)}`,
          lastPaymentDate: new Date().toISOString().split('T')[0]
        };
        return [...prev, newFee];
      }
    });
  };

  // Student CRUD Handlers
  const handleSaveStudent = (studentData: Omit<Student, 'id'>, existingId?: string) => {
    if (existingId) {
      setStudents(prev => sortStudents(prev.map(s => s.id === existingId ? { ...studentData, id: existingId } : s), 'roll-asc', true));
      if (selectedStudentForDetail && selectedStudentForDetail.id === existingId) {
        setSelectedStudentForDetail({ ...studentData, id: existingId });
      }
    } else {
      const newStudent: Student = {
        ...studentData,
        id: `std-${Date.now()}`
      };
      setStudents(prev => sortStudents([newStudent, ...prev], 'roll-asc', true));
    }
  };

  const handleResequenceRollNumbers = (targetClass?: string, targetSection?: string) => {
    setStudents(prev => resequenceRollNumbersAlphabetically(prev, targetClass, targetSection));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setRecords(prev => prev.filter(r => r.studentId !== id));
    if (selectedStudentForDetail && selectedStudentForDetail.id === id) {
      setSelectedStudentForDetail(null);
    }
  };

  const handleUpdateStudentPortfolio = (studentId: string, portfolio: StudentPortfolioItem[]) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, portfolio } : s));
    if (selectedStudentForDetail && selectedStudentForDetail.id === studentId) {
      setSelectedStudentForDetail(prev => prev ? { ...prev, portfolio } : null);
    }
  };

  const handleUpdateStudentAvatar = (studentId: string, avatarUrl: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, avatarUrl } : s));
    if (selectedStudentForDetail && selectedStudentForDetail.id === studentId) {
      setSelectedStudentForDetail(prev => prev ? { ...prev, avatarUrl } : null);
    }
  };

  const handleImportStudentsFromExcel = (newStudents: Student[]) => {
    setStudents(prev => {
      const map = new Map<string, Student>();
      prev.forEach(s => map.set(s.admissionNumber || s.id, s));
      newStudents.forEach(s => map.set(s.admissionNumber || s.id, s));
      return sortStudents(Array.from(map.values()), 'roll-asc', true);
    });
  };

  const handleResetDemoData = () => {
    if (confirm('Reset entire school system back to original Sungabha demo data?')) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setRecords(generateInitialAttendance(INITIAL_STUDENTS));
      setClasses(INITIAL_CLASSES);
      setHouses(INITIAL_HOUSES);
      setBuses(INITIAL_BUS_ROUTES);
      setHomeworkList(INITIAL_HOMEWORK);
      setFees(INITIAL_FEES);
      setExams(INITIAL_EXAMS);
      setNotices(INITIAL_NOTICES);
      setEcaEvents(INITIAL_ECA_EVENTS);
      setTimetable(INITIAL_TIMETABLE);
      setCurrentUser(DEMO_USERS[1]);
    }
  };

  // Find linked student for parent or student portal
  const activeStudent = students.find(s => currentUser.associatedStudentIds?.includes(s.id)) || students[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white pb-20">
      
      {/* Top Application Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        notices={notices}
        onSelectTab={(tab) => setActiveTab(tab as ViewTab)}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onResetDemo={handleResetDemoData}
        isOnline={isOnline}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. Admin & Principal Master Dashboard */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            currentUser={currentUser}
            students={students}
            records={records}
            classes={classes}
            notices={notices}
            fees={fees}
            houses={houses}
            events={ecaEvents}
            buses={buses}
            exams={exams}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsAddEditModalOpen(true);
            }}
            onOpenExcelImport={() => setIsExcelModalOpen(true)}
            onOpenCreateNotice={() => setActiveTab('notices')}
          />
        )}

        {/* 2. Teacher Daily Operations Hub */}
        {activeTab === 'teacher_hub' && (
          <TeacherDashboard
            currentUser={currentUser}
            classes={classes}
            students={students}
            records={records}
            homework={homeworkList}
            timetable={timetable}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCreateHomework={() => setActiveTab('ai_assistant')}
            onOpenMarksEntry={() => setActiveTab('exams')}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsAddEditModalOpen(true);
            }}
          />
        )}

        {/* 3. Parent Portal */}
        {activeTab === 'parent_portal' && (
          <ParentPortal
            currentUser={currentUser}
            students={students.filter(s => currentUser.associatedStudentIds?.includes(s.id) || s.id === activeStudent?.id)}
            records={records}
            homework={homeworkList}
            exams={exams}
            notices={notices}
            fees={fees}
            buses={buses}
            houses={houses}
            onContactTeacher={(teacherName, studentName) => {
              alert(`Calling/Messaging ${teacherName} regarding student ${studentName}...`);
            }}
          />
        )}

        {/* 4. Student Digital Backpack */}
        {activeTab === 'student_backpack' && (
          <StudentBackpack
            student={activeStudent}
            records={records}
            homework={homeworkList}
            exams={exams}
            notices={notices}
            houses={houses}
            timetable={timetable.filter(t => t.className === activeStudent?.className && t.section === activeStudent?.section)}
            onSubmitHomework={(hwId, text) => {
              setHomeworkList(prev => prev.map(hw => hw.id === hwId ? {
                ...hw,
                submissions: [
                  ...hw.submissions,
                  {
                    studentId: activeStudent.id,
                    studentName: activeStudent.fullName,
                    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                    submissionText: text,
                    status: 'SUBMITTED'
                  }
                ]
              } : hw));
              alert('Homework submitted successfully to your teacher!');
            }}
          />
        )}

        {/* 5. Student & Parent Master Directory */}
        {activeTab === 'students' && (
          <StudentDirectory
            students={students}
            records={records}
            currentUser={currentUser}
            onViewStudent={(st) => setSelectedStudentForDetail(st)}
            onEditStudent={(st) => {
              setStudentToEdit(st);
              setIsAddEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onOpenExcelModal={() => setIsExcelModalOpen(true)}
            onOpenAddModal={() => {
              setStudentToEdit(null);
              setIsAddEditModalOpen(true);
            }}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onResequenceRollNumbers={handleResequenceRollNumbers}
          />
        )}

        {/* 6. Fast 1-Tap Attendance Sheet */}
        {activeTab === 'attendance' && (
          <AttendanceSheet
            students={students}
            records={records}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onMarkAttendance={handleMarkAttendance}
            onBatchMarkAll={handleBatchMarkAll}
            onClearDate={handleClearDate}
            onViewStudent={(st) => setSelectedStudentForDetail(st)}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsAddEditModalOpen(true);
            }}
          />
        )}

        {/* 7. Class & Section Manager */}
        {activeTab === 'classes' && (
          <ClassSectionManager
            currentUser={currentUser}
            classes={classes}
            students={students}
            onAddClassSection={handleAddClassSection}
            onUpdateClassSection={handleUpdateClassSection}
            onDeleteClassSection={handleDeleteClassSection}
          />
        )}

        {/* 8. Exam & ISO Report Card Generator */}
        {activeTab === 'exams' && (
          <ExamReportCardModule
            currentUser={currentUser}
            students={students}
            classes={classes}
            exams={exams}
            onSaveExamRecord={handleSaveExamRecord}
          />
        )}

        {/* 9. Accounts & Fee Management */}
        {activeTab === 'fees' && (
          <FeeManagementModule
            currentUser={currentUser}
            fees={fees}
            students={students}
            onRecordPayment={handleRecordPayment}
          />
        )}

        {/* 10. School Bus Fleet Operations */}
        {activeTab === 'transport' && (
          <TransportModule
            currentUser={currentUser}
            buses={buses}
            students={students}
          />
        )}

        {/* 11. House Points System */}
        {activeTab === 'houses' && (
          <HouseModule
            currentUser={currentUser}
            houses={houses}
            students={students}
            onAwardHousePoints={handleAwardHousePoints}
          />
        )}

        {/* 12. Hostel Boarding Hub */}
        {activeTab === 'hostel' && (
          <HostelModule
            currentUser={currentUser}
            students={students}
            onUpdateHostelStatus={handleUpdateHostelStatus}
          />
        )}

        {/* 13. ECA & Sports Tournaments */}
        {activeTab === 'eca' && (
          <ECAModule
            currentUser={currentUser}
            events={ecaEvents}
            students={students}
            houses={houses}
            onAddEvent={handleAddECAEvent}
            onRecordWinner={handleRecordECAWinner}
          />
        )}

        {/* 14. Official Notice Board & Broadcast */}
        {activeTab === 'notices' && (
          <NoticeBoardModule
            currentUser={currentUser}
            notices={notices}
            onAddNotice={handleAddNotice}
            onToggleEmergency={handleToggleEmergency}
          />
        )}

        {/* 15. AI CDC Copilot & Lesson Designer */}
        {activeTab === 'ai_assistant' && (
          <AIAssistantModule
            currentUser={currentUser}
            onUseAsHomework={(title, desc, subj) => {
              setHomeworkList(prev => [{
                id: `hw_${Date.now()}`,
                title,
                description: desc,
                subject: subj,
                className: 'Grade 6',
                section: 'Moon',
                teacherId: currentUser.id,
                teacherName: currentUser.fullName,
                assignedDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                submissions: []
              }, ...prev]);
              setActiveTab('teacher_hub');
            }}
          />
        )}

        {/* 16. School Timetable & Routines */}
        {activeTab === 'timetable' && (
          <TimetableModule
            currentUser={currentUser}
            timetable={timetable}
            classes={classes}
          />
        )}

        {/* 17. Monthly Attendance Register & Excel Export */}
        {activeTab === 'register' && (
          <AttendanceRegister
            students={students}
            records={records}
            selectedClass="Grade 6"
            selectedSection="Moon"
          />
        )}

      </main>

      {/* 10-Role Demo Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        currentUser={currentUser}
        onClose={() => setIsRoleSwitcherOpen(false)}
        onSelectRole={handleSelectRole}
        onSelectUser={handleSelectRole}
      />

      {/* Auth Modal for Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(profile) => {
          setCurrentUser(profile);
        }}
      />

      {/* Student Full Detail & Portfolio Modal */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          records={records}
          currentUser={currentUser}
          onClose={() => setSelectedStudentForDetail(null)}
          onEdit={(st) => {
            setSelectedStudentForDetail(null);
            setStudentToEdit(st);
            setIsAddEditModalOpen(true);
          }}
          onMarkAttendance={handleMarkAttendance}
          onUpdateStudentPortfolio={handleUpdateStudentPortfolio}
          onUpdateStudentAvatar={handleUpdateStudentAvatar}
        />
      )}

      {/* Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={isAddEditModalOpen}
        studentToEdit={studentToEdit}
        defaultClass="Grade 6"
        defaultSection="Moon"
        availableClasses={['Grade 6', 'Grade 7']}
        availableSections={['Moon', 'Star', 'Sun', 'Earth']}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
      />

      {/* Excel Spreadsheet Import Modal (Admin only) */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        existingStudents={students}
        onClose={() => setIsExcelModalOpen(false)}
        onImportStudents={handleImportStudentsFromExcel}
      />

    </div>
  );
}

export default App;
