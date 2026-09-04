// SUNGABHA CONNECT — Initial Seed Data & Master Directory
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)
// Sainamaina-03, Rupandehi, Nepal | ISO 9001:2015 Certified

import {
  SchoolConfig,
  UserProfile,
  ClassSection,
  Student,
  AttendanceRecord,
  Homework,
  ExamRecord,
  Notice,
  FeeRecord,
  HostelStudent,
  HouseStats,
  ECAEvent,
  BusRoute,
  TimetablePeriod
} from '../types';

export const SCHOOL_INFO: SchoolConfig = {
  nameEn: 'Sungabha Public Secondary School',
  nameNp: 'सुनगाभा पब्लिक सेकेन्डरी स्कुल',
  slogan: 'Sungabha — The Land of Opportunities',
  location: 'Sainamaina-03, Rupandehi, Nepal',
  certification: 'ISO 9001:2015 Certified',
  phone: '9857032269',
  email: 'Sungabhapublicsecondaryschool@gmail.com',
  facilities: [
    'Projector-based classrooms',
    'ECA Hall',
    'School buses',
    'Music classes',
    'Yoga & Meditation',
    'Gym activities',
    'Sports Week',
    'Science Exhibition',
    'Quiz competitions',
    'Programming competitions',
    'Hostel facilities'
  ],
  branding: {
    primaryColor: '#1e40af', // Royal Blue
    secondaryColor: '#dc2626', // Crimson Red
    accentColor: '#0284c7'
  }
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    fullName: 'Saugat Sir (Super Admin)',
    phone: '9857032269',
    email: 'admin@sungabha.edu.np',
    role: 'SUPER_ADMIN',
    department: 'Executive Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-principal',
    fullName: 'Rameshwar Adhikari (Principal)',
    phone: '9847011223',
    email: 'principal@sungabha.edu.np',
    role: 'PRINCIPAL',
    qualification: 'M.Ed, M.Phil',
    department: 'School Leadership',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-coord',
    fullName: 'Sarita Sharma (Academic Coordinator)',
    phone: '9847199882',
    email: 'coordinator@sungabha.edu.np',
    role: 'ACADEMIC_COORDINATOR',
    qualification: 'M.Sc. Physics, B.Ed.',
    department: 'Academic Supervision',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-teacher-1',
    fullName: 'Bikash Thapa (Grade 6 Teacher)',
    phone: '9867055441',
    email: 'bikash.thapa@sungabha.edu.np',
    role: 'TEACHER',
    assignedClasses: ['Grade 6-Moon', 'Grade 6-Star'],
    assignedSubjects: ['Science', 'Computer Science'],
    qualification: 'B.Sc. CSIT, B.Ed.',
    employeeId: 'EMP-0104',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-teacher-2',
    fullName: 'Pooja Karki (Grade 7 Teacher)',
    phone: '9867099881',
    email: 'pooja.karki@sungabha.edu.np',
    role: 'TEACHER',
    assignedClasses: ['Grade 7-Sun', 'Grade 7-Moon'],
    assignedSubjects: ['Mathematics', 'Social Studies'],
    qualification: 'M.A. Mathematics',
    employeeId: 'EMP-0108',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-parent',
    fullName: 'Laxmi Pandey (Parent)',
    phone: '9847166942',
    email: 'laxmi.pandey@gmail.com',
    role: 'PARENT',
    associatedStudentIds: ['std-6-moon-1', 'std-7-sun-3'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-student',
    fullName: 'Abishek Pandey (Student - Grade 6 Moon)',
    phone: '9847166942',
    email: 'abishek.p@student.sungabha.edu.np',
    role: 'STUDENT',
    associatedStudentIds: ['std-6-moon-1'],
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-warden',
    fullName: 'Hari Prasad Neupane (Hostel Warden)',
    phone: '9847055667',
    email: 'warden@sungabha.edu.np',
    role: 'HOSTEL_WARDEN',
    department: 'Hostel Management',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-accountant',
    fullName: 'Sita Gautam (Accountant)',
    phone: '9847888999',
    email: 'accounts@sungabha.edu.np',
    role: 'ACCOUNTANT',
    department: 'Finance & Accounts',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-transport',
    fullName: 'Man Bahadur Gurung (Bus In-Charge)',
    phone: '9806955443',
    email: 'transport@sungabha.edu.np',
    role: 'TRANSPORT_STAFF',
    department: 'School Transportation',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_USERS: UserProfile[] = DEMO_USERS;


export const INITIAL_CLASSES: ClassSection[] = [
  { id: 'cs-6-moon', className: 'Grade 6', section: 'Moon', classTeacherName: 'Bikash Thapa', roomNumber: 'Room 201', capacity: 40 },
  { id: 'cs-6-star', className: 'Grade 6', section: 'Star', classTeacherName: 'Sunita Gautam', roomNumber: 'Room 202', capacity: 40 },
  { id: 'cs-6-sun', className: 'Grade 6', section: 'Sun', classTeacherName: 'Deepak Bhandari', roomNumber: 'Room 203', capacity: 40 },
  { id: 'cs-6-earth', className: 'Grade 6', section: 'Earth', classTeacherName: 'Pooja Aryal', roomNumber: 'Room 204', capacity: 40 },

  { id: 'cs-7-moon', className: 'Grade 7', section: 'Moon', classTeacherName: 'Rajendra Joshi', roomNumber: 'Room 301', capacity: 40 },
  { id: 'cs-7-sun', className: 'Grade 7', section: 'Sun', classTeacherName: 'Pooja Karki', roomNumber: 'Room 302', capacity: 40 },
  { id: 'cs-7-star', className: 'Grade 7', section: 'Star', classTeacherName: 'Kishor Shrestha', roomNumber: 'Room 303', capacity: 40 },
  { id: 'cs-7-earth', className: 'Grade 7', section: 'Earth', classTeacherName: 'Bimala Rijal', roomNumber: 'Room 304', capacity: 40 }
];

// Helper to generate seed students matching school specification
function generateSeedStudents(): Student[] {
  const students: Student[] = [];

  const firstNamesM = ['Abishek', 'Aarav', 'Rohan', 'Sandesh', 'Prasiddha', 'Samundra', 'Bibek', 'Aayush', 'Nabin', 'Sujan', 'Kiran', 'Manish', 'Suman', 'Bipin', 'Roshan', 'Prakash', 'Sabin', 'Dipen'];
  const firstNamesF = ['Anjali', 'Bipana', 'Dikshya', 'Kritika', 'Pooja', 'Shraddha', 'Prashna', 'Nisha', 'Sneha', 'Salina', 'Prakriti', 'Ritika', 'Aayusha', 'Sujata', 'Simran', 'Alina', 'Barsha'];
  const lastNames = ['Pandey', 'Karki', 'Sharma', 'Gautam', 'Thapa', 'Adhikari', 'Bhandari', 'Neupane', 'Bhattarai', 'Rijal', 'Shrestha', 'Gurung', 'Magar', 'Aryal', 'Chaudhary', 'Poudel'];
  const houses: ('Gaurishankar' | 'Machhapuchhre' | 'Kanchanjunga')[] = ['Gaurishankar', 'Machhapuchhre', 'Kanchanjunga'];
  const wards = ['Sainamaina-03', 'Sainamaina-02', 'Sainamaina-04 (Saljhandi)', 'Sainamaina-01 (Parroha)', 'Sainamaina-05 (Dudharaksh)'];

  const specs = [
    { grade: 'Grade 6', section: 'Moon', count: 34 },
    { grade: 'Grade 6', section: 'Star', count: 36 },
    { grade: 'Grade 6', section: 'Sun', count: 35 },
    { grade: 'Grade 6', section: 'Earth', count: 30 },
    { grade: 'Grade 7', section: 'Moon', count: 29 },
    { grade: 'Grade 7', section: 'Sun', count: 30 },
    { grade: 'Grade 7', section: 'Star', count: 28 },
    { grade: 'Grade 7', section: 'Earth', count: 25 }
  ];

  let totalIndex = 1;
  let hostelCount = 0;

  specs.forEach(spec => {
    const sectionStudents: Student[] = [];

    for (let r = 1; r <= spec.count; r++) {
      const isFemale = (totalIndex + r) % 2 === 0;
      const fnList = isFemale ? firstNamesF : firstNamesM;
      const fn = fnList[(r + totalIndex) % fnList.length];
      const ln = lastNames[(r * 3 + totalIndex) % lastNames.length];
      const fullName = `${fn} ${ln}`;
      const admNum = `S-${7000 + totalIndex}`;
      
      const isHostel = hostelCount < 20 && (totalIndex % 12 === 0);
      if (isHostel) hostelCount++;

      const isTransport = !isHostel && (totalIndex % 3 !== 0);
      const house = houses[(r + totalIndex) % 3];
      const ward = wards[(r + totalIndex) % wards.length];

      sectionStudents.push({
        id: `temp-${totalIndex}`,
        admissionNumber: admNum,
        rollNumber: '0',
        fullName,
        className: spec.grade,
        section: spec.section,
        gender: isFemale ? 'Female' : 'Male',
        dobAd: `2012-0${(r % 9) + 1}-15`,
        dobBs: `2069-0${(r % 9) + 1}-28`,
        phone: `9847${String(100000 + totalIndex).slice(0, 6)}`,
        address: {
          street: `${fn} Tole`,
          ward: ward,
          city: 'Sainamaina',
          district: 'Rupandehi'
        },
        parents: {
          fatherName: `Ram Bahadur ${ln}`,
          motherName: `Laxmi Maya ${ln}`,
          primaryContactName: `Ram Bahadur ${ln} (Father)`,
          phone: `9847${String(100000 + totalIndex).slice(0, 6)}`,
          emergencyContactName: `Laxmi Maya ${ln} (Mother)`,
          emergencyContactPhone: `9806${String(200000 + totalIndex).slice(0, 6)}`,
          occupation: r % 2 === 0 ? 'Teacher / Civil Servant' : 'Agriculture & Business'
        },
        house,
        isHostel,
        hostelRoom: isHostel ? `Room ${101 + (hostelCount % 5)}` : undefined,
        isTransport,
        busRoute: isTransport ? (totalIndex % 2 === 0 ? 'Route 1 (Saljhandi - School)' : 'Route 2 (Parroha - Murgiya)') : undefined,
        bloodGroup: ['A+','B+','O+','AB+'][r % 4],
        caste: ['Brahmin/Chhetri', 'Janajati', 'Dalit', 'Madhesi'][r % 4],
        admissionDate: '2081-01-15',
        isActive: true,
        portfolio: r === 1 ? [
          {
            id: 'port-1',
            title: 'District Science Exhibition - 1st Position',
            category: 'achievement',
            description: 'Presented an automated solar irrigation model in inter-school science fair.',
            date: '2082-03-12',
            addedBy: 'Bikash Thapa (Science Teacher)'
          }
        ] : []
      });

      totalIndex++;
    }

    // Sort students alphabetically by full name (A to Z)
    sectionStudents.sort((a, b) => a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' }));

    // Assign sequential roll numbers (1, 2, 3...) strictly in alphabetical order
    sectionStudents.forEach((student, idx) => {
      const roll = String(idx + 1);
      student.rollNumber = roll;
      student.id = `std-${spec.grade.replace(' ', '').toLowerCase()}-${spec.section.toLowerCase()}-${roll}`;
      students.push(student);
    });
  });

  return students;
}

export const INITIAL_STUDENTS: Student[] = generateSeedStudents();

// Generate dynamic attendance records for the past 14 days
export function generateInitialAttendance(studentsList: Student[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let d = 0; d < 10; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - d);
    // Skip Saturdays (Nepal weekend is Saturday)
    if (targetDate.getDay() === 6) continue;

    const dateStr = targetDate.toISOString().split('T')[0];

    studentsList.forEach((st, idx) => {
      // 94% present rate for realistic analytics
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      const hash = (idx * 17 + d * 31) % 100;
      if (hash < 3) status = 'absent';
      else if (hash < 6) status = 'late';
      else if (hash === 7) status = 'excused';

      records.push({
        id: `att-${st.id}-${dateStr}`,
        studentId: st.id,
        className: st.className,
        section: st.section,
        date: dateStr,
        status,
        markedBy: 'Bikash Thapa',
        updatedAt: new Date().toISOString()
      });
    });
  }

  return records;
}

export const INITIAL_ATTENDANCE: AttendanceRecord[] = generateInitialAttendance(INITIAL_STUDENTS);

export const INITIAL_TIMETABLE: TimetablePeriod[] = [
  { id: 'tt-1', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 1, timeSlot: '10:00 AM - 10:45 AM', subject: 'Compulsory Science', teacherName: 'Bikash Thapa', room: 'Room 201' },
  { id: 'tt-2', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 2, timeSlot: '10:45 AM - 11:30 AM', subject: 'Mathematics', teacherName: 'Pooja Karki', room: 'Room 201' },
  { id: 'tt-3', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 3, timeSlot: '11:30 AM - 12:15 PM', subject: 'English', teacherName: 'Sunita Gautam', room: 'Room 201' },
  { id: 'tt-4', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 4, timeSlot: '12:45 PM - 01:30 PM', subject: 'Social Studies', teacherName: 'Rajendra Joshi', room: 'Room 201' },
  { id: 'tt-5', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 5, timeSlot: '01:30 PM - 02:15 PM', subject: 'Nepali', teacherName: 'Pooja Aryal', room: 'Room 201' },
  { id: 'tt-6', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 6, timeSlot: '02:15 PM - 03:00 PM', subject: 'Computer Science (Lab)', teacherName: 'Bikash Thapa', room: 'Computer Lab' },
  { id: 'tt-7', className: 'Grade 6', section: 'Moon', dayOfWeek: 'Sunday', periodNumber: 7, timeSlot: '03:00 PM - 03:45 PM', subject: 'Yoga & Meditation / ECA', teacherName: 'Deepak Bhandari', room: 'ECA Hall' },

  { id: 'tt-8', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 1, timeSlot: '10:00 AM - 10:45 AM', subject: 'Mathematics', teacherName: 'Pooja Karki', room: 'Room 302' },
  { id: 'tt-9', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 2, timeSlot: '10:45 AM - 11:30 AM', subject: 'Compulsory Science', teacherName: 'Sarita Sharma', room: 'Room 302' },
  { id: 'tt-10', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 3, timeSlot: '11:30 AM - 12:15 PM', subject: 'Nepali', teacherName: 'Bimala Rijal', room: 'Room 302' },
  { id: 'tt-11', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 4, timeSlot: '12:45 PM - 01:30 PM', subject: 'English', teacherName: 'Sunita Gautam', room: 'Room 302' },
  { id: 'tt-12', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 5, timeSlot: '01:30 PM - 02:15 PM', subject: 'Computer Science', teacherName: 'Bikash Thapa', room: 'Computer Lab' },
  { id: 'tt-13', className: 'Grade 7', section: 'Sun', dayOfWeek: 'Sunday', periodNumber: 6, timeSlot: '02:15 PM - 03:00 PM', subject: 'Social Studies & Life Skills', teacherName: 'Rajendra Joshi', room: 'Room 302' }
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw-1',
    className: 'Grade 6',
    section: 'Moon',
    subject: 'Compulsory Science',
    teacherId: 'usr-teacher-1',
    teacherName: 'Bikash Thapa',
    title: 'Force, Motion & Simple Machines Investigation',
    description: 'Complete questions 1 to 8 on Chapter 4. Draw neat diagrams of first, second, and third class levers in your practical notebook.',
    assignedDate: '2082-04-12',
    dueDate: '2082-04-15',
    submissions: [
      {
        studentId: 'std-6-moon-1',
        studentName: 'Abishek Pandey',
        submittedAt: '2082-04-14 18:30',
        submissionText: 'Completed lever calculations with mechanical advantage formulas and diagram annotations.',
        status: 'REVIEWED',
        marksObtained: 10,
        maxMarks: 10,
        feedback: 'Excellent work and neat presentation!'
      }
    ]
  },
  {
    id: 'hw-2',
    className: 'Grade 7',
    section: 'Sun',
    subject: 'Mathematics',
    teacherId: 'usr-teacher-2',
    teacherName: 'Pooja Karki',
    title: 'Algebraic Expressions & Factorization Exercise 5.2',
    description: 'Solve Exercise 5.2 (Questions 3 to 14). Show step-by-step factorization using common grouping and identity formulas.',
    assignedDate: '2082-04-14',
    dueDate: '2082-04-17',
    submissions: []
  },
  {
    id: 'hw-3',
    className: 'Grade 6',
    section: 'Moon',
    subject: 'Social Studies',
    teacherId: 'usr-teacher-1',
    teacherName: 'Rajendra Joshi',
    title: 'Natural Resources and Heritage of Lumbini Province',
    description: 'Write a 2-page essay on preserving UNESCO World Heritage sites in Lumbini & Sainamaina ancient monuments.',
    assignedDate: '2082-04-13',
    dueDate: '2082-04-16',
    submissions: []
  }
];

export const INITIAL_EXAMS: ExamRecord[] = [
  {
    id: 'exam-rec-1',
    examName: 'First Terminal',
    academicYear: '2082/2083',
    studentId: 'std-6-moon-1',
    studentName: 'Abishek Pandey',
    className: 'Grade 6',
    section: 'Moon',
    rollNumber: '1',
    marks: [
      { subjectName: 'Compulsory Science', fullMarks: 100, passMarks: 40, theoryMarks: 72, practicalMarks: 24, totalMarks: 96, grade: 'A+', gradePoint: 4.0, remarks: 'Outstanding' },
      { subjectName: 'Mathematics', fullMarks: 100, passMarks: 40, theoryMarks: 94, practicalMarks: 0, totalMarks: 94, grade: 'A+', gradePoint: 4.0, remarks: 'Excellent calculation' },
      { subjectName: 'English', fullMarks: 100, passMarks: 40, theoryMarks: 65, practicalMarks: 22, totalMarks: 87, grade: 'A', gradePoint: 3.6, remarks: 'Fluent comprehension' },
      { subjectName: 'Nepali', fullMarks: 100, passMarks: 40, theoryMarks: 60, practicalMarks: 23, totalMarks: 83, grade: 'A', gradePoint: 3.6, remarks: 'Good grammar' },
      { subjectName: 'Social Studies', fullMarks: 100, passMarks: 40, theoryMarks: 68, practicalMarks: 21, totalMarks: 89, grade: 'A', gradePoint: 3.6, remarks: 'Very thorough' },
      { subjectName: 'Computer Science', fullMarks: 100, passMarks: 40, theoryMarks: 48, practicalMarks: 49, totalMarks: 97, grade: 'A+', gradePoint: 4.0, remarks: 'Top lab performance' }
    ],
    totalFullMarks: 600,
    totalObtainedMarks: 546,
    percentage: 91.0,
    gpa: 3.80,
    overallGrade: 'A+',
    rank: 1,
    attendanceDays: 62,
    totalSchoolDays: 65,
    teacherRemarks: 'Abishek is an exemplary student with high dedication, strong discipline, and active class participation.',
    principalRemarks: 'Promising academic excellence. Keep up the high standard!',
    resultDate: '2082-04-05'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: '🚨 Urgent: Heavy Rainfall Warning & Weather Protocol',
    content: 'Due to severe weather warnings in Rupandehi District, afternoon sports activities are postponed. School buses will depart 20 minutes earlier at 3:40 PM for student safety.',
    category: 'EMERGENCY',
    isEmergency: true,
    publishedBy: 'Rameshwar Adhikari (Principal)',
    publisherRole: 'PRINCIPAL',
    publishedDate: '2082-04-18',
    targetRole: 'ALL'
  },
  {
    id: 'not-2',
    title: '🏆 Annual Sports Week 2082 Schedule & House Registrations',
    content: 'Annual Sports Week will commence from 2082-05-10. House Captains of Gaurishankar, Machhapuchhre, and Kanchanjunga must submit participants list for Athletics, Football, Volleyball, and Chess by Friday.',
    category: 'EVENT',
    isEmergency: false,
    publishedBy: 'ECA Committee',
    publisherRole: 'SUPER_ADMIN',
    publishedDate: '2082-04-16',
    targetRole: 'ALL'
  },
  {
    id: 'not-3',
    title: '📝 Grade 6 & 7 Monthly Test Examination Routine',
    content: 'The Monthly Progress Test begins on Sunday (2082-04-25). All students must clear library returns and review syllabus units 1 to 4.',
    category: 'ACADEMIC',
    isEmergency: false,
    publishedBy: 'Sarita Sharma (Academic Coordinator)',
    publisherRole: 'ACADEMIC_COORDINATOR',
    publishedDate: '2082-04-15',
    targetRole: 'ALL'
  }
];

export const INITIAL_HOUSES: HouseStats[] = [
  {
    house: 'Gaurishankar',
    color: '#dc2626', // Red
    motto: 'Strength, Honor & Perseverance',
    totalPoints: 480,
    captainName: 'Aarav Sharma (Grade 10)',
    rank: 1,
    recentActivities: [
      { event: 'Inter-House Science Exhibition', points: 150, date: '2082-03-15' },
      { event: 'Morning Assembly Discipline Praise', points: 50, date: '2082-04-10' }
    ]
  },
  {
    house: 'Machhapuchhre',
    color: '#0284c7', // Blue
    motto: 'Wisdom, Integrity & Excellence',
    totalPoints: 445,
    captainName: 'Dikshya Karki (Grade 10)',
    rank: 2,
    recentActivities: [
      { event: 'Inter-House English Debate Championship', points: 120, date: '2082-04-02' },
      { event: 'Rangoli Art Festival', points: 80, date: '2082-03-25' }
    ]
  },
  {
    house: 'Kanchanjunga',
    color: '#16a34a', // Green
    motto: 'Unity, Courage & Victory',
    totalPoints: 410,
    captainName: 'Prasiddha Thapa (Grade 10)',
    rank: 3,
    recentActivities: [
      { event: 'Inter-House Quiz Competition', points: 100, date: '2082-04-08' },
      { event: 'Volleyball Friendly Match', points: 60, date: '2082-03-20' }
    ]
  }
];

export const INITIAL_ECA_EVENTS: ECAEvent[] = [
  {
    id: 'eca-1',
    title: 'Inter-School Science Exhibition 2082',
    category: 'Science Exhibition',
    date: '2082-03-15',
    description: 'Students demonstrated robotics, eco-friendly models, and solar innovations in the main ECA Hall.',
    venue: 'Sungabha Multi-Purpose Hall',
    location: 'Sungabha Multi-Purpose Hall',
    status: 'COMPLETED',
    winnerHouse: 'Gaurishankar',
    winnerStudentNames: ['Abishek Pandey', 'Aarav Sharma'],
    winners: [
      { position: 1, studentId: 'st-001', studentName: 'Abishek Pandey', house: 'Gaurishankar', points: 50 },
      { position: 2, studentId: 'st-002', studentName: 'Aarav Sharma', house: 'Sagarmatha', points: 30 }
    ]
  },
  {
    id: 'eca-2',
    title: 'Inter-House Quiz Competition & General Knowledge',
    category: 'Quiz',
    date: '2082-04-08',
    description: '7-round rapid fire quiz covering Nepali History, Science, Mathematics and International Affairs.',
    venue: 'ECA Hall',
    location: 'ECA Hall',
    status: 'COMPLETED',
    winnerHouse: 'Kanchanjunga',
    winnerStudentNames: ['Prasiddha Thapa', 'Dikshya Karki'],
    winners: [
      { position: 1, studentId: 'st-003', studentName: 'Prasiddha Thapa', house: 'Kanchanjunga', points: 50 },
      { position: 2, studentId: 'st-004', studentName: 'Dikshya Karki', house: 'Machhapuchhre', points: 30 }
    ]
  },
  {
    id: 'eca-3',
    title: 'Weekly Yoga & Meditation Mindful Morning',
    category: 'Yoga & Meditation',
    date: '2082-04-14',
    description: 'Whole school guided pranayama, Surya Namaskar and mental wellness routine led by certified instructor.',
    venue: 'School Ground & Hall',
    location: 'School Ground & Hall',
    status: 'UPCOMING',
    winners: []
  }
];

export const INITIAL_BUS_ROUTES: BusRoute[] = [
  {
    id: 'bus-1',
    busNumber: 'Lu 1 Kha 4521 (Bus #1)',
    driverName: 'Man Bahadur Gurung',
    driverPhone: '9806955443',
    routeName: 'Saljhandi - Ranibagiya - Sungabha',
    stops: ['Saljhandi Chowk', 'Ranibagiya', 'Basauli', 'Sainamaina Campus', 'School Gate'],
    assignedStudentsCount: 38,
    liveStatus: 'Stationary at School'
  },
  {
    id: 'bus-2',
    busNumber: 'Lu 2 Kha 6712 (Bus #2)',
    driverName: 'Dipak Thapa Magar',
    driverPhone: '9812345678',
    routeName: 'Murgiya - Parroha - Dudharaksh - Sungabha',
    stops: ['Murgiya Bazaar', 'Parroha Temple', 'Dudharaksh Chowk', 'Hatbazar', 'School Gate'],
    assignedStudentsCount: 42,
    liveStatus: 'Stationary at School'
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-1',
    studentId: 'std-6-moon-1',
    studentName: 'Abishek Pandey',
    className: 'Grade 6',
    section: 'Moon',
    feeType: 'Tuition',
    amount: 3200,
    paidAmount: 3200,
    dueAmount: 0,
    dueDate: '2082-04-10',
    status: 'PAID',
    lastPaymentDate: '2082-04-08',
    receiptNumber: 'REC-2082-094'
  },
  {
    id: 'fee-2',
    studentId: 'std-6-moon-1',
    studentName: 'Abishek Pandey',
    className: 'Grade 6',
    section: 'Moon',
    feeType: 'Examination',
    amount: 800,
    paidAmount: 800,
    dueAmount: 0,
    dueDate: '2082-04-20',
    status: 'PAID',
    lastPaymentDate: '2082-04-08',
    receiptNumber: 'REC-2082-095'
  }
];
