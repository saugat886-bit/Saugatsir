// Fee Management & Collection Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Printer,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Search,
  FileText,
  ShieldCheck,
  Download
} from 'lucide-react';
import { FeeRecord, Student, UserProfile } from '../types';
import { SCHOOL_INFO } from '../data/initialData';

interface FeeManagementModuleProps {
  currentUser: UserProfile | null;
  fees: FeeRecord[];
  students: Student[];
  onRecordPayment: (studentId: string, amount: number, paymentMode: 'CASH' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER') => void;
}

export const FeeManagementModule: React.FC<FeeManagementModuleProps> = ({
  currentUser,
  fees,
  students,
  onRecordPayment
}) => {
  const [search, setSearch] = useState('');
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(3000);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER'>('CASH');
  const [activeReceipt, setActiveReceipt] = useState<FeeRecord | null>(null);

  const isAdminOrAccountant = currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'PRINCIPAL' ||
    currentUser?.role === 'ACCOUNTANT';

  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalDues = fees.reduce((acc, f) => acc + f.dueAmount, 0);

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toString().includes(search) ||
    s.className.toLowerCase().includes(search.toLowerCase())
  );

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment) return;
    onRecordPayment(selectedStudentForPayment.id, paymentAmount, paymentMode);
    setSelectedStudentForPayment(null);
    alert(`Payment of Rs. ${paymentAmount} recorded successfully! Receipt generated.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-400" />
            <h1 className="text-lg font-bold text-white">Accounts & Fee Management Portal</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Sungabha Public Secondary School • In-Charge: Sita Gautam (Accountant)
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Collected</span>
            <span className="text-sm font-black text-emerald-400">Rs. {totalCollected.toLocaleString()}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 block">Pending Outstanding</span>
            <span className="text-sm font-black text-rose-400">Rs. {totalDues.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Student Fee Records & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Fee Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Student Fee Ledger (Baisakh 2082)
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter student..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {filteredStudents.map((st) => {
                const feeRec = fees.find(f => f.studentId === st.id);
                const due = feeRec ? feeRec.dueAmount : 0;
                const status = due === 0 ? 'PAID' : due < 3000 ? 'PARTIAL' : 'DUE';

                return (
                  <div
                    key={st.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 rounded-xl px-2 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-center font-bold text-xs text-teal-300">
                        #{st.rollNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-white">{st.fullName}</h3>
                          <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                            status === 'PAID' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {st.className} - {st.section} • Parent: {st.parents.fatherName} ({st.parents.phone})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-black text-white">Rs. {feeRec?.paidAmount || 3000}</span>
                        <span className="text-[10px] text-slate-500 block">Due: Rs. {due}</span>
                      </div>

                      {isAdminOrAccountant && (
                        <button
                          onClick={() => setSelectedStudentForPayment(st)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Collect Fee
                        </button>
                      )}

                      {feeRec && (
                        <button
                          onClick={() => setActiveReceipt(feeRec)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Receipt Preview */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            Official Fee Receipt Preview
          </h2>

          {activeReceipt ? (
            <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-slate-300 space-y-4 print:p-0 print:border-none print:shadow-none">
              <div className="text-center border-b pb-3">
                <h3 className="text-sm font-black text-blue-950 uppercase">{SCHOOL_INFO.nameEn}</h3>
                <p className="text-[10px] text-slate-500">{SCHOOL_INFO.location} • {SCHOOL_INFO.phone}</p>
                <div className="mt-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 py-0.5 rounded">
                  OFFICIAL FEE RECEIPT • {activeReceipt.receiptNumber || 'REC-2082-01'}
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold">{activeReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Roll:</span>
                  <span className="font-bold">{activeReceipt.className} - {activeReceipt.section} (#{activeReceipt.rollNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Month:</span>
                  <span className="font-bold">{activeReceipt.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold">{activeReceipt.paymentMode || 'CASH'}</span>
                </div>
              </div>

              <div className="border-t border-b py-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tuition & Smart Class:</span>
                  <span>Rs. {activeReceipt.breakdown.tuitionFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exam & Lab Fee:</span>
                  <span>Rs. {activeReceipt.breakdown.examFee + activeReceipt.breakdown.computerFee}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t">
                  <span>Total Paid:</span>
                  <span className="text-emerald-700">Rs. {activeReceipt.paidAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                <span>Date: {activeReceipt.paymentDate}</span>
                <span className="border-t border-slate-400 pt-1 font-bold">Accountant Seal & Sign</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs">Click the printer icon next to any student to view their official school receipt.</p>
            </div>
          )}
        </div>

      </div>

      {/* Collect Fee Modal */}
      {selectedStudentForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Record Fee Collection</h2>
            <p className="text-xs text-slate-400">
              Student: <span className="text-white font-bold">{selectedStudentForPayment.fullName}</span> ({selectedStudentForPayment.className} - {selectedStudentForPayment.section})
            </p>

            <form onSubmit={handlePaySubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Amount Received (NPR)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-teal-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Payment Channel / Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                >
                  <option value="CASH">Cash Counter</option>
                  <option value="ESEWA">eSewa Mobile Wallet</option>
                  <option value="KHALTI">Khalti Payment</option>
                  <option value="BANK_TRANSFER">NIC Asia / Nabil Bank QR</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPayment(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-xs font-bold text-slate-950 rounded-xl shadow-lg shadow-teal-500/20 cursor-pointer"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
