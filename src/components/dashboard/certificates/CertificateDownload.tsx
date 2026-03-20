'use client';

import { useState, useRef } from 'react';
import {
  Download,
  Share2,
  Linkedin,
  Twitter,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CertificateTemplate } from './CertificateTemplate';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface CertificateDownloadProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateNumber: string;
  verificationUrl: string;
}

export function CertificateDownload({
  studentName,
  courseName,
  instructorName,
  completionDate,
  certificateNumber,
  verificationUrl,
}: CertificateDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `certificate-${certificateNumber}.png`;
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const shareOnLinkedIn = () => {
    const text = `I just completed the "${courseName}" course on CreatorHub and earned my certificate!`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = `I just completed the "${courseName}" course on CreatorHub and earned my certificate! Check it out:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(verificationUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-4">
      {/* Hidden certificate for download */}
      <div className="absolute -left-[9999px] top-0">
        <CertificateTemplate
          ref={certificateRef}
          studentName={studentName}
          courseName={courseName}
          instructorName={instructorName}
          completionDate={completionDate}
          certificateNumber={certificateNumber}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download Certificate
        </Button>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[850px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
              <CertificateTemplate
                studentName={studentName}
                courseName={courseName}
                instructorName={instructorName}
                completionDate={completionDate}
                certificateNumber={certificateNumber}
              />
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={shareOnLinkedIn}>
              <Linkedin className="mr-2 h-4 w-4" />
              Share on LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareOnTwitter}>
              <Twitter className="mr-2 h-4 w-4" />
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy verification link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Verification info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Verification URL:</span>
        <code className="bg-muted px-2 py-1 rounded text-xs">{verificationUrl}</code>
      </div>
    </div>
  );
}
