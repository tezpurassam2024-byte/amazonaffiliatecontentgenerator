import React, { useState } from 'react';
import {
  Shield,
  Users,
  FileText,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  Check,
  AlertCircle,
  Clock,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Globe,
  Calendar,
  Mail,
  Phone,
  Database,
  ExternalLink,
} from 'lucide-react';
import { AdminMetrics, MarketplaceId, UserProfile, AppointmentBooking } from '../types';
import { localDb, CONVEX_CLOUD_URL, convexClient } from '../lib/convex';
import { SUPPORTED_MARKETPLACES } from '../lib/amazon';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'users' | 'usage' | 'templates' | 'settings' | 'logs'>('overview');
  const [appointments, setAppointments] = useState<AppointmentBooking[]>(() => localDb.getAppointments());
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [freeLimit, setFreeLimit] = useState(5);
  const [proLimit, setProLimit] = useState(50);
  const [businessLimit, setBusinessLimit] = useState(250);
  const [planSaved, setPlanSaved] = useState(false);

  // Legal pages editable state (Section 52)
  const [legalDisclosure, setLegalDisclosure] = useState(
    'CERTAIN CONTENT THAT APPEARS ON THIS SITE COMES FROM AMAZON SERVICES LLC OR ITS AFFILIATES. THIS CONTENT IS PROVIDED \'AS IS\' AND IS SUBJECT TO CHANGE OR REMOVAL AT ANY TIME. As an Amazon Associate, publishers earn from qualifying purchases.'
  );
  const [legalDisclaimer, setLegalDisclaimer] = useState(
    'AffiGenius provides editorial assistance software. We do not guarantee search engine rankings or affiliate earnings. Always inspect generated content before publication.'
  );
  const [legalSaved, setLegalSaved] = useState(false);

  // Manage mock users
  const [userList, setUserList] = useState<UserProfile[]>([
    localDb.getUser(),
    {
      id: 'usr_2',
      name: 'Sarah Chen',
      email: 'sarah.affiliate@gmail.com',
      plan: 'business',
      generations_used: 142,
      generations_limit: 250,
      amazon_associate_tag: 'chenreviews-20',
      default_marketplace: 'com',
      created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'usr_3',
      name: 'Marcus Brody',
      email: 'marcus@techroundup.co.uk',
      plan: 'pro',
      generations_used: 28,
      generations_limit: 50,
      amazon_associate_tag: 'roundupuk-21',
      default_marketplace: 'co.uk',
      created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'usr_4',
      name: 'Priya Sharma',
      email: 'priya@indiagadgets.in',
      plan: 'free',
      generations_used: 4,
      generations_limit: 5,
      amazon_associate_tag: 'gadgetsin-31',
      default_marketplace: 'in',
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
  ]);

  const logs = localDb.getLogs();
  const articles = localDb.getArticles();

  const metrics: AdminMetrics = {
    total_users: userList.length + 138,
    new_users_today: 9,
    total_articles: articles.length + 380,
    total_generations: articles.length + 512,
    generations_this_month: 215,
    top_categories: [
      { category: 'Electronics & Audio', count: 184 },
      { category: 'Laptops & Computers', count: 122 },
      { category: 'E-Readers & Office', count: 68 },
      { category: 'Smart Home & IoT', count: 54 },
      { category: 'Cameras & Video', count: 42 },
    ],
    top_marketplaces: [
      { marketplace: 'Amazon US (.com)', count: 240 },
      { marketplace: 'Amazon India (.in)', count: 98 },
      { marketplace: 'Amazon UK (.co.uk)', count: 85 },
      { marketplace: 'Amazon Germany (.de)', count: 45 },
    ],
    recent_logs: logs.length
      ? logs
      : [
          {
            id: 'log_1',
            timestamp: new Date().toISOString(),
            type: 'info',
            message: 'Netlify Function generate-content invoked successfully for ASIN B09XS7JWHH',
          },
          {
            id: 'log_2',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'info',
            message: 'User plan validation succeeded: Plan tier Pro',
          },
        ],
  };

  const handleSavePlanLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanSaved(true);
    localDb.addLog('info', `Admin updated plan limits: Free=${freeLimit}, Pro=${proLimit}, Business=${businessLimit}`);
    setTimeout(() => setPlanSaved(false), 2000);
  };

  const handleSaveLegal = (e: React.FormEvent) => {
    e.preventDefault();
    setLegalSaved(true);
    localDb.addLog('info', 'Admin updated legal pages disclosures and terms');
    setTimeout(() => setLegalSaved(false), 2000);
  };

  const handleChangePlan = (userId: string, newPlan: 'free' | 'pro' | 'business') => {
    const limits = { free: freeLimit, pro: proLimit, business: businessLimit };
    setUserList(
      userList.map((u) =>
        u.id === userId ? { ...u, plan: newPlan, generations_limit: limits[newPlan] } : u
      )
    );
    localDb.addLog('info', `Admin changed plan for user ${userId} to ${newPlan}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Administrator Center
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                System telemetry, user limits, usage auditing, and platform configurations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs (Section 49: Overview, Users, Usage, Templates, Settings, System Logs) */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setAppointments(localDb.getAppointments());
              setActiveTab('appointments');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Users ({userList.length})
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'usage'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Usage & Limits
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Settings & Legal
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            System Logs
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Users</span>
                <p className="mt-2 text-2xl font-bold text-slate-900">{metrics.total_users}</p>
                <span className="mt-1 text-[11px] font-medium text-emerald-600">
                  +{metrics.new_users_today} joined today
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Generations</span>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {metrics.total_generations}
                </p>
                <span className="mt-1 text-[11px] text-slate-400">Lifetime runs</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">This Month Runs</span>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {metrics.generations_this_month}
                </p>
                <span className="mt-1 text-[11px] text-indigo-600">Active monthly</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Database Articles</span>
                <p className="mt-2 text-2xl font-bold text-slate-900">{metrics.total_articles}</p>
                <span className="mt-1 text-[11px] text-slate-400">PostgreSQL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Top Product Categories</h3>
                <div className="mt-4 space-y-3">
                  {metrics.top_categories.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{c.category}</span>
                      <span className="font-bold text-slate-900">{c.count} articles</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Top Regional Marketplaces</h3>
                <div className="mt-4 space-y-3">
                  {metrics.top_marketplaces.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{m.marketplace}</span>
                      <span className="font-bold text-slate-900">{m.count} articles</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: APPOINTMENTS (Convex Backend) */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Convex Backend Info Card */}
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/30 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        Appointments & Strategy Calls
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        <Database className="h-3 w-3 text-emerald-600" />
                        Convex Table: appointments
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Whenever someone books through the consultation form, records are saved directly in your Convex backend.
                    </p>
                  </div>
                </div>

                <a
                  href="#appointment"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-orange-600" />
                  Test Booking Form
                </a>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-1.5">
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => {
                  const isSelected = appointmentFilter === st;
                  const count =
                    st === 'all'
                      ? appointments.length
                      : appointments.filter((a) => a.status === st).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAppointmentFilter(st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Convex URL: {CONVEX_CLOUD_URL}
              </span>
            </div>

            {/* Appointments List */}
            {appointments.filter((a) => appointmentFilter === 'all' || a.status === appointmentFilter).length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <h4 className="mt-3 text-sm font-bold text-slate-800">
                  No appointments found for filter "{appointmentFilter}"
                </h4>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  When visitors submit the appointment booking form, their records will automatically appear here from your Convex backend.
                </p>
                <a
                  href="#appointment"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
                >
                  <Calendar className="h-3.5 w-3.5" /> Book an Appointment Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((a) => appointmentFilter === 'all' || a.status === appointmentFilter)
                  .map((apt) => {
                    const aptId = apt.id || apt._id || 'temp';
                    return (
                      <div
                        key={aptId}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-extrabold text-slate-900">
                                {apt.name}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : apt.status === 'completed'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : apt.status === 'cancelled'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {apt.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                Convex ID: {aptId}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-orange-600">
                              {apt.service_type}
                            </p>
                          </div>

                          {/* Quick Status Updater */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Status:</span>
                            <select
                              value={apt.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as AppointmentBooking['status'];
                                localDb.updateAppointmentStatus(aptId, newStatus);
                                setAppointments(localDb.getAppointments());
                              }}
                              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete appointment record for ${apt.name}?`)) {
                                  localDb.deleteAppointment(aptId);
                                  setAppointments(localDb.getAppointments());
                                }
                              }}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete appointment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div className="rounded-xl bg-slate-50 p-2.5">
                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                              Date & Time
                            </span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {apt.date} · {apt.time_slot}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {apt.timezone || 'UTC'}
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-2.5">
                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                              Email Contact
                            </span>
                            <p className="font-semibold text-slate-800 mt-0.5 truncate">
                              {apt.email}
                            </p>
                            <a
                              href={`mailto:${apt.email}`}
                              className="text-[10px] text-orange-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="h-2.5 w-2.5" /> Send Email
                            </a>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-2.5">
                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                              Phone / WhatsApp
                            </span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {apt.phone || 'None provided'}
                            </p>
                            {apt.phone && (
                              <span className="text-[10px] text-slate-500">Direct contact</span>
                            )}
                          </div>

                          <div className="rounded-xl bg-slate-50 p-2.5">
                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                              Tag / Website
                            </span>
                            <p className="font-semibold text-slate-800 mt-0.5 truncate">
                              {apt.company || 'None provided'}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              Booked {new Date(apt.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                            <span className="font-semibold text-slate-700">Client Agenda Notes: </span>
                            <span className="text-slate-600">{apt.notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: USERS */}
        {activeTab === 'users' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registered Publishers ({userList.length})</h3>
                <p className="text-xs text-slate-500">Manage user quotas, roles, and plan memberships</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500">
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Store Tag</th>
                    <th className="py-3 px-4 font-semibold">Marketplace</th>
                    <th className="py-3 px-4 font-semibold">Quota Usage</th>
                    <th className="py-3 px-4 font-semibold">Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {u.amazon_associate_tag || 'none'}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-slate-700">
                        {u.default_marketplace}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {u.generations_used} / {u.generations_limit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.plan}
                          onChange={(e) => handleChangePlan(u.id, e.target.value as any)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro ($29)</option>
                          <option value="business">Business ($79)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: USAGE & LIMITS */}
        {activeTab === 'usage' && (
          <form
            onSubmit={handleSavePlanLimits}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configurable Plan Generation Quotas</h3>
              <p className="text-xs text-slate-500">
                Adjust monthly article generation limits across all tiers
              </p>
            </div>

            {planSaved && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                <Check className="h-4 w-4" /> Quotas saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-800">Free Tier</h4>
                <div className="mt-3">
                  <label className="text-[11px] text-slate-500">Articles / Month</label>
                  <input
                    type="number"
                    value={freeLimit}
                    onChange={(e) => setFreeLimit(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-orange-200 bg-orange-50/20 p-4">
                <h4 className="text-xs font-bold text-orange-900">Pro Tier ($29/mo)</h4>
                <div className="mt-3">
                  <label className="text-[11px] text-slate-500">Articles / Month</label>
                  <input
                    type="number"
                    value={proLimit}
                    onChange={(e) => setProLimit(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50/20 p-4">
                <h4 className="text-xs font-bold text-indigo-900">Business Tier ($79/mo)</h4>
                <div className="mt-3">
                  <label className="text-[11px] text-slate-500">Articles / Month</label>
                  <input
                    type="number"
                    value={businessLimit}
                    onChange={(e) => setBusinessLimit(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                Save Quotas
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Prompt & Content Categories</h3>
                <p className="text-xs text-slate-500">Supported niche templates and prompt engineering profiles</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: 'Amazon Affiliate Marketing', promptDesc: 'High-converting buyer intent focus with FTC disclosures' },
                { name: 'Product Reviews (In-Depth)', promptDesc: '1,000 - 2,000 word deep dive with technical specs and verdict' },
                { name: 'SEO & Rich Snippet Optimizer', promptDesc: 'Schema-first structured markup and FAQPage JSON-LD' },
                { name: 'Product Comparisons', promptDesc: 'Category-vital matrix contrasting up to 4 models' },
                { name: 'Content Marketing & Social', promptDesc: 'Platform-optimized threads for X, Facebook, LinkedIn, Pinterest' },
                { name: 'Affiliate Tools & Plugins', promptDesc: 'Gutenberg blocks, plain text, and Markdown exports' },
              ].map((t, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-bold text-indigo-700">{t.name}</span>
                  <p className="mt-1 text-xs text-slate-600">{t.promptDesc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: SETTINGS & LEGAL (Section 52) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveLegal} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Legal Pages & Disclosure Manager</h3>
              <p className="text-xs text-slate-500">
                Edit default legal text for the public Affiliate Disclosure and Earnings Disclaimer
              </p>
            </div>

            {legalSaved && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                <Check className="h-4 w-4" /> Legal statements updated successfully!
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Mandatory Amazon Associate Statement
              </label>
              <textarea
                rows={3}
                value={legalDisclosure}
                onChange={(e) => setLegalDisclosure(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Earnings & Results Disclaimer
              </label>
              <textarea
                rows={3}
                value={legalDisclaimer}
                onChange={(e) => setLegalDisclaimer(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                Save Legal Texts
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: SYSTEM LOGS */}
        {activeTab === 'logs' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">System Logs & Event Telemetry</h3>
            <p className="text-xs text-slate-500">Recent server function invocations and audit events</p>

            <div className="mt-4 divide-y divide-slate-100">
              {metrics.recent_logs.map((lg) => (
                <div key={lg.id} className="flex items-start justify-between py-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                    <div>
                      <p className="font-mono text-slate-800">{lg.message}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(lg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      lg.type === 'error'
                        ? 'bg-rose-50 text-rose-700'
                        : lg.type === 'warn'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lg.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
