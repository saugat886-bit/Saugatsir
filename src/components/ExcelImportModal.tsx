import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  FileCheck, 
  Trash2, 
  Table,
  Phone,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingStudents: Student[];
  onImportStudents: (newStudents: Student[], duplicateStrategy: 'update' | 'skip' | 'append') => void;
}

interface ParsedStudentRow {
  isValid: boolean;
  hasWarning: boolean;
  isDuplicate: boolean;
  duplicateMatchedBy?: string;
  errors: string[];
  warnings: string[];
  studentData: Student;
  rawRow: Record<string, any>;
  secondaryPhone?: string;
}

// Exactly matches the user's school spreadsheet format
const SCHOOL_TEMPLATE_HEADERS = [
  'S. No.',
  'Id',
  'Ad. Date',
  'R. No',
  'Student Name',
  'Gender',
  'Caste',
  "Father's Name",
  "Mother's Name",
  'Address',
  'Phone No.',
  'D. O. Birth'
];

const SCHOOL_SAMPLE_ROWS = [
  [
    '1',
    '79130',
    '2079-02-06',
    '1',
    'ABISHEK NEUPANE',
    'Male',
    'Other',
    'Ashok Neupane',
    'Laxmi Pandey',
    'Sainamaina-3',
    '9847166942',
    '2066-06-13'
  ],
  [
    '2',
    '71006',
    '2071-01-04',
    '2',
    'ADITI KARKI',
    'Female',
    'Other',
    'Depandra Karki',
    'Kamala K.c Poudel',
    'Sainamaina-4',
    '9804075545',
    '2068-02-24'
  ],
  [
    '3',
    '74134',
    '2074-01-14',
    '3',
    'ANJAL G.C',
    'Male',
    'Other',
    'Khagendra G.c',
    'Bal Kumari Gaire',
    'Sainamaina-2',
    '9847151105',
    '2066-08-04'
  ],
  [
    '4',
    '72069',
    '2072-01-09',
    '4',
    'ANJAL GYAWALI',
    'Male',
    'Brahmin/Chhetri',
    'Bishnu Prasad Gyawali',
    'Uma Devi Neupane',
    'Sainamaina-3',
    '9807043211',
    '2067-04-06'
  ],
  [
    '5',
    '69356',
    '2070-01-02',
    '5',
    'ANKUSH THAPA',
    'Male',
    'Janajati',
    'Ankit Thapa',
    'Kamala Karki',
    'Sainamaina-2',
    '9847197448',
    '2065-12-14'
  ],
  [
    '6',
    '70047',
    '2070-01-09',
    '6',
    'ANUSHKA AGRAHARI',
    'Female',
    'Madhesi',
    'Manoj Agrahari',
    'Puspa G.c',
    'Sainamaina-4',
    '9860000288',
    '2066-08-10'
  ],
  [
    '7',
    '81125',
    '2081-01-10',
    '7',
    'ASMIN SHARMA',
    'Male',
    'Other',
    'Nabin Sharma',
    'Kabita Gyawali',
    'Sainamaina-5',
    '9846930214',
    '2066-10-18'
  ],
  [
    '8',
    '81021',
    '2081-01-05',
    '8',
    'BANDANA BHATTARAI',
    'Female',
    'Other',
    'Ganesh Bhattarai',
    'Maya Thapa',
    'Sainamaina-10',
    '9867248760',
    '2067-08-05'
  ]
];

/**
 * Intelligent phone number parser and cleaner
 * Handles scientific notation (9.84717E+09), decimals (9847166942.0),
 * slash-separated numbers (9847197448/9847151105), country codes (+977-), etc.
 */
