'use client';

import { useState } from 'react';
import {
  Percent,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  Tag,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  isOneTimeUse: boolean;
  applicableProducts: string;
  createdAt: Date;
}

interface DiscountCodeListProps {
  discounts: DiscountCode[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function DiscountCodeList({ discounts, onEdit, onDelete, onToggleActive }: DiscountCodeListProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Code "${code}" copied to clipboard`,
    });
  };

  // Filter discounts
  let filteredDiscounts = [...discounts];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredDiscounts = filteredDiscounts.filter(
      (d) => d.code.toLowerCase().includes(searchLower) || d.name.toLowerCase().includes(searchLower)
    );
  }

  if (statusFilter !== 'all') {
    if (statusFilter === 'active') {
      filteredDiscounts = filteredDiscounts.filter((d) => d.isActive);
    } else if (statusFilter === 'inactive') {
      filteredDiscounts = filteredDiscounts.filter((d) => !d.isActive);
    }
  }

  const isExpired = (discount: DiscountCode) => {
    if (!discount.endDate) return false;
    return new Date(discount.endDate) < new Date();
  };

  const isUpcoming = (discount: DiscountCode) => {
    if (!discount.startDate) return false;
    return new Date(discount.startDate) > new Date();
  };

  const getStatusBadge = (discount: DiscountCode) => {
    if (isExpired(discount)) {
      return <Badge variant="outline" className="text-gray-500">Expired</Badge>;
    }
    if (isUpcoming(discount)) {
      return <Badge variant="outline" className="text-blue-500">Upcoming</Badge>;
    }
    if (!discount.isActive) {
      return <Badge variant="outline" className="text-yellow-600">Inactive</Badge>;
    }
    if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
      return <Badge variant="outline" className="text-orange-500">Used Up</Badge>;
    }
    return <Badge className="bg-green-500 text-white">Active</Badge>;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discount Codes ({filteredDiscounts.length})
          </CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDiscounts.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No discount codes found</h3>
            <p className="text-muted-foreground">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first discount code to get started'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="hidden sm:table-cell">Uses</TableHead>
                  <TableHead className="hidden lg:table-cell">Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {discount.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyCode(discount.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="font-medium">{discount.name}</span>
                      {discount.minPurchase > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Min: ${discount.minPurchase}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {discount.type === 'PERCENTAGE' ? (
                          <>
                            <Percent className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold">{discount.value}%</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold">${discount.value}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {discount.usedCount}
                          {discount.maxUses > 0 && ` / ${discount.maxUses}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(discount.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(discount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(discount.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyCode(discount.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleActive(discount.id, !discount.isActive)}>
                            {discount.isActive ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(discount.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
      </CardContent>
    </Card>
  );
}
