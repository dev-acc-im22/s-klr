'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useHydrated } from '@/components/providers/HydrationProvider';
import Link from 'next/link';
import { format, addDays, startOfDay, isSameDay, isBefore, setHours, setMinutes } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Check,
  Video,
  ChevronLeft,
  Star,
  Shield,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock coaching packages for public booking
const coachingPackages = [
  {
    id: 'pkg-strategy',
    name: 'Strategy Session',
    description: 'Deep dive into your business strategy with actionable recommendations and a clear roadmap.',
    duration: 60,
    price: 99,
    features: [
      '60-minute video call',
      'Strategy review',
      'Action plan',
      'Follow-up summary',
    ],
    popular: true,
  },
  {
    id: 'pkg-quick',
    name: 'Quick Consultation',
    description: 'A focused session to address specific questions and get quick actionable advice.',
    duration: 30,
    price: 49,
    features: [
      '30-minute video call',
      'Q&A format',
      'Quick recommendations',
    ],
    popular: false,
  },
  {
    id: 'pkg-monthly',
    name: 'Monthly Coaching',
    description: 'Ongoing support with 4 dedicated sessions per month plus priority access.',
    duration: 60,
    price: 299,
    pricePeriod: 'month',
    features: [
      '4 sessions per month',
      'Priority scheduling',
      'Email support',
      'Session recordings',
    ],
    popular: false,
  },
];

// Mock creator profile
const mockCreatorProfile = {
  name: 'Alex Creator',
  username: 'alexcreator',
  title: 'Business Strategist & Content Coach',
  bio: 'Helping creators and entrepreneurs build profitable online businesses. Over 10 years of experience in digital marketing and content strategy. Let\'s work together to achieve your goals!',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  rating: 4.9,
  reviewCount: 127,
  sessionCount: 500,
};

// Generate available time slots for a given date
function generateTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  const baseDate = startOfDay(date);

  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(format(setHours(setMinutes(baseDate, 0), hour), 'h:mm a'));
    if (hour < 17) {
      slots.push(format(setHours(setMinutes(baseDate, 30), hour), 'h:mm a'));
    }
  }

  return slots;
}

// Mock booked slots (for demo)
const bookedSlots: { date: Date; time: string }[] = [
  { date: addDays(new Date(), 1), time: '10:00 AM' },
  { date: addDays(new Date(), 1), time: '2:00 PM' },
  { date: addDays(new Date(), 2), time: '11:00 AM' },
  { date: addDays(new Date(), 3), time: '9:00 AM' },
  { date: addDays(new Date(), 3), time: '3:00 PM' },
];

type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';

