'use client';

import { useRef, forwardRef } from 'react';
import { Award, Calendar, Shield, User } from 'lucide-react';

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateNumber: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  function CertificateTemplate(
    { studentName, courseName, instructorName, completionDate, certificateNumber },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="w-[800px] h-[600px] bg-white relative overflow-hidden"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Decorative border */}
        <div className="absolute inset-0 border-[12px] border-blue-900 pointer-events-none">
          <div className="absolute inset-[8px] border-2 border-blue-800/50"></div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-blue-700"></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-blue-700"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-blue-700"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-blue-700"></div>

        {/* Content */}
        <div className="absolute inset-12 flex flex-col items-center justify-center text-center p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10 text-blue-700" />
            <h1 className="text-4xl font-bold text-blue-900 tracking-widest uppercase">
              Certificate
            </h1>
            <Award className="w-10 h-10 text-blue-700" />
          </div>
          <h2 className="text-lg text-blue-700 tracking-[0.3em] uppercase mb-8">
            of Completion
          </h2>

          {/* Divider */}
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-blue-700 to-transparent mb-6"></div>

          {/* This is to certify */}
          <p className="text-gray-600 text-sm uppercase tracking-wider mb-4">
            This is to certify that
          </p>

          {/* Student Name */}
          <h3 className="text-3xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {studentName}
          </h3>

          {/* Course completion text */}
          <p className="text-gray-600 text-sm uppercase tracking-wider mb-4">
            has successfully completed the course
          </p>

          {/* Course Name */}
          <h4 className="text-2xl font-semibold text-blue-800 mb-6">
            {courseName}
          </h4>

          {/* Details row */}
          <div className="flex items-center justify-center gap-12 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Instructor: <strong className="text-blue-900">{instructorName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Completed: <strong className="text-blue-900">{completionDate}</strong></span>
            </div>
          </div>

          {/* Verification */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3 text-blue-600" />
            <span>Certificate ID: <strong className="text-blue-700">{certificateNumber}</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-16 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">
            CreatorHub • Online Learning Platform
          </p>
        </div>

        {/* Decorative seal */}
        <div className="absolute bottom-20 right-16">
          <div className="w-20 h-20 rounded-full border-4 border-blue-800 flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
            <Award className="w-8 h-8 text-blue-700" />
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';
