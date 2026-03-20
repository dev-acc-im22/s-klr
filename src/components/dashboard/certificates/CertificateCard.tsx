'use client';

import { Award, Calendar, ExternalLink, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

interface CertificateCardProps {
  id: string;
  courseName: string;
  studentName: string;
  instructorName: string;
  certificateNumber: string;
  issuedAt: Date | string;
  onDownload?: () => void;
  onShare?: () => void;
}

export function CertificateCard({
  courseName,
  studentName,
  instructorName,
  certificateNumber,
  issuedAt,
  onDownload,
  onShare,
}: CertificateCardProps) {
  const issueDate = typeof issuedAt === 'string' ? new Date(issuedAt) : issuedAt;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{courseName}</CardTitle>
              <p className="text-sm text-muted-foreground">by {instructorName}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Issued on {format(issueDate, 'MMMM d, yyyy')}</span>
          </div>

          <div className="text-xs text-muted-foreground">
            Certificate ID: <code className="bg-muted px-1 py-0.5 rounded">{certificateNumber}</code>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" onClick={onDownload}>
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={onShare}>
              <Share2 className="mr-1 h-3 w-3" />
              Share
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/verify/${certificateNumber}`} target="_blank">
                <ExternalLink className="mr-1 h-3 w-3" />
                Verify
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
