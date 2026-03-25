'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, Trash2, MoreVertical, Loader2, Mail, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  source: string;
  referrer: string | null;
  notified: boolean;
  createdAt: string;
  productId?: string | null;
  courseId?: string | null;
}

interface WaitlistListProps {
  productId?: string;
  courseId?: string;
  ghostMode?: boolean;
}

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direct',
  SOCIAL: 'Social',
  REFERRAL: 'Referral',
  EMAIL: 'Email',
  ADS: 'Ads',
  OTHER: 'Other',
};

const SOURCE_COLORS: Record<string, string> = {
  DIRECT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  SOCIAL: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  REFERRAL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  EMAIL: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  ADS: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

// Mock data for ghost mode
const mockEntries: WaitlistEntry[] = [
  {
    id: '1',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    source: 'DIRECT',
    referrer: null,
    notified: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    email: 'mike.chen@example.com',
    name: 'Mike Chen',
    source: 'SOCIAL',
    referrer: 'twitter',
    notified: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    email: 'emma.wilson@example.com',
    name: 'Emma Wilson',
    source: 'REFERRAL',
    referrer: 'AFFILIATE123',
    notified: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    email: 'alex.kumar@example.com',
    name: 'Alex Kumar',
    source: 'EMAIL',
    referrer: null,
    notified: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    email: 'james.smith@example.com',
    name: 'James Smith',
    source: 'ADS',
    referrer: 'facebook',
    notified: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export function WaitlistList({
  productId,
  courseId,
  ghostMode = false,
}: WaitlistListProps) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = useCallback(async () => {
    if (ghostMode) {
      setEntries(mockEntries);
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (productId) params.set('productId', productId);
      if (courseId) params.set('courseId', courseId);
      if (search) params.set('search', search);
      if (sourceFilter && sourceFilter !== 'all') params.set('source', sourceFilter);

      const response = await fetch(`/api/waitlist?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  }, [page, productId, courseId, search, sourceFilter, ghostMode]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (productId) params.set('productId', productId);
      if (courseId) params.set('courseId', courseId);
      if (sourceFilter && sourceFilter !== 'all') params.set('source', sourceFilter);

      const response = await fetch(`/api/waitlist/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Export complete',
          description: 'Your waitlist has been exported to CSV.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: 'Failed to export waitlist.',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this entry?')) return;

    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries(entries.filter((e) => e.id !== id));
        toast({
          title: 'Entry deleted',
          description: 'The waitlist entry has been removed.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Failed to delete entry.',
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(entries.map((e) => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Waitlist Signups</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No waitlist entries found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === entries.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Notified</TableHead>
                  <TableHead>Signed Up</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(entry.id)}
                        onCheckedChange={(checked) =>
                          handleSelect(entry.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{entry.name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {entry.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={SOURCE_COLORS[entry.source] || ''}
                      >
                        {SOURCE_LABELS[entry.source] || entry.source}
                      </Badge>
                      {entry.referrer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          via {entry.referrer}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.notified ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${entry.email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
