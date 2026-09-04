// SUNGABHA CONNECT — Student Sorting & Roll Number Sequencing Utilities
// Sungabha Public Secondary School, Sainamaina, Rupandehi

import { Student } from '../types';

/**
 * Extracts numeric roll number for natural numerical ordering (e.g. "1" -> 1, "02" -> 2, "10" -> 10).
 */
export function parseRollNumber(roll?: string | number): number {
  if (roll === undefined || roll === null) return 999999;
  const cleaned = String(roll).trim();
  const num = parseInt(cleaned.replace(/\D/g, ''), 10);
  return isNaN(num) ? 999999 : num;
}

export type StudentSortMode = 'roll-asc' | 'alpha-asc' | 'alpha-desc' | 'roll-desc';

/**
 * Sorts students roll number wise in alphabetical order:
 * - 'roll-asc' (Default): primary numerical Roll Number (1, 2, 3... 99), tie-breaker alphabetical Full Name (A to Z).
 * - 'alpha-asc': primary alphabetical Full Name (A to Z), tie-breaker numerical Roll Number.
 * - 'alpha-desc': Z to A Full Name.
 * - 'roll-desc': reverse Roll Number (99... 1).
 *
 * If students span multiple classes/sections, optionally groups by class and section first.
 */
export function sortStudents(
  students: Student[],
  mode: StudentSortMode = 'roll-asc',
  groupByClassSection: boolean = false
): Student[] {
  return [...students].sort((a, b) => {
    if (groupByClassSection) {
      if (a.className !== b.className) {
        return a.className.localeCompare(b.className, undefined, { numeric: true });
      }
      if (a.section !== b.section) {
        return a.section.localeCompare(b.section);
      }
    }

    if (mode === 'alpha-asc') {
      const nameComp = a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });
      if (nameComp !== 0) return nameComp;
      return parseRollNumber(a.rollNumber) - parseRollNumber(b.rollNumber);
    }

    if (mode === 'alpha-desc') {
      const nameComp = b.fullName.localeCompare(a.fullName, undefined, { sensitivity: 'base' });
      if (nameComp !== 0) return nameComp;
      return parseRollNumber(a.rollNumber) - parseRollNumber(b.rollNumber);
    }

    if (mode === 'roll-desc') {
      const rollA = parseRollNumber(a.rollNumber);
      const rollB = parseRollNumber(b.rollNumber);
      if (rollA !== rollB) return rollB - rollA;
      return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });
    }

    // Default: 'roll-asc'
    const rollA = parseRollNumber(a.rollNumber);
    const rollB = parseRollNumber(b.rollNumber);
    if (rollA !== rollB) {
      return rollA - rollB;
    }
    return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });
  });
}

/**
 * Reassigns roll numbers alphabetically (A to Z) within each class & section.
 * This guarantees that within a section:
 * - Roll 1 is the alphabetically first student (Aarav, Abishek, etc.)
 * - Roll 2 is the second student alphabetically, and so on.
 */
export function resequenceRollNumbersAlphabetically(
  students: Student[],
  targetClass?: string,
  targetSection?: string
): Student[] {
  // Group students by class and section
  const groups = new Map<string, Student[]>();
  
  students.forEach(st => {
    const key = `${st.className}:::${st.section}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(st);
  });

  const updatedStudents: Student[] = [];

  groups.forEach((groupStudents, key) => {
    const [cName, sName] = key.split(':::');
    const shouldResequence = 
      (!targetClass || targetClass === 'ALL' || targetClass === cName) &&
      (!targetSection || targetSection === 'ALL' || targetSection === sName);

    if (shouldResequence) {
      // Sort alphabetically A-Z
      const sorted = [...groupStudents].sort((a, b) => 
        a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' })
      );
      // Assign sequential roll number 1, 2, 3...
      sorted.forEach((st, idx) => {
        updatedStudents.push({
          ...st,
          rollNumber: String(idx + 1)
        });
      });
    } else {
      updatedStudents.push(...groupStudents);
    }
  });

  return sortStudents(updatedStudents, 'roll-asc', true);
}
