import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Calendar, Database, Sparkles } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';
import { AppointmentBookingForm } from '../components/common/AppointmentBookingForm';
import { localDb } from '../lib/convex';

interface ContactPageProps {
  initialTab?: 'appointment' | 'message';
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialTab = 'appointment' }) => {
  const [activeTab, setActiveTab] = useState<'appointment' | 'message'>(initialTab);

  // Message form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Log message submission
    localDb.addLog('info', `Contact form inquiry submitted by ${name} (${email}): ${subject}`);
    setSubmitted(true);
  };

  return (
    <div className="bg-white pb-20">
      {/* Header Banner */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-14 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Get in Touch & Consultations
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Book an Appointment or Contact Support
          </h1>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Schedule a 1-on-1 strategy call saved directly into our Convex database, or send us a general message.
          </p>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex rounded-xl bg-slate-200/70 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('appointment')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'appointment'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Book an Appointment
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('message')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'message'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              General Inquiries
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        {activeTab === 'appointment' ? (
          <div>
            <AppointmentBookingForm />
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-xs">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-4 text-base font-bold text-emerald-950">Message Received!</h3>
                <p className="mt-2 text-xs text-emerald-800">
                  Thank you for reaching out. Our support team typically responds within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setSubject('');
                  }}
                  className="mt-6 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-800">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">Topic / Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Custom plan / API query"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with your affiliate publishing workflow?"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        )}

        <div className="pt-8">
          <AdSlot placement="in-content" />
        </div>
      </div>
    </div>
  );
};
