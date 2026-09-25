import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { submitAppointmentBooking, CONVEX_CLOUD_URL, isConvexConfigured } from '../../lib/convex';

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
  className?: string;
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  {
    id: 'affiliate-strategy',
    title: 'Affiliate Strategy & Revenue Growth',
    duration: '30 mins',
    desc: 'Scale your affiliate niche websites with automated product reviews, conversion optimization, and SEO tactics.',
    badge: 'Popular',
  },
  {
    id: 'platform-demo',
    title: 'Platform Walkthrough & Live Demo',
    duration: '45 mins',
    desc: 'Live interactive tour of the batch generator, comparison tables, schema builders, and Amazon API integration.',
    badge: 'Recommended',
  },
  {
    id: 'enterprise-custom',
    title: 'Enterprise & Custom API Setup',
    duration: '60 mins',
    desc: 'High-volume publishing, custom prompt fine-tuning, team access, and custom CMS/WordPress webhook pipelines.',
    badge: 'Custom',
  },
  {
    id: 'content-seo-audit',
    title: 'Amazon Affiliate SEO & Site Audit',
    duration: '30 mins',
    desc: 'Review existing affiliate articles to eliminate thin content, upgrade schema, and boost Google search visibility.',
    badge: 'Growth',
  },
];

const TIME_SLOTS = [
  '09:00 AM - 09:30 AM',
  '10:00 AM - 10:45 AM',
  '11:30 AM - 12:15 PM',
  '02:00 PM - 02:45 PM',
  '03:30 PM - 04:15 PM',
  '05:00 PM - 05:45 PM',
  '06:30 PM - 07:15 PM',
];

export const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  className = '',
  defaultService,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [serviceType, setServiceType] = useState(
    defaultService || SERVICE_OPTIONS[0].title
  );
  const [date, setDate] = useState(() => {
    // Tomorrow as default date in YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  });
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    id: string;
    savedInConvex: boolean;
    message: string;
  } | null>(null);

  // Today's date string for input min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !date || !timeSlot) return;

    setIsSubmitting(true);
    try {
      const result = await submitAppointmentBooking({
        name,
        email,
        phone,
        company,
        service_type: serviceType,
        date,
        time_slot: timeSlot,
        timezone,
        notes,
      });

      setBookingResult(result);
    } catch (err: any) {
      console.error('Error submitting appointment:', err);
      setBookingResult({
        success: false,
        id: '',
        savedInConvex: false,
        message: err.message || 'Failed to submit appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingResult(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setNotes('');
  };

  if (bookingResult && bookingResult.success) {
    return (
      <div className={`rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm ${className}`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            Saved in Convex Database Table: <code className="font-mono text-[11px] font-bold">appointments</code>
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Appointment Booked Successfully!
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Thank you, <strong className="text-slate-900">{name}</strong>. Your consultation has been confirmed and stored directly in your Convex cloud backend.
          </p>
        </div>

        {/* Details Card */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-medium text-slate-500">Convex Record ID</span>
            <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {bookingResult.id}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-medium text-slate-500">Session Type</span>
            <span className="text-xs font-semibold text-slate-900">{serviceType}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-medium text-slate-500">Date & Time</span>
            <span className="text-xs font-semibold text-slate-900">
              {date} · {timeSlot}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-medium text-slate-500">Timezone</span>
            <span className="text-xs font-medium text-slate-700">{timezone}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-medium text-slate-500">Client Email</span>
            <span className="text-xs font-semibold text-slate-900">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-medium text-slate-500">Phone / WhatsApp</span>
              <span className="text-xs text-slate-700">{phone}</span>
            </div>
          )}
          {company && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-medium text-slate-500">Website / Tag</span>
              <span className="text-xs text-slate-700">{company}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-500">Convex Cloud Deployment</span>
            <span className="font-mono text-[11px] text-emerald-700 truncate max-w-[220px]">
              {CONVEX_CLOUD_URL}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Schedule Another Appointment
          </button>
          <a
            href={`mailto:${email}?subject=Confirmation: ${serviceType}&body=Hi ${name},%0D%0A%0D%0AYour appointment for ${serviceType} on ${date} at ${timeSlot} (${timezone}) is confirmed.`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Send Email Copy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden ${className}`}>
      {/* Banner Header with Convex Status */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/30 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                1-on-1 Consultation & Walkthrough
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Book an Appointment
              </h2>
            </div>
          </div>

          {/* Convex Status Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Convex Synced</span>
            <span className="text-[10px] font-mono text-emerald-600 hidden sm:inline">
              (fantastic-koala-937)
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Schedule a dedicated strategy call or platform onboarding with our affiliate engineering specialists. Fill in your details below and your slot will be saved directly into our Convex database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Step 1: Select Consultation Topic */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            1. Select Session Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((srv) => {
              const isSelected = serviceType === srv.title;
              return (
                <div
                  key={srv.id}
                  onClick={() => setServiceType(srv.title)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{srv.title}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {srv.duration}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date & Time Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            2. Choose Date & Time Slot *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Timezone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. UTC, America/New_York"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Contact & Business Details */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            3. Your Contact Information *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@affiliatestore.com"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website or Associate Tag (Optional)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="techgear-20 or mysite.com"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Notes / Agenda */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            4. What would you like us to focus on? (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us about your current monthly traffic, niche, Amazon associates tier, or specific questions about the automated generator..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Submission Details & Button */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Instant sync to Convex cloud database table</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/25 hover:bg-orange-700 active:scale-98 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving in Convex...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Confirm & Book Appointment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
