'use client';

import { useState, useEffect, useRef } from 'react';
import { Award, Download, Share2, ExternalLink, Linkedin, Twitter, Copy, Check, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGhostMode } from '@/hooks/useGhostMode';
import { useToast } from '@/hooks/use-toast';

import { CertificateTemplate } from '@/components/dashboard/certificates';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import Link from 'next/link';

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: Date | string;
  courseName: string;
  studentName: string;
  instructorName: string;
  courseId: string;
}

// Mock data for ghost mode
const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CH-M1K2J3N4P5',
    issuedAt: new Date('2024-02-15'),
    courseName: 'Creator Business Masterclass',
    studentName: 'John Doe',
    instructorName: 'Ghost Admin',
    courseId: 'course-1',
  },
  {
    id: 'cert-2',
    certificateNumber: 'CH-Q6R7S8T9U0',
    issuedAt: new Date('2024-01-28'),
    courseName: 'Instagram Growth Strategies',
    studentName: 'John Doe',
    instructorName: 'Ghost Admin',
    courseId: 'course-2',
  },
  {
    id: 'cert-3',
    certificateNumber: 'CH-V1W2X3Y4Z5',
    issuedAt: new Date('2024-01-10'),
    courseName: 'Email Marketing Essentials',
    studentName: 'John Doe',
    instructorName: 'Ghost Admin',
    courseId: 'course-3',
  },
];

export default function CertificatesPage() {
  const { isGhostMode } = useGhostMode();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        if (isGhostMode) {
          setCertificates(mockCertificates);
        } else {
          const res = await fetch('/api/certificates');
          const data = await res.json();
          if (data.certificates) {
            setCertificates(data.certificates);
          }
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [isGhostMode]);

  const handleDownload = async (cert: Certificate) => {
    setSelectedCertificate(cert);
    setDownloading(true);

    // Wait for the certificate to render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (!certificateRef.current) return;

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `certificate-${cert.certificateNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: 'Certificate downloaded',
        description: 'Your certificate has been saved as an image.',
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Could not download the certificate. Please try again.',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async (cert: Certificate) => {
    const url = `${window.location.origin}/verify/${cert.certificateNumber}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(cert.id);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: 'Link copied',
        description: 'Certificate verification link copied to clipboard.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Could not copy the link. Please try again.',
      });
    }
  };

  const shareOnLinkedIn = (cert: Certificate) => {
    const url = `${window.location.origin}/verify/${cert.certificateNumber}`;
    const text = `I just completed the "${cert.courseName}" course on CreatorHub and earned my certificate!`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = (cert: Certificate) => {
    const url = `${window.location.origin}/verify/${cert.certificateNumber}`;
    const text = `I just completed the "${cert.courseName}" course on CreatorHub and earned my certificate! Check it out:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
        {/* Hidden certificate for download */}
        {selectedCertificate && (
          <div className="absolute -left-[9999px] top-0">
            <CertificateTemplate
              ref={certificateRef}
              studentName={selectedCertificate.studentName}
              courseName={selectedCertificate.courseName}
              instructorName={selectedCertificate.instructorName}
              completionDate={format(new Date(selectedCertificate.issuedAt), 'MMMM d, yyyy')}
              certificateNumber={selectedCertificate.certificateNumber}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              My Certificates
            </h1>
            <p className="text-muted-foreground">
              View and download your course completion certificates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by course name or certificate number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCertificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No certificates found' : 'No certificates yet'}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? 'Try adjusting your search query.'
                  : 'Complete a course to earn your first certificate!'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/courses">Browse Courses</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate">{cert.courseName}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">by {cert.instructorName}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span>
                        Issued on {format(new Date(cert.issuedAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Certificate ID:{' '}
                      <code className="bg-muted px-1 py-0.5 rounded">
                        {cert.certificateNumber}
                      </code>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(cert)}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="mr-1 h-3 w-3" />
                        )}
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => shareOnLinkedIn(cert)}>
                            <Linkedin className="mr-2 h-4 w-4" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareOnTwitter(cert)}>
                            <Twitter className="mr-2 h-4 w-4" />
                            Share on Twitter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(cert)}>
                            {copied === cert.id ? (
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="mr-2 h-4 w-4" />
                            )}
                            Copy verification link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/verify/${cert.certificateNumber}`} target="_blank">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Verify
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Certificate Preview Dialog */}
        <Dialog open={!!selectedCertificate && !downloading} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="max-w-[850px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
              {selectedCertificate && (
                <CertificateTemplate
                  studentName={selectedCertificate.studentName}
                  courseName={selectedCertificate.courseName}
                  instructorName={selectedCertificate.instructorName}
                  completionDate={format(new Date(selectedCertificate.issuedAt), 'MMMM d, yyyy')}
                  certificateNumber={selectedCertificate.certificateNumber}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}