export function extractPhoneNumbers(val: any): { primary: string; secondary?: string; all: string[] } {
  if (val === null || val === undefined) return { primary: '', all: [] };
  let text = String(val).trim();
  if (!text) return { primary: '', all: [] };

  // Handle scientific notation e.g., 9.847166942e+09 or 9.84717E+09
  if (/^[0-9]+(\.[0-9]+)?e\+[0-9]+$/i.test(text)) {
    try {
      const num = Number(text);
      if (!isNaN(num) && Number.isFinite(num)) {
        text = BigInt(Math.round(num)).toString();
      }
    } catch {
      // fallback
    }
  }

  // Remove trailing .0 from float conversion
  if (/^\d+\.0+$/.test(text)) {
    text = text.split('.')[0];
  }

  // Split by slash, comma, semicolon, newline, pipe or backslash
  const rawParts = text.split(/[/,;\n|\\]+/).map(p => p.trim()).filter(Boolean);
  const foundPhones: string[] = [];

  for (const part of rawParts) {
    const digitsOnly = part.replace(/[^0-9]/g, '');
    
    // Check if two 10-digit numbers got concatenated together like 98471669429804075545
    if (digitsOnly.length === 20 && (digitsOnly.startsWith('98') || digitsOnly.startsWith('97') || digitsOnly.startsWith('96'))) {
      foundPhones.push(digitsOnly.slice(0, 10));
      foundPhones.push(digitsOnly.slice(10, 20));
      continue;
    }

    if (digitsOnly.length >= 7) {
      if (digitsOnly.startsWith('977') && digitsOnly.length === 13) {
        foundPhones.push(digitsOnly.slice(3));
      } else {
        foundPhones.push(digitsOnly);
      }
    } else if (digitsOnly.length > 0) {
      foundPhones.push(digitsOnly);
    }
  }

  const primary = foundPhones[0] || text.replace(/[^0-9]/g, '') || '';
  const secondary = foundPhones[1] || undefined;

  return {
    primary,
    secondary,
    all: foundPhones
  };
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  existingStudents,
  onImportStudents
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [duplicateStrategy, setDuplicateStrategy] = useState<'update' | 'skip' | 'append'>('update');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  
  // Target class & section options
  const [defaultClassName, setDefaultClassName] = useState<string>('Class 10');
  const [defaultSection, setDefaultSection] = useState<string>('SUN');
  const [detectedBatchInfo, setDetectedBatchInfo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Clean normalization for column matching
  const normalizeKey = (key: string) => {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const parseExcelAOA = (aoa: any[][]): ParsedStudentRow[] => {
    if (!aoa || aoa.length === 0) return [];

    let headerRowIndex = -1;
    let detectedClass = defaultClassName;
    let detectedSec = defaultSection;
    let detectedYear = '2082';

    // 1. Scan for Header Row and Batch Metadata (e.g. "X-2082 / SUN" or "Class 10 / Sec A")
    for (let r = 0; r < Math.min(aoa.length, 10); r++) {
      const row = aoa[r] || [];
      const rowStr = row.map(c => String(c || '').trim()).join(' ');

      // Check metadata like "X-2082 / SUN"
      const batchMatch = rowStr.match(/(?:([0-9]+|X|IX|XI|XII|VIII|VII|VI))\s*[-/]\s*([0-9]{4})\s*[/|-]?\s*([A-Za-z0-9]+)/i) 
                      || rowStr.match(/(X|IX|XI|XII|[0-9]+)\s*[-_]\s*([0-9]{4})/i);
      
      if (batchMatch) {
        let clsNum = batchMatch[1].toUpperCase();
        if (clsNum === 'X') clsNum = '10';
        else if (clsNum === 'IX') clsNum = '9';
        else if (clsNum === 'XI') clsNum = '11';
        else if (clsNum === 'XII') clsNum = '12';
        else if (clsNum === 'VIII') clsNum = '8';

        detectedClass = `Class ${clsNum}`;
        if (batchMatch[2]) detectedYear = batchMatch[2];
        if (batchMatch[3]) detectedSec = batchMatch[3].toUpperCase();
        setDetectedBatchInfo(`${detectedClass} • Sec ${detectedSec} (Batch ${detectedYear})`);
      }

      // Check if this row looks like header
      const normCells = row.map(c => normalizeKey(String(c || '')));
      const hasStudentName = normCells.some(c => c.includes('studentname') || c.includes('name') || c.includes('fullname'));
      const hasId = normCells.some(c => c === 'id' || c.includes('adno') || c.includes('admno') || c.includes('admission'));
      const hasRoll = normCells.some(c => c === 'rno' || c === 'roll' || c === 'rollno' || c === 'rollnumber');
      const hasFather = normCells.some(c => c.includes('father') || c.includes('parent'));

      if ((hasStudentName && hasRoll) || (hasStudentName && hasId) || (hasFather && hasStudentName) || (hasRoll && hasId)) {
        headerRowIndex = r;
        break;
      }
    }

    if (headerRowIndex === -1) {
      headerRowIndex = 0;
    }

    const rawHeaders = (aoa[headerRowIndex] || []).map(h => String(h || '').trim());
    const dataRows = aoa.slice(headerRowIndex + 1);

    // Auto-detect Phone Column Index if headers are non-standard
    let autoDetectedPhoneColIdx = -1;
    const phoneAliases = [
      'phoneno', 'phone', 'phonenumber', 'phno', 'phnum', 'ph', 'pno',
      'mobileno', 'mobile', 'mobilenumber', 'mob', 'contact', 'contactno',
      'contactnumber', 'cell', 'cellno', 'parentphone', 'parentsphone',
      'fatherphone', 'motherphone', 'studentphone', 'whatsapp', 'tel',
      'telephone', 'telephoneno', 'emergencyphone'
    ];

    // Check if any header matches known phone aliases
    rawHeaders.forEach((h, hIdx) => {
      const norm = normalizeKey(h);
      if (phoneAliases.some(alias => norm.includes(alias))) {
        autoDetectedPhoneColIdx = hIdx;
      }
    });

    // If still not found, scan sample data rows for 10-digit phone patterns
    if (autoDetectedPhoneColIdx === -1 && dataRows.length > 0) {
      const colScore: Record<number, number> = {};
      dataRows.slice(0, 15).forEach(row => {
        row.forEach((cellVal, colIdx) => {
          const clean = extractPhoneNumbers(cellVal);
          if (clean.primary && clean.primary.length >= 8 && /^[0-9]+$/.test(clean.primary)) {
            colScore[colIdx] = (colScore[colIdx] || 0) + 1;
          }
        });
      });

      let highestScore = 0;
      Object.entries(colScore).forEach(([colIdxStr, score]) => {
        if (score > highestScore && score >= 2) {
          highestScore = score;
          autoDetectedPhoneColIdx = Number(colIdxStr);
        }
      });
    }

    const parsedResults: ParsedStudentRow[] = [];

    dataRows.forEach((rowCells, rIdx) => {
      // Skip empty or purely blank lines
      const nonBlank = rowCells.some(c => c !== undefined && c !== null && String(c).trim() !== '');
      if (!nonBlank) return;

      // Construct key-value row
      const rowObj: Record<string, any> = {};
      const normalizedRow: Record<string, any> = {};

      rawHeaders.forEach((h, hIdx) => {
        const val = rowCells[hIdx] !== undefined && rowCells[hIdx] !== null ? String(rowCells[hIdx]).trim() : '';
        rowObj[h || `Col_${hIdx}`] = val;
        normalizedRow[normalizeKey(h || `col${hIdx}`)] = val;
      });

      const getVal = (possibleKeys: string[]): string => {
        for (const k of possibleKeys) {
          const normK = normalizeKey(k);
          if (normalizedRow[normK] !== undefined && normalizedRow[normK] !== null) {
            const val = String(normalizedRow[normK]).trim();
            if (val.length > 0) return val;
          }
        }
        return '';
      };

      const errors: string[] = [];
      const warnings: string[] = [];

      // Exact Mapping for User's Schema
      // 1. Student Name
      const fullName = getVal(['studentname', 'name', 'studentfullname', 'fullname', 'nameofstudent']);
      
      // Skip banner metadata lines like "X-2082 / SUN" if it ended up in a row without student name
      if (!fullName) {
        const rowStr = rowCells.map(c => String(c || '').trim()).join(' ');
        if (rowStr.includes('2082') || rowStr.includes('SUN') || rowStr.includes('Class')) {
          return; // Skip section separator row
        }
      }

      // 2. Admission ID ("Id")
      let admissionNumber = getVal(['id', 'admissionnumber', 'admissionno', 'admno', 'enrollmentno', 'admnumber', 'studentid']);
      
      // 3. Admission Date ("Ad. Date")
      const admissionDate = getVal(['addate', 'admissiondate', 'admitdate', 'dateofadmission', 'admindate']);
      
      // 4. Roll Number ("R. No")
      let rollNumber = getVal(['rno', 'rollno', 'rollnumber', 'roll', 'studentroll', 'rnum']);
      
      // 5. Gender
      const genderRaw = getVal(['gender', 'sex']).toLowerCase();
      let gender: 'Male' | 'Female' | 'Other' = 'Male';
      if (genderRaw.startsWith('f') || genderRaw === 'girl' || genderRaw === 'female') gender = 'Female';
      else if (genderRaw.startsWith('m') || genderRaw === 'boy' || genderRaw === 'male') gender = 'Male';
      else if (genderRaw) gender = 'Other';

      // 6. Caste
      const caste = getVal(['caste', 'ethnicity', 'category', 'castecategory']) || 'Other';

      // 7. Father's Name & Mother's Name
      const fatherName = getVal(['fathersname', 'fathername', 'father', 'primarycontactname', 'parentname']);
      const motherName = getVal(['mothersname', 'mothername', 'mother']);

      // 8. Address
      const addressText = getVal(['address', 'residentialaddress', 'residentaddress', 'streetaddress', 'street', 'location', 'municipality']) || 'Sainamaina';

      // 9. Phone No. - Automatic Multi-Phone & Pattern Recognition
      let rawPhone = getVal(phoneAliases);
      if (!rawPhone && autoDetectedPhoneColIdx >= 0 && rowCells[autoDetectedPhoneColIdx]) {
        rawPhone = String(rowCells[autoDetectedPhoneColIdx]).trim();
      }

      const { primary: parsedPhone, secondary: parsedSecPhone } = extractPhoneNumbers(rawPhone);
      const finalPhone = parsedPhone || '9800000000';

      // 10. Date of Birth ("D. O. Birth")
      const dob = getVal(['dob', 'dateofbirth', 'birthdate', 'dobirth', 'dateofbirthbs']);

      // 11. Class & Section
      let className = getVal(['class', 'classname', 'grade', 'standard']) || defaultClassName;
      let section = getVal(['section', 'sec', 'division']) || defaultSection;

      // Normalize Class name format
      if (!className.toLowerCase().startsWith('class')) {
        let cleanClass = className.replace(/^X$/i, '10').replace(/^IX$/i, '9').replace(/^XI$/i, '11').replace(/^XII$/i, '12');
        className = `Class ${cleanClass}`;
      }

      // Validations & Fallbacks
      if (!fullName) {
        errors.push('Missing Student Name');
      }

      if (!rollNumber) {
        rollNumber = String(parsedResults.length + 1).padStart(2, '0');
        warnings.push(`Auto-assigned Roll No. ${rollNumber}`);
      }

      if (!admissionNumber) {
        admissionNumber = `ADM-${detectedYear}-${String(70000 + parsedResults.length + 1)}`;
        warnings.push(`Auto-generated Id #${admissionNumber}`);
      }

      if (!parsedPhone) {
        warnings.push('Phone number empty - assigned standard contact placeholder');
      }

      const primaryContact = fatherName || motherName || 'Parent / Guardian';
      const relationship = fatherName ? 'Father' : (motherName ? 'Mother' : 'Guardian');

      // Check duplicates in existing app database
      const duplicateMatch = existingStudents.find(s => 
        (s.className.toLowerCase() === className.toLowerCase() && 
         s.section.toUpperCase() === section.toUpperCase() && 
         s.rollNumber === rollNumber) ||
        (s.admissionNumber && s.admissionNumber.toLowerCase() === admissionNumber.toLowerCase())
      );

      const isDuplicate = !!duplicateMatch;
      const duplicateMatchedBy = duplicateMatch 
        ? `Matched existing: ${duplicateMatch.fullName} (Roll #${duplicateMatch.rollNumber} • ${duplicateMatch.className}-${duplicateMatch.section})`
        : undefined;

      const studentData: Student = {
        id: duplicateMatch ? duplicateMatch.id : `std-${admissionNumber}-${Date.now()}-${rIdx}`,
        rollNumber: String(rollNumber).padStart(2, '0'),
        admissionNumber,
        admissionDate: admissionDate || undefined,
        fullName,
        className,
        section: section.toUpperCase(),
        gender,
        caste,
        dob,
        phone: finalPhone,
        email: `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@schoolnet.edu`,
        fatherName: fatherName || undefined,
        motherName: motherName || undefined,
        academicYear: detectedYear,
        address: {
          street: addressText,
          city: addressText.includes('Sainamaina') ? 'Sainamaina' : addressText,
          state: 'Lumbini',
          zipCode: '32900'
        },
        parents: {
          primaryContactName: primaryContact,
          relationship,
          fatherName: fatherName || undefined,
          motherName: motherName || undefined,
          phone: finalPhone,
          secondaryPhone: parsedSecPhone || (motherName ? finalPhone : undefined),
          emergencyContactName: motherName ? `${motherName} (Mother)` : `${fatherName || primaryContact} (Primary Contact)`,
          emergencyContactPhone: parsedSecPhone || finalPhone
        }
      };

      parsedResults.push({
        isValid: errors.length === 0,
        hasWarning: warnings.length > 0,
        isDuplicate,
        duplicateMatchedBy,
        errors,
        warnings,
        studentData,
        rawRow: rowObj,
        secondaryPhone: parsedSecPhone
      });
    });

    return parsedResults;
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setParseError(null);
    setFileName(selectedFile.name);
    setFile(selectedFile);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, raw: false });
      
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('The uploaded spreadsheet does not contain any sheets.');
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const aoaData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '', raw: false });

      if (!aoaData || aoaData.length === 0) {
        throw new Error('The spreadsheet is empty or has no recognizable data rows.');
      }

      const parsed = parseExcelAOA(aoaData);
      if (parsed.length === 0) {
        throw new Error('No student data rows could be extracted. Please check the sheet headers.');
      }

      setParsedRows(parsed);
    } catch (err: any) {
      setParseError(err?.message || 'Failed to parse Excel file. Please verify the format.');
      setParsedRows([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Download exact school template matching the user's provided sheet
  const handleDownloadSchoolTemplate = (format: 'xlsx' | 'csv') => {
    const wsData = [
      SCHOOL_TEMPLATE_HEADERS,
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['X-2082 / SUN', '', '', '', '', '', '', '', '', '', '', ''],
      ...SCHOOL_SAMPLE_ROWS
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto column widths
    const colWidths = [
      { wch: 8 },  // S. No.
      { wch: 10 }, // Id
      { wch: 14 }, // Ad. Date
      { wch: 8 },  // R. No
      { wch: 22 }, // Student Name
      { wch: 10 }, // Gender
      { wch: 16 }, // Caste
      { wch: 24 }, // Father's Name
      { wch: 24 }, // Mother's Name
      { wch: 18 }, // Address
      { wch: 16 }, // Phone No.
      { wch: 14 }  // D. O. Birth
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student_Records');

    const extension = format === 'xlsx' ? 'xlsx' : 'csv';
    const fileName = `Student_Details_School_Register_Format.${extension}`;
    
    XLSX.writeFile(wb, fileName, { bookType: format });
  };

  const handleConfirmImport = () => {
    const validStudentsToImport: Student[] = [];

    parsedRows.forEach((row, idx) => {
      if (row.isValid && row.studentData) {
        const student = { ...row.studentData };
        if (duplicateStrategy === 'append' && row.isDuplicate) {
          student.id = `std-appended-${Date.now()}-${idx}`;
        }
        validStudentsToImport.push(student);
      }
    });

    if (validStudentsToImport.length === 0) {
      alert('No valid student records found to import.');
      return;
    }

    onImportStudents(validStudentsToImport, duplicateStrategy);

    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onClose();
  };

  const handleClear = () => {
    setFile(null);
    setFileName('');
    setParsedRows([]);
    setParseError(null);
    setDetectedBatchInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const warningCount = parsedRows.filter(r => r.hasWarning && r.isValid).length;
  const duplicateCount = parsedRows.filter(r => r.isDuplicate && r.isValid).length;
  const errorCount = parsedRows.filter(r => !r.isValid).length;
  const phoneCount = parsedRows.filter(r => r.isValid && r.studentData.phone && r.studentData.phone !== '9800000000').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Excel Student & Phone Number Importer</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Auto Phone Upload Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automatically extracts and uploads phone numbers, parents' details, admission IDs, and roll numbers from Excel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelpGuide(!showHelpGuide)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showHelpGuide ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Column Formatting Guide"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Format Guide</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Visual Column Schema Banner */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>Automatic Excel Column Mapping (With Phone Extraction)</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Auto-Detects 10-Digit & Dual Phone Numbers</span>
              </span>
            </div>
            
            {/* Column Tags Row */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg font-mono">S. No.</span>
              <span className="px-2 py-1 bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 rounded-lg font-mono font-bold">Id</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg font-mono">Ad. Date</span>
              <span className="px-2 py-1 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 rounded-lg font-mono font-bold">R. No</span>
              <span className="px-2 py-1 bg-sky-950/60 border border-sky-700/60 text-sky-300 rounded-lg font-mono font-bold">Student Name</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg font-mono">Gender</span>
              <span className="px-2 py-1 bg-purple-950/60 border border-purple-700/60 text-purple-300 rounded-lg font-mono">Caste</span>
              <span className="px-2 py-1 bg-amber-950/60 border border-amber-700/60 text-amber-300 rounded-lg font-mono font-bold">Father's Name</span>
              <span className="px-2 py-1 bg-pink-950/60 border border-pink-700/60 text-pink-300 rounded-lg font-mono font-bold">Mother's Name</span>
              <span className="px-2 py-1 bg-teal-950/60 border border-teal-700/60 text-teal-300 rounded-lg font-mono">Address</span>
              <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-lg font-mono font-bold flex items-center gap-1">
                <Phone className="w-3 h-3 text-rose-400" />
                Phone No. (Auto Upload)
              </span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg font-mono">D. O. Birth</span>
            </div>
          </div>

          {/* Guide Dropdown / Banner */}
          {showHelpGuide && (
            <div className="bg-sky-950/40 border border-sky-800/60 rounded-2xl p-4 text-xs text-sky-200/90 space-y-3">
              <div className="flex items-center justify-between font-bold text-sky-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Automatic Phone Number & Format Guide
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpGuide(false)}
                  className="text-sky-400 hover:text-white text-[11px]"
                >
                  Hide Guide
                </button>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong>Phone Number Column:</strong> Header can be named <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 font-mono">Phone No.</code>, <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 font-mono">Mobile</code>, <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 font-mono">Contact</code>, or <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 font-mono">Ph. No.</code></li>
                <li><strong>Dual Phone Numbers:</strong> If a cell has two numbers like <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">9847197448/9847151105</code>, the first becomes the primary phone and the second becomes the mother/emergency secondary phone!</li>
                <li><strong>Scientific & Excel Formats:</strong> Numbers formatted like <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200 font-mono">9.84717E+09</code> or <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200 font-mono">9847166942.0</code> are automatically sanitized without precision loss.</li>
                <li><strong>Class Section Headers:</strong> A row like <code className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-mono">X-2082 / SUN</code> sets the class to <strong>Class 10</strong>, Section <strong>SUN</strong>, and Year <strong>2082</strong>.</li>
              </ul>
            </div>
          )}

          {/* Upload Zone & Download Template Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            
            {/* Drag & Drop Area (2 cols) */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-2 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-sky-400 bg-sky-500/10 scale-[0.99]' 
                  : file 
                  ? 'border-emerald-500/50 bg-emerald-500/5' 
                  : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/30">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white">{fileName}</span>
                  <span className="text-xs text-slate-400 mt-1">
                    {(file.size / 1024).toFixed(1)} KB • Click or drop a new file to replace
                  </span>
                  {detectedBatchInfo && (
                    <span className="mt-2 text-xs px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                      Detected: {detectedBatchInfo}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-2 border border-sky-500/30">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Drag and drop your Excel sheet here
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    or <span className="text-sky-400 font-medium underline">browse from your computer</span> (.xlsx, .xls, .csv)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone numbers will be automatically extracted & linked to parent profiles
                  </span>
                </div>
              )}
            </div>

            {/* Template Download Card (1 col) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1">
                  School Excel Format
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Download the sample template configured with phone numbers and all 12 register columns.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSchoolTemplate('xlsx')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download School Template (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSchoolTemplate('csv')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Template (.csv)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parse Errors */}
          {parseError && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-rose-200">Error reading spreadsheet</span>
                <p>{parseError}</p>
              </div>
            </div>
          )}

          {/* Parsed Results Overview */}
          {parsedRows.length > 0 && (
            <div className="space-y-4">
              
              {/* Summary Stats & Duplicate Handling */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Stats Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200">Found {parsedRows.length} student records:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validCount} Ready to Import
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    {phoneCount} Phone Numbers Uploaded
                  </span>

                  {warningCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {warningCount} Warnings
                    </span>
                  )}

                  {duplicateCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
                      <RefreshCw className="w-3.5 h-3.5" />
                      {duplicateCount} Duplicates
                    </span>
                  )}

                  {errorCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errorCount} Invalid
                    </span>
                  )}
                </div>

                {/* Duplicate Strategy Option */}
                {duplicateCount > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">On Duplicate:</span>
                    <select
                      value={duplicateStrategy}
                      onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
                    >
                      <option value="update">Update Existing Details & Phone</option>
                      <option value="skip">Skip Existing Students</option>
                      <option value="append">Append as New Records</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40 shadow-inner">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <span>Previewing {parsedRows.length} Student Rows</span>
                    <span className="text-[11px] text-emerald-400 font-normal">
                      (All phone numbers extracted automatically)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear File</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900/95 text-slate-400 text-[11px] font-semibold uppercase sticky top-0 z-10 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Id</th>
                        <th className="py-2.5 px-3">R. No</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3 text-emerald-400 font-bold bg-emerald-950/30 border-x border-emerald-800/30">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>Phone No. (Auto Uploaded)</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-3">Father's Name</th>
                        <th className="py-2.5 px-3">Mother's Name</th>
                        <th className="py-2.5 px-3">Gender</th>
                        <th className="py-2.5 px-3">Caste</th>
                        <th className="py-2.5 px-3">Address</th>
                        <th className="py-2.5 px-3">D. O. Birth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {parsedRows.map((row, idx) => {
                        const st = row.studentData;
                        return (
                          <tr 
                            key={idx} 
                            className={`hover:bg-slate-800/40 transition-colors ${
                              !row.isValid ? 'bg-rose-950/20' : row.isDuplicate ? 'bg-indigo-950/10' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {!row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-semibold" title={row.errors.join(', ')}>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Invalid
                                </span>
                              ) : row.isDuplicate ? (
                                <span className="inline-flex items-center gap-1 text-indigo-400 text-[11px] font-semibold" title={row.duplicateMatchedBy}>
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  Match
                                </span>
                              ) : row.hasWarning ? (
                                <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-semibold" title={row.warnings.join(', ')}>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Ready
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-indigo-300 font-semibold whitespace-nowrap">
                              {st.admissionNumber}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold whitespace-nowrap">
                              {st.rollNumber}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-100 whitespace-nowrap">
                              {st.fullName}
                            </td>

                            {/* Uploaded Phone Number */}
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-emerald-300 bg-emerald-950/20 border-x border-emerald-800/30">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span>{st.phone}</span>
                                {row.secondaryPhone && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-mono font-normal">
                                    Alt: {row.secondaryPhone}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-200">
                              {st.fatherName || '-'}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                              {st.motherName || '-'}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                st.gender === 'Female' ? 'bg-pink-950/50 text-pink-300 border border-pink-800/40' : 'bg-sky-950/50 text-sky-300 border border-sky-800/40'
                              }`}>
                                {st.gender}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-purple-300 font-medium">
                              {st.caste || 'Other'}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                              {st.address.street}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 font-mono">
                              {st.dob || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {parsedRows.length > 0 && (
              <button
                id="btn-import-excel-submit"
                type="button"
                disabled={validCount === 0 || isProcessing}
                onClick={handleConfirmImport}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import {validCount} Student{validCount === 1 ? '' : 's'} with Phone Numbers</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
