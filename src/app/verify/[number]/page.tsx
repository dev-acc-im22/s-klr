'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Award, CheckCircle, XCircle, Loader2, Calendar, User, BookOpen, ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { CertificateTemplate } from '@/components/dashboard/certificates';

interface CertificateData {
  valid: boolean;
  certificateNumber: string;
  issuedAt: string;
  courseName: string;
  studentName: string;
  instructorName: string;
  instructorUsername: string;
  completedAt: string | null;
  courseId: string;
}

// Mock data for demo/ghost mode
const mockCertificate: CertificateData = {
  valid: true,
  certificateNumber: 'CH-M1K2J3N4P5',
  issuedAt: new Date('2024-02-15').toISOString(),
  courseName: 'Creator Business Masterclass',
  studentName: 'John Doe',
  instructorName: 'Ghost Admin',
  instructorUsername: 'ghostadmin',
  completedAt: new Date('2024-02-15').toISOString(),
  courseId: 'course-1',
};

export default function VerifyCertificatePage() {
  const params = useParams();
  const certificateNumber = params.number as string;
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // For demo, check if the certificate number matches our mock pattern
        if (certificateNumber.startsWith('CH-') || certificateNumber === 'demo') {
          // Use mock data for demo
          setCertificate({
            ...mockCertificate,
            certificateNumber: certificateNumber === 'demo' ? mockCertificate.certificateNumber : certificateNumber,
          });
        } else {
          const res = await fetch(`/api/certificates/${certificateNumber}`);
          const data = await res.json();

          if (!res.ok) {
            setError(data.error || 'Certificate not found');
          } else {
            setCertificate(data.certificate);
          }
        }
      } catch (err) {
        console.error('Failed to verify certificate:', err);
        setError('Failed to verify certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Certificate Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'The certificate you are looking for could not be verified. Please check the certificate number and try again.'}
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/">Go to Homepage</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/certificates">View My Certificates</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">CreatorHub</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Certificate Verification</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Valid Certificate Banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Valid Certificate</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Certificate Verified
          </h1>
          <p className="text-gray-600">
            This certificate has been verified and is authentic.
          </p>
        </div>

        {/* Certificate Preview */}
        <div className="mb-8">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="flex justify-center bg-gray-100 p-8">
                <CertificateTemplate
                  studentName={certificate.studentName}
                  courseName={certificate.courseName}
                  instructorName={certificate.instructorName}
                  completionDate={format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}
                  certificateNumber={certificate.certificateNumber}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Details */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-semibold text-gray-900">{certificate.studentName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-semibold text-gray-900">{certificate.courseName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Certificate Number</p>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                  {certificate.certificateNumber}
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Instructor</p>
                <p className="font-medium">{certificate.instructorName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/courses/${certificate.courseId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Course
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            This certificate is verified by CreatorHub. For questions, contact{' '}
            <a href="mailto:support@creatorhub.com" className="text-blue-600 hover:underline">
              support@creatorhub.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
