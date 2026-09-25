import React from 'react';
import { AppointmentBookingForm } from '../components/common/AppointmentBookingForm';
import { Calendar, CheckCircle2, Clock, ShieldCheck, Sparkles, Video, Users, Database } from 'lucide-react';
import { CONVEX_CLOUD_URL } from '../lib/convex';

interface AppointmentPageProps {
  onNavigate?: (route: string) => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-14 sm:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-700 border border-orange-200 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            Direct 1-on-1 Consultation & Platform Demo
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Book an Appointment with Our Affiliate Specialists
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you want a guided platform walkthrough, custom API integration, or an SEO content audit for your Amazon affiliate sites, schedule a time that fits your calendar.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Video className="h-4 w-4 text-orange-600" /> 1-on-1 Google Meet / Zoom
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-orange-600" /> 30 - 60 Minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Database className="h-4 w-4 text-emerald-600" /> Convex Cloud Backend Synced
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Appointment Booking Form */}
          <div className="lg:col-span-8">
            <AppointmentBookingForm />
          </div>

          {/* Sidebar Info & Trust Badges */}
          <div className="lg:col-span-4 space-y-6">
            {/* Convex Connection Status Card */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Convex Backend Live</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                All appointment records submitted through this form are instantly committed to your Convex Cloud tables:
              </p>
              <div className="mt-3 rounded-xl bg-slate-900 p-3 text-[11px] text-slate-200 font-mono space-y-1">
                <div className="text-emerald-400 font-bold">convex/schema.ts</div>
                <div className="text-slate-400">table: appointments</div>
                <div className="text-slate-400">table: logs</div>
                <div className="text-slate-500 text-[10px] break-all pt-1 border-t border-slate-800">
                  {CONVEX_CLOUD_URL}
                </div>
              </div>
            </div>

            {/* What to Expect Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-600" />
                What We Will Cover
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span>Interactive demonstration of the AI content generator workflow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span>How to pass Google helpful content guidelines & Amazon Associate TOS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span>Bulk batch content creation, JSON-LD Schema, and comparison charts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span>API access and custom export workflows for WordPress/Webflow.</span>
                </li>
              </ul>
            </div>

            {/* Need instant help */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Have a Quick Question?
              </h4>
              <p className="mt-2 text-xs text-slate-600">
                If you prefer sending a quick message instead of booking a call:
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('contact')}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Go to Contact Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