export default function BookingPage() {
  const params = useParams();
  // Username is available for future use when fetching real user data
  void params.username;

  const mounted = useHydrated();

  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedPackage, setSelectedPackage] = useState<typeof coachingPackages[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTimeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const isTimeSlotAvailable = (date: Date, time: string) => {
    return !bookedSlots.some(
      (slot) => isSameDay(slot.date, date) && slot.time === time
    );
  };

  const handleSelectPackage = (pkg: typeof coachingPackages[0]) => {
    setSelectedPackage(pkg);
    setCurrentStep('datetime');
  };

  const handleSelectDateTime = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('details');
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setCurrentStep('confirmation');
  };

  const handleBack = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('service');
    } else if (currentStep === 'details') {
      setCurrentStep('datetime');
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const day = date.getDay();
    const isPast = isBefore(date, startOfDay(new Date()));
    const isWeekend = day === 0 || day === 6;
    return isPast || isWeekend;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-blue-100 rounded-2xl" />
            <div className="h-48 bg-blue-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-bold text-primary text-lg">CreatorHub</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure Booking</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Creator Profile Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400" />
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10">
              <Avatar className="size-20 border-4 border-white shadow-lg">
                <AvatarImage src={mockCreatorProfile.avatar} alt={mockCreatorProfile.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                  {mockCreatorProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-foreground">{mockCreatorProfile.name}</h1>
                <p className="text-muted-foreground">{mockCreatorProfile.title}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{mockCreatorProfile.rating}</span>
                  <span className="text-muted-foreground">({mockCreatorProfile.reviewCount})</span>
                </div>
                <div className="text-muted-foreground">
                  {mockCreatorProfile.sessionCount}+ sessions
                </div>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground text-center sm:text-left">
              {mockCreatorProfile.bio}
            </p>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {(['service', 'datetime', 'details', 'confirmation'] as BookingStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    'size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    currentStep === step || (currentStep === 'confirmation' && index <= 3) ||
                    (currentStep === 'details' && index <= 2) ||
                    (currentStep === 'datetime' && index <= 1)
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      'w-8 sm:w-16 h-0.5 mx-1',
                      (currentStep === 'confirmation' && index <= 2) ||
                      (currentStep === 'details' && index <= 1) ||
                      (currentStep === 'datetime' && index === 0)
                        ? 'bg-blue-600'
                        : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 sm:gap-12 mt-2 text-xs sm:text-sm text-muted-foreground">
            <span className={currentStep === 'service' ? 'text-blue-600 font-medium' : ''}>Service</span>
            <span className={currentStep === 'datetime' ? 'text-blue-600 font-medium' : ''}>Date & Time</span>
            <span className={currentStep === 'details' ? 'text-blue-600 font-medium' : ''}>Details</span>
            <span className={currentStep === 'confirmation' ? 'text-blue-600 font-medium' : ''}>Confirm</span>
          </div>
        </div>

        {/* Service Selection */}
        {currentStep === 'service' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Choose Your Service</h2>
              <p className="text-muted-foreground mt-1">Select the coaching package that fits your needs</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {coachingPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-lg hover:border-blue-300',
                    pkg.popular && 'border-blue-400 ring-2 ring-blue-100'
                  )}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {pkg.popular && (
                    <div className="bg-blue-600 text-white text-xs font-medium py-1 text-center">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                      {pkg.pricePeriod ? (
                        <span className="text-muted-foreground">/{pkg.pricePeriod}</span>
                      ) : (
                        <span className="text-muted-foreground">/session</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration} minutes</span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                      Select
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time Selection */}
        {currentStep === 'datetime' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Select Date & Time</h2>
                <p className="text-muted-foreground">Choose when you'd like to meet</p>
              </div>
            </div>

            {/* Selected Service Summary */}
            {selectedPackage && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{selectedPackage.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackage.duration} min · ${selectedPackage.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Available Times
                  </CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                      : 'Select a date first'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((time) => {
                        const available = isTimeSlotAvailable(selectedDate, time);
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            disabled={!available}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              selectedTime === time && 'bg-blue-600 hover:bg-blue-700'
                            )}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Please select a date to see available times</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!selectedDate || !selectedTime}
                onClick={handleSelectDateTime}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Client Details Form */}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Details</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
              </div>
            </div>

            {/* Booking Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{selectedPackage?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackage?.duration} min · ${selectedPackage?.price}
                    </p>
                  </div>
                </div>
                <Separator className="my-4 bg-blue-200" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{selectedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="notes"
                      placeholder="What would you like to discuss during the session?"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="pl-10 min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Payment will be collected after confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a secure payment link via email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!clientName || !clientEmail}
                onClick={handleSubmitBooking}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming...</span>
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="space-y-6">
            <Card className="text-center py-8">
              <CardContent className="space-y-6">
                <div className="size-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mt-1">
                    You're all set for your session with {mockCreatorProfile.name}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-6 max-w-md mx-auto text-left space-y-4">
                  <div className="flex items-center gap-4">
                    <Video className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{selectedPackage?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPackage?.duration} minutes
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedTime}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Confirmation sent to</p>
                      <p className="text-sm text-muted-foreground">{clientEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>What's next?</strong> Check your email for a calendar invite and payment link.
                    You'll also receive a reminder 24 hours before your session.
                  </p>
                </div>

                <div className="pt-4">
                  <Button asChild size="lg">
                    <Link href="/">
                      Return to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t bg-white/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <Link href="/" className="font-semibold text-primary hover:underline">
              CreatorHub
            </Link>
            {' '}· Create your own coaching page
          </p>
        </div>
      </footer>
    </div>
  );
}
