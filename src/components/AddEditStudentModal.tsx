import React, { useState, useEffect } from 'react';
import { X, Check, User, MapPin, Users, Phone, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { Student } from '../types';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  defaultClass?: string;
  defaultSection?: string;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  defaultClass = 'Class 10',
  defaultSection = 'SUN'
}) => {
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [academicYear, setAcademicYear] = useState('2082');
  const [className, setClassName] = useState('Class 10');
  const [section, setSection] = useState('SUN');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [caste, setCaste] = useState('Other');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lumbini');
  const [zipCode, setZipCode] = useState('');

  // Parents
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [relationship, setRelationship] = useState<'Father' | 'Mother' | 'Guardian' | 'Other'>('Father');
  const [parentPhone, setParentPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setFullName(studentToEdit.fullName || '');
      setRollNumber(studentToEdit.rollNumber || '');
      setAdmissionNumber(studentToEdit.admissionNumber || '');
      setAdmissionDate(studentToEdit.admissionDate || '');
      setAcademicYear(studentToEdit.academicYear || '2082');
      setClassName(studentToEdit.className || 'Class 10');
      setSection(studentToEdit.section || 'SUN');
      setGender(studentToEdit.gender || 'Male');
      setCaste(studentToEdit.caste || 'Other');
      setDob(studentToEdit.dob || '');
      setPhone(studentToEdit.phone || '');
      setEmail(studentToEdit.email || '');
      setBloodGroup(studentToEdit.bloodGroup || 'O+');
      setAvatarUrl(studentToEdit.avatarUrl || '');

      setStreet(studentToEdit.address.street || '');
      setCity(studentToEdit.address.city || '');
      setState(studentToEdit.address.state || 'Lumbini');
      setZipCode(studentToEdit.address.zipCode || '');

      setFatherName(studentToEdit.fatherName || '');
      setMotherName(studentToEdit.motherName || '');
      setPrimaryContactName(studentToEdit.parents.primaryContactName || '');
      setRelationship(studentToEdit.parents.relationship || 'Father');
      setParentPhone(studentToEdit.parents.phone || studentToEdit.phone || '');
      setEmergencyContactName(studentToEdit.parents.emergencyContactName || '');
      setEmergencyContactPhone(studentToEdit.parents.emergencyContactPhone || '');
      setNotes(studentToEdit.notes || '');
    } else {
      // Reset form
      setFullName('');
      setRollNumber('');
      setAdmissionNumber(`${Math.floor(10000 + Math.random() * 90000)}`);
      setAdmissionDate('2081-01-10');
      setAcademicYear('2082');
      setClassName(defaultClass === 'ALL' ? 'Class 10' : defaultClass);
      setSection(defaultSection === 'ALL' ? 'SUN' : defaultSection);
      setGender('Male');
      setCaste('Other');
      setDob('2066-01-01');
      setPhone('');
      setEmail('');
      setBloodGroup('O+');
      setAvatarUrl('');

      setStreet('Sainamaina-2');
      setCity('Sainamaina');
      setState('Lumbini');
      setZipCode('32900');

      setFatherName('');
      setMotherName('');
      setPrimaryContactName('');
      setRelationship('Father');
      setParentPhone('');
      setEmergencyContactName('');
      setEmergencyContactPhone('');
      setNotes('');
    }
  }, [studentToEdit, isOpen, defaultClass, defaultSection]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rollNumber.trim()) {
      alert('Please fill in Student Name and Roll Number.');
      return;
    }

    const primaryName = primaryContactName.trim() || fatherName.trim() || motherName.trim() || 'Parent/Guardian';
    const primaryPhone = parentPhone.trim() || phone.trim() || '9800000000';

    const studentData: Student = {
      id: studentToEdit?.id || `std-${Date.now()}`,
      fullName: fullName.trim(),
      rollNumber: rollNumber.trim().padStart(2, '0'),
      admissionNumber: admissionNumber.trim() || `${Math.floor(10000 + Math.random() * 90000)}`,
      admissionDate: admissionDate.trim() || undefined,
      academicYear: academicYear.trim() || '2082',
      className,
      section,
      gender,
      caste: caste.trim() || 'Other',
      dob: dob || undefined,
      phone: phone.trim() || primaryPhone,
      email: email.trim() || undefined,
      bloodGroup,
      avatarUrl: avatarUrl.trim() || undefined,
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      notes: notes.trim() || undefined,
      address: {
        street: street.trim() || 'Sainamaina',
        city: city.trim() || 'Sainamaina',
        state: state.trim() || 'Lumbini',
        zipCode: zipCode.trim() || '32900'
      },
      parents: {
        primaryContactName: primaryName,
        relationship,
        fatherName: fatherName.trim() || undefined,
        motherName: motherName.trim() || undefined,
        phone: primaryPhone,
        emergencyContactName: emergencyContactName.trim() || (motherName.trim() ? `${motherName.trim()} (Mother)` : undefined),
        emergencyContactPhone: emergencyContactPhone.trim() || primaryPhone
      }
    };

    onSave(studentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950/40 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {studentToEdit ? 'Edit Student Record' : 'Add New Student'}
              </h2>
              <p className="text-xs text-slate-400">School Register Details: Roll, Admission Id, Caste, Parents, Address</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 text-xs">
          
          {/* 1. Student Profile */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 pb-1 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>1. Student Profile & Register Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. ABISHEK NEUPANE"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Roll No (R. No) *</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 01"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Admission Id (Id)</label>
                <input
                  type="text"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  placeholder="e.g. 79130"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Admission Date (Ad. Date)</label>
                <input
                  type="text"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  placeholder="e.g. 2079-02-06"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Date of Birth (D. O. Birth)</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="e.g. 2066-06-13"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Class</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Class 10"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="SUN / A / B"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Caste</label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                >
                  <option value="Other">Other</option>
                  <option value="Brahmin/Chhetri">Brahmin/Chhetri</option>
                  <option value="Janajati">Janajati</option>
                  <option value="Madhesi">Madhesi</option>
                  <option value="Dalit">Dalit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone No.</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (!parentPhone) setParentPhone(e.target.value);
                  }}
                  placeholder="9847166942"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2082"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Parents Details */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 pb-1 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>2. Parents' Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Father's Name</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => {
                    setFatherName(e.target.value);
                    if (relationship === 'Father') setPrimaryContactName(e.target.value);
                  }}
                  placeholder="e.g. Ashok Neupane"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => {
                    setMotherName(e.target.value);
                    if (relationship === 'Mother') setPrimaryContactName(e.target.value);
                  }}
                  placeholder="e.g. Laxmi Pandey"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Primary Parent Contact Name</label>
                <input
                  type="text"
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                  placeholder="e.g. Ashok Neupane"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Parent Phone Number</label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="9847166942"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Address */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 pb-1 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>3. Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Address / Municipality & Ward</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Sainamaina-3 or Rainadevi Chhahara"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{studentToEdit ? 'Save Changes' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
