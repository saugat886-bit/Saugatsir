// AI Teacher Copilot & Academic Assistant for SUNGABHA CONNECT
// Sungabha Public Secondary School (सुनगाभा पब्लिक सेकेन्डरी स्कुल)

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  Copy,
  CheckCircle2,
  FileText,
  HelpCircle,
  TrendingUp,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface AIAssistantModuleProps {
  currentUser: UserProfile | null;
  onUseAsHomework?: (title: string, desc: string, subject: string) => void;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({
  currentUser,
  onUseAsHomework
}) => {
  const [activeMode, setActiveMode] = useState<'quiz' | 'lesson' | 'remedial' | 'parent_report'>('quiz');
  const [subject, setSubject] = useState('Compulsory Science');
  const [grade, setGrade] = useState('Grade 6');
  const [topic, setTopic] = useState('Force, Motion and Simple Machines');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sampleOutputs: Record<string, string> = {
    quiz: `📝 **SUNGABHA PUBLIC SECONDARY SCHOOL — UNIT DIAGNOSTIC QUIZ**
*Subject:* ${subject} | *Class:* ${grade} | *Topic:* ${topic}
*ISO 9001:2015 Continuous Assessment Standard*

**Section A: Multiple Choice Questions (1 Mark Each)**
1. What is the standard SI unit of Force?
   a) Joule
   b) Newton (N)
   c) Pascal
   d) Watt

2. Which class of lever always has the load located between the fulcrum and the effort?
   a) First class lever
   b) Second class lever (e.g. Wheelbarrow)
   c) Third class lever
   d) Complex pulley system

3. If a body travels equal distances in equal intervals of time, its motion is called:
   a) Uniform Motion
   b) Accelerated Motion
   c) Random Motion
   d) Circular Motion

**Section B: Short Conceptual Questions (3 Marks Each)**
4. Define mechanical advantage (MA) and velocity ratio (VR) of a simple machine. Why is efficiency always less than 100% in practical machines?
5. State Newton's First Law of Motion and give one daily life example observed during bus transit on the Sainamaina highway.`,

    lesson: `📋 **OFFICIAL CDC-ALIGNED LESSON PLAN**
*School:* Sungabha Public Secondary School, Sainamaina-03
*Class:* ${grade} | *Subject:* ${subject} | *Period Duration:* 45 Minutes
*Unit/Topic:* ${topic}

**1. Specific Learning Objectives:**
- By the end of this lesson, students will be able to define ${topic} in their own words.
- Students will be able to categorize practical laboratory equipment and simple tools.
- Students will solve 2 numerical applications with 90% accuracy.

**2. Teaching Aids & Materials:**
- Smart Board digital diagram, spring balance, calibrated weights, charts from Sungabha Science Lab.

**3. Instructional Steps:**
- *Introduction & Hook (7 mins):* Real-world scenario demo asking students how heavy bags are lifted onto the school bus.
- *Core Teaching & Concept Delivery (23 mins):* Derivation of key formulas, demonstration of lever classes, interactive question check.
- *Group Work & Activity (10 mins):* Students pair up to solve worksheet problems.
- *Evaluation & Homework Assignment (5 mins):* Quick 2-question exit ticket.`,

    remedial: `🎯 **INDIVIDUALIZED REMEDIAL INTERVENTION PLAN**
*Target Group:* Students scoring below 50% in ${subject} (${grade})
*Intervention Window:* 3:30 PM - 4:15 PM Daily Clinic

**Diagnostic Weak Areas Identified:**
- Confusion between mass (kg) and weight (N).
- Difficulty interpreting vector diagrams and unit conversions.

**Targeted 5-Day Improvement Roadmap:**
- *Day 1:* Hands-on measurement with lab balances to physically experience mass vs weight.
- *Day 2:* Step-by-step formula cards with guided practice.
- *Day 3:* Peer tutoring pairing with House Academic Captains.
- *Day 4:* 10-minute low-stakes confidence-building quiz.
- *Day 5:* Parent progress update on WhatsApp.`
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedOutput('');
    setTimeout(() => {
      setGeneratedOutput(sampleOutputs[activeMode] || sampleOutputs.quiz);
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white">Sungabha AI Teacher Copilot & Lesson Designer</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Compliant with Nepal Curriculum Development Centre (CDC) standards • Teacher-in-the-loop review
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          {(['quiz', 'lesson', 'remedial'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => { setActiveMode(mode); setGeneratedOutput(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === mode
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'quiz' ? 'Diagnostic Quiz' : mode === 'lesson' ? 'Lesson Plan' : 'Remedial Plan'}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Controls & Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Prompt Customizer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Assistant Parameters
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Grade Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
              >
                <option value="Compulsory Science">Compulsory Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Nepali">Nepali</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Chapter / Topic Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Simple Machines, Triangles & Angles"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate with AI'}</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Output Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Generated Teaching Output
              </h3>

              {generatedOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-purple-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
              )}
            </div>

            {generatedOutput ? (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-[450px] overflow-y-auto">
                {generatedOutput}
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">Click "Generate with AI" to create tailored CDC-compliant materials instantly.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
