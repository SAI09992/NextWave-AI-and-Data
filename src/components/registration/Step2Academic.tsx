'use client';

import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FullRegistrationInput } from '@/lib/validation';
import { Hash, Building2, BookOpen, Layers, Lock, Info } from 'lucide-react';

interface Props {
  form: UseFormReturn<FullRegistrationInput>;
}

export default function Step2Academic({ form }: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentDept = watch('department');
  const currentYear = watch('year');

  const isSecondYear = currentYear === '2nd Year';

  // Determine initial selection for 3rd/4th year flow
  const isInitialCse = currentDept === 'CSE' || currentDept === 'Computer Science and Engineering';
  const isInitialIt = currentDept === 'IT' || currentDept === 'Information Technology';
  const [deptChoice, setDeptChoice] = useState<'CSE' | 'IT' | 'Other' | ''>(() => {
    if (!currentDept) return '';
    if (isInitialCse) return 'CSE';
    if (isInitialIt) return 'IT';
    return 'Other';
  });

  const [customDept, setCustomDept] = useState(() => {
    if (currentDept && !isInitialCse && !isInitialIt) return currentDept;
    return '';
  });

  // For 2nd year: direct department input
  const [secondYearDept, setSecondYearDept] = useState(() => {
    if (isSecondYear && currentDept) return currentDept;
    return '';
  });

  // When year changes, reset department and credit type accordingly
  useEffect(() => {
    if (isSecondYear) {
      // 2nd year: auto-set to NON_CGPA, keep department if already set
      setValue('creditType', 'NON_CGPA', { shouldValidate: true });
      if (!secondYearDept && currentDept) {
        setSecondYearDept(currentDept);
      }
    } else if (currentYear === '3rd Year' || currentYear === '4th Year') {
      // If switching from 2nd year to 3rd/4th, reset credit type based on dept choice
      if (deptChoice === 'CSE') {
        setValue('creditType', 'PE_CSE', { shouldValidate: true });
      } else if (deptChoice === 'IT') {
        setValue('creditType', 'PE_IT', { shouldValidate: true });
      } else if (deptChoice === 'Other') {
        setValue('creditType', 'UE', { shouldValidate: true });
      }
    }
  }, [currentYear]);

  // 3rd/4th year: department choice handler
  const handleDeptChoiceChange = (choice: 'CSE' | 'IT' | 'Other' | '') => {
    setDeptChoice(choice);
    if (choice === 'CSE') {
      setValue('department', 'CSE', { shouldValidate: true });
      setValue('creditType', 'PE_CSE', { shouldValidate: true });
    } else if (choice === 'IT') {
      setValue('department', 'IT', { shouldValidate: true });
      setValue('creditType', 'PE_IT', { shouldValidate: true });
    } else if (choice === 'Other') {
      setValue('department', customDept, { shouldValidate: true });
      setValue('creditType', 'UE', { shouldValidate: true });
    } else {
      setValue('department', '', { shouldValidate: true });
    }
  };

  const handleCustomDeptChange = (val: string) => {
    setCustomDept(val);
    if (deptChoice === 'Other') {
      setValue('department', val, { shouldValidate: true });
      setValue('creditType', 'UE', { shouldValidate: true });
    }
  };

  // 2nd year: direct department handler
  const handleSecondYearDeptChange = (val: string) => {
    setSecondYearDept(val);
    setValue('department', val, { shouldValidate: true });
    setValue('creditType', 'NON_CGPA', { shouldValidate: true });
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="border-b border-nexus-border pb-3">
        <h3 className="text-base font-bold text-nexus-primary">
          STEP 2 : ACADEMIC DETAILS
        </h3>
        <p className="text-xs text-nexus-text-muted">
          Enter your academic information as per college records.
        </p>
      </div>

      {/* Register / Roll Number */}
      <div className="space-y-1.5">
        <label className="text-xs text-nexus-text flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-nexus-primary" />
          <span>Register / Roll Number *</span>
        </label>
        <input
          type="text"
          placeholder="Enter your register number"
          {...register('registerNumber')}
          className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-text text-sm uppercase focus:outline-none focus:border-nexus-primary transition-colors"
        />
        {errors.registerNumber && (
          <p className="text-[11px] text-red-400">{errors.registerNumber.message}</p>
        )}
      </div>

      {/* Year of Study */}
      <div className="space-y-1.5">
        <label className="text-xs text-nexus-text flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Year of Study *</span>
        </label>
        <select
          {...register('year')}
          className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-text text-sm focus:outline-none focus:border-nexus-primary transition-colors"
        >
          <option value="">Select your year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
        {errors.year && (
          <p className="text-[11px] text-red-400">{errors.year.message}</p>
        )}
      </div>

      {/* NON CGPA Info Banner for 2nd Year */}
      {isSecondYear && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-indigo-300 font-bold">NON CGPA — 2ND YEAR TRACK</p>
            <p className="text-[11px] text-indigo-400/80 mt-0.5 leading-relaxed">
              2nd year students from all departments are registered under the <strong>Non CGPA</strong> track. 
              You will receive <strong>2 Group 3 Certificates</strong> upon completion. Simply enter your department below.
            </p>
          </div>
        </div>
      )}

      {/* Department Selection — different flow for 2nd year vs 3rd/4th year */}
      {isSecondYear ? (
        /* 2nd Year: Direct department input — no credit type selection */
        <div className="space-y-1.5">
          <label className="text-xs text-nexus-text flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-nexus-secondary" />
            <span>Department *</span>
          </label>
          <input
            type="text"
            value={secondYearDept}
            onChange={(e) => handleSecondYearDeptChange(e.target.value)}
            placeholder="Enter your department (e.g. CSE, IT, ECE, EEE, Mechanical)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-text text-sm focus:outline-none focus:border-nexus-primary transition-colors"
            autoFocus={isSecondYear}
          />
          {errors.department && (
            <p className="text-[11px] text-red-400">{errors.department.message}</p>
          )}
          {/* Hidden credit type set to NON_CGPA */}
          <input type="hidden" {...register('creditType')} value="NON_CGPA" />
        </div>
      ) : (
        /* 3rd/4th Year: Credit-based department selection */
        <div className="space-y-1.5">
          <label className="text-xs text-nexus-text flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-nexus-secondary" />
            <span>Department & Credit Type *</span>
          </label>

          <select
            value={deptChoice}
            onChange={(e) => handleDeptChoiceChange(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-text text-sm focus:outline-none focus:border-nexus-primary transition-colors font-mono"
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE - PE (Program Elective)</option>
            <option value="IT">IT - PE (Program Elective)</option>
            <option value="Other">Other Department - UE (University Elective)</option>
          </select>
          {errors.department && !deptChoice && (
            <p className="text-[11px] text-red-400">{errors.department.message}</p>
          )}

          {/* If 'Other' is selected, ask them to specify manually */}
          {deptChoice === 'Other' && (
            <div className="pt-2 space-y-1">
              <label className="text-[11px] text-nexus-text-dim block">
                Specify Your Department Name *
              </label>
              <input
                type="text"
                value={customDept}
                onChange={(e) => handleCustomDeptChange(e.target.value)}
                placeholder="e.g. ECE, EEE, Mechanical, Biotech, Civil"
                className="w-full px-3 py-2 rounded-lg bg-nexus-bg border border-nexus-secondary/50 text-nexus-text text-xs focus:outline-none focus:border-nexus-secondary transition-colors"
                autoFocus
              />
              {errors.department && deptChoice === 'Other' && (
                <p className="text-[11px] text-red-400">{errors.department.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section & College */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-nexus-text">Section *</label>
          <input
            type="text"
            placeholder="Enter section like 23S10, 24S15"
            {...register('section')}
            className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-surface border border-nexus-border text-nexus-text text-sm uppercase focus:outline-none focus:border-nexus-primary transition-colors"
          />
          {errors.section && (
            <p className="text-[11px] text-red-400">{errors.section.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-nexus-text flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Institution / University (Default)</span>
          </label>
          <input
            type="text"
            value="Kalasalingam Academy of Research and Education"
            readOnly
            disabled
            {...register('college')}
            className="w-full px-3.5 py-2.5 rounded-lg bg-nexus-bg-elevated border border-nexus-border text-nexus-primary text-sm font-bold cursor-not-allowed select-none"
          />
        </div>
      </div>
    </div>
  );
}
