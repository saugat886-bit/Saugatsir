// SUNGABHA CONNECT — Domain Types & Interfaces
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)
// Sainamaina-03, Rupandehi, Nepal | ISO 9001:2015 Certified

export type UserRole =
  | 'SUPER_ADMIN'
  | 'PRINCIPAL'
  | 'VICE_PRINCIPAL'
  | 'ACADEMIC_COORDINATOR'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'HOSTEL_WARDEN'
  | 'TRANSPORT_STAFF'
  | 'ECA_COORDINATOR'
  | 'STUDENT'
  | 'PARENT';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  rate: number;
}

export type HouseType = 'Gaurishankar' | 'Machhapuchhre' | 'Kanchanjunga';

export type ExamType =
  | 'Monthly Test'
  | 'First Terminal'
  | 'Second Terminal'
  | 'Third Terminal'
  | 'Pre-SEE'
  | 'Final Examination';

export type NoticeCategory =
  | 'IMPORTANT'
  | 'ACADEMIC'
  | 'EVENT'
  | 'HOLIDAY'
  | 'EMERGENCY'
  | 'GENERAL';

export type FeeCategory =
  | 'Tuition'
  | 'Admission'
  | 'Hostel'
  | 'Transport'
  | 'Examination'
  | 'ECA'
  | 'Other';

export interface SchoolConfig {
  nameEn: string;
  nameNp: string;
  slogan: string;
  location: string;
  certification: string;
  phone: string;
  email: string;
  facilities: string[];
  branding: {
    primaryColor: string; // Royal Blue
    secondaryColor: string; // Crimson Red
    accentColor: string;
  };
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  assignedClasses?: string[]; // e.g. ["Grade 6-Moon", "Grade 7-Sun"]
  assignedSubjects?: string[]; // e.g. ["Science", "Mathematics"]
  associatedStudentIds?: string[]; // For parents & students
  employeeId?: string;
  qualification?: string;
  department?: string;
}

export interface ClassSection {
  id: string;
  className: string; // e.g. "Grade 6", "Grade 7"
  section: string; // e.g. "Moon", "Star", "Sun", "Earth"
  classTeacherName?: string;
  roomNumber?: string;
  capacity?: number;
}

export interface Address {
  street: string;
  ward?: string;
  city: string;
  district?: string;
  state?: string;
  zipCode?: string;
}


export interface ParentDetails {
  fatherName: string;
  motherName: string;
  guardianName?: string;
  relationship?: string;
  primaryContactName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  occupation?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface StudentPortfolioItem {
  id: string;
  title: string;
  category: 'achievement' | 'behavior' | 'academic' | 'artwork' | 'certificate' | 'meeting' | 'general';
  description: string;
  date: string;
  addedBy: string;
  imageUrl?: string;
  attachmentName?: string;
}

export interface Student {
  id: string;
  admissionNumber: string; // e.g. "S-7012"
  rollNumber: string;
  fullName: string;
  className: string; // "Grade 6", "Grade 7", etc.
  section: string; // "Moon", "Star", "Sun", "Earth"
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  dobAd?: string; // YYYY-MM-DD
  dobBs?: string; // e.g. "2069-05-14"
  academicYear?: string;
  fatherName?: string;
  motherName?: string;
  caste?: string;
  bloodGroup?: string;
  phone: string;
  email?: string;
  address: Address;
  parents: ParentDetails;
  house?: HouseType;
  isHostel?: boolean;
  hostelRoom?: string;
  isTransport?: boolean;
  busRoute?: string;
  avatarUrl?: string;
  notes?: string;
  portfolio?: StudentPortfolioItem[];
  admissionDate?: string;
  isActive?: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remark?: string;
  className: string;
  section: string;
  markedBy: string;
  updatedAt: string;
  isOverridden?: boolean;
}

export interface TimetablePeriod {
  id: string;
  className: string;
  section: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periodNumber: number;
  timeSlot: string; // e.g. "10:00 AM - 10:45 AM"
  subject: string;
  teacherName: string;
  room: string;
}

export interface HomeworkSubmission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  submissionText?: string;
  attachmentName?: string;
  status: 'SUBMITTED' | 'REVIEWED' | 'LATE';
  marksObtained?: number;
  maxMarks?: number;
  feedback?: string;
}

export interface Homework {
  id: string;
  className: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentUrl?: string;
  submissions: HomeworkSubmission[];
}

export interface SubjectMark {
  subjectName: string;
  fullMarks: number;
  passMarks: number;
  theoryMarks: number;
  practicalMarks?: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
  remarks?: string;
}

export interface ExamRecord {
  id: string;
  examName: ExamType;
  academicYear: string; // e.g. "2082/2083"
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  rollNumber: string;
  marks: SubjectMark[];
  totalFullMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  gpa: number;
  overallGrade: string;
  rank?: number;
  attendanceDays: number;
  totalSchoolDays: number;
  teacherRemarks: string;
  principalRemarks: string;
  resultDate: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  isEmergency: boolean;
  publishedBy: string;
  publisherRole: string;
  publishedDate: string;
  targetRole?: UserRole | 'ALL';
  targetClass?: string;
  targetSection?: string;
  targetAudience?: string;
  attachmentUrl?: string;
}


export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  feeType: FeeCategory;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE';
  lastPaymentDate?: string;
  receiptNumber?: string;
}

export interface HostelStudent {
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  roomNumber: string;
  bedNumber: string;
  morningAttendance: AttendanceStatus;
  eveningAttendance: AttendanceStatus;
  leaveStatus: 'None' | 'Requested' | 'Approved';
  emergencyContact: string;
  parentPhone: string;
  notes?: string;
}

export interface HouseStats {
  house: HouseType;
  color: string;
  motto: string;
  totalPoints: number;
  captainName: string;
  rank: number;
  recentActivities: {
    event: string;
    points: number;
    date: string;
  }[];
}

export interface ECAWinner {
  position: 1 | 2 | 3;
  studentId?: string;
  studentName: string;
  house?: string;
  points?: number;
}

export interface ECAEvent {
  id: string;
  title: string;
  category: 'Sports' | 'Music' | 'Yoga & Meditation' | 'Gym' | 'Science Exhibition' | 'Quiz' | 'Programming' | 'Rangoli' | 'Debate' | 'Dance' | 'Scout' | 'Other' | string;
  date: string;
  description: string;
  venue?: string;
  location?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  participants?: string[];
  winnerStudentNames?: string[];
  winnerHouse?: HouseType;
  winners?: ECAWinner[];
}

export interface BusRoute {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  stops: string[];
  assignedStudentsCount: number;
  liveStatus: 'Stationary at School' | 'On Route' | 'Completed';
}

export type ViewTab =
  | 'dashboard'
  | 'attendance'
  | 'students'
  | 'classes'
  | 'teachers'
  | 'timetable'
  | 'homework'
  | 'exams'
  | 'report_cards'
  | 'academic_coordinator'
  | 'parent_portal'
  | 'student_backpack'
  | 'hostel'
  | 'houses'
  | 'eca'
  | 'notices'
  | 'fees'
  | 'transport'
  | 'ai_assistant'
  | 'audit_logs';
