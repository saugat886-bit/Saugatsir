// School Bus & Transport Management Module for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कul)

import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Phone,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { BusRoute, Student, UserProfile } from '../types';

interface TransportModuleProps {
  currentUser: UserProfile | null;
  buses: BusRoute[];
  students: Student[];
}

export const TransportModule: React.FC<TransportModuleProps> = ({
  currentUser,
  buses,
  students
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string>(buses[0]?.id || 'bus-01');

  const activeBus = buses.find(b => b.id === selectedBusId) || buses[0];

  const busStudents = students.filter(s => s.busRouteId === activeBus?.id);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-yellow-950 via-slate-900 to-amber-950 border border-yellow-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-yellow-400" />
            <h1 className="text-lg font-bold text-white">School Bus & Fleet Operations</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Sungabha Fleet Transport • GPS-enabled student pickup and drop across Sainamaina Municipality
          </p>
        </div>

        {/* Bus Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          {buses.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBusId(b.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeBus?.id === b.id
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>{b.routeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Bus Overview Card */}
      {activeBus && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Driver & Route Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-yellow-400 block">{activeBus.busNumber}</span>
                <h2 className="text-base font-bold text-white">{activeBus.routeName}</h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Route Active 🟢
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Driver:</span>
                <span className="font-bold text-white">{activeBus.driverName}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Driver Phone:</span>
                <a href={`tel:${activeBus.driverPhone}`} className="text-yellow-400 font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {activeBus.driverPhone}
                </a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Total Capacity:</span>
                <span className="font-bold text-white">{activeBus.capacity} Seats</span>
              </div>
            </div>

            {/* Pickup Stops List */}
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                Scheduled Pickup Stops
              </h3>
              <div className="space-y-2">
                {activeBus.stops.map((stop, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">{stop.stopName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{stop.pickupTime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Registered Student Passengers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                  Enrolled Bus Passengers ({busStudents.length} Students)
                </h3>
                <span className="text-xs text-slate-400">{activeBus.capacity - busStudents.length} Seats Available</span>
              </div>

              <div className="divide-y divide-slate-800">
                {busStudents.map((st) => (
                  <div
                    key={st.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-850/40 rounded-xl px-2 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-xs">
                        #{st.rollNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{st.fullName}</h4>
                        <p className="text-[11px] text-slate-400">
                          {st.className} - {st.section} • Pickup: <span className="text-yellow-300 font-medium">{st.busStop || 'Murgiya Chowk'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Parent: {st.parents.phone}
                      </span>
                      <a
                        href={`tel:${st.parents.phone}`}
                        className="p-1.5 text-emerald-400 hover:bg-emerald-950/40 rounded-lg transition-all"
                        title="Call Parent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
