'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FullRegistrationInput } from '@/lib/validation';
import { Home, Building, DoorOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  form: UseFormReturn<FullRegistrationInput>;
}

export default function Step3Residence({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentResidence = watch('residenceType');

  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-lg font-bold text-yellow-400">
          STEP 3 : RESIDENCE DETAILS
        </h3>
        <p className="text-sm text-gray-500">
          Please select your accommodation type.
        </p>
      </div>

      {/* Residence Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label
          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
            currentResidence === 'DAY_SCHOLAR'
              ? 'border-yellow-500 bg-yellow-900/20'
              : 'border-gray-700 bg-gray-900/50 hover:border-yellow-500/50'
          }`}
          onClick={() => {
            setValue('residenceType', 'DAY_SCHOLAR', { shouldValidate: true });
            setValue('hostelName', '');
            setValue('roomNumber', '');
          }}
        >
          <div className="flex items-center gap-3">
            <Home className={`w-5 h-5 ${currentResidence === 'DAY_SCHOLAR' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`font-bold ${currentResidence === 'DAY_SCHOLAR' ? 'text-white' : 'text-gray-400'}`}>
              Day Scholar
            </span>
          </div>
        </label>

        <label
          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
            currentResidence === 'HOSTEL'
              ? 'border-red-500 bg-red-900/20'
              : 'border-gray-700 bg-gray-900/50 hover:border-red-500/50'
          }`}
          onClick={() => setValue('residenceType', 'HOSTEL', { shouldValidate: true })}
        >
          <div className="flex items-center gap-3">
            <Building className={`w-5 h-5 ${currentResidence === 'HOSTEL' ? 'text-red-400' : 'text-gray-400'}`} />
            <span className={`font-bold ${currentResidence === 'HOSTEL' ? 'text-white' : 'text-gray-400'}`}>
              Hosteller
            </span>
          </div>
        </label>
      </div>
      {errors.residenceType && (
        <p className="text-xs text-red-400">{errors.residenceType.message}</p>
      )}

      {/* Hostel Details (Conditional) */}
      <AnimatePresence>
        {currentResidence === 'HOSTEL' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden pt-4"
          >
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-red-400" />
                <span>Hostel Name / Block *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MH1, LH2"
                {...register('hostelName')}
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
              {errors.hostelName && (
                <p className="text-xs text-red-400">{errors.hostelName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-red-400" />
                <span>Room Number *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 101, 204B"
                {...register('roomNumber')}
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
              {errors.roomNumber && (
                <p className="text-xs text-red-400">{errors.roomNumber.message}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
