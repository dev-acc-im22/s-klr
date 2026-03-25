'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Percent, 
  Clock, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface ProgramSettings {
  id: string;
  commissionRate: number;
  cookieDuration: number;
  isActive: boolean;
  totalAffiliates: number;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
}

export function AffiliateProgramSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [program, setProgram] = useState<ProgramSettings | null>(null);
  const [commissionRate, setCommissionRate] = useState(10);
  const [cookieDuration, setCookieDuration] = useState(30);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function fetchProgram() {
      try {
        const response = await fetch('/api/affiliates/program');
        const data = await response.json();
        setProgram(data.program);
        setCommissionRate(data.program.commissionRate);
        setCookieDuration(data.program.cookieDuration);
        setIsActive(data.program.isActive);
      } catch (error) {
        console.error('Failed to fetch program:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/affiliates/program', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commissionRate,
          cookieDuration,
          isActive,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgram(data);
        toast({
          title: 'Settings saved',
          description: 'Your affiliate program settings have been updated.',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Program Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Program Settings
            </CardTitle>
            <CardDescription>
              Configure your affiliate program commission and tracking
            </CardDescription>
          </div>
          {program && (
            <Badge variant={program.isActive ? 'default' : 'secondary'}>
              {program.isActive ? 'Active' : 'Inactive'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Commission Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="commission" className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              Commission Rate
            </Label>
            <span className="text-lg font-semibold">{commissionRate}%</span>
          </div>
          <Slider
            id="commission"
            min={1}
            max={50}
            step={1}
            value={[commissionRate]}
            onValueChange={(value) => setCommissionRate(value[0])}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            The percentage affiliates earn on each sale they refer
          </p>
        </div>

        {/* Cookie Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="cookie" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Cookie Duration
            </Label>
            <span className="text-lg font-semibold">{cookieDuration} days</span>
          </div>
          <Slider
            id="cookie"
            min={1}
            max={90}
            step={1}
            value={[cookieDuration]}
            onValueChange={(value) => setCookieDuration(value[0])}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            How long after a click the affiliate gets credit for a sale
          </p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              {isActive ? (
                <ToggleRight className="h-4 w-4 text-green-500" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              )}
              Program Status
            </Label>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? 'Your affiliate program is accepting new affiliates'
                : 'Your affiliate program is paused'}
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>

        {/* Program Stats */}
        {program && (
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Affiliates</p>
              <p className="text-2xl font-bold">{program.totalAffiliates}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{program.totalClicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">{program.totalConversions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${program.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Warning if inactive */}
        {!isActive && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Program is paused</p>
              <p className="text-sm text-yellow-700">
                Affiliates cannot generate new links or earn commissions while the program is paused.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
