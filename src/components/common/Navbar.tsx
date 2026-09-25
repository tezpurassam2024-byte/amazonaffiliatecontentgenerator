import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  HelpCircle,
  BookOpen,
  DollarSign,
  Info,
  Mail,
  Zap,
  Calendar,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  user: UserProfile | null;
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentRoute,
  onRouteChange,
  onLogout,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = (route: string) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isCurrent = (route: string) => currentRoute === route;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          onClick={() => navigate(user ? 'dashboard' : 'landing')}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white shadow-md shadow-orange-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Affi<span className="text-orange-600">Genius</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:block">
              Amazon Content AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {user ? (
            <>
              <button
                onClick={() => navigate('dashboard')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('dashboard')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('generator')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('generator')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="h-4 w-4 text-orange-500" />
                New Article
              </button>
              <button
                onClick={() => navigate('my-articles')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('my-articles')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                My Articles
              </button>
              <button
                onClick={() => navigate('settings')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('settings')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Settings
              </button>
              {user.is_admin && (
                <button
                  onClick={() => navigate('admin')}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isCurrent('admin')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  Admin
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('features')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('features')
                    ? 'text-orange-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => navigate('pricing')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('pricing')
                    ? 'text-orange-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('blog')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('blog') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => navigate('faq')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('faq') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => navigate('about')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('about') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                About
              </button>
              <button
                onClick={() => navigate('contact')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent('contact') ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => navigate('appointment')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isCurrent('appointment')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-orange-600 hover:bg-orange-50/80 hover:text-orange-700'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 text-orange-600" />
                Book Appointment
              </button>
            </>
          )}
        </div>

        {/* Right CTA / User controls */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-2 transition-all hover:bg-slate-100"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                  <span className="text-[10px] font-medium text-orange-600">
                    {user.generations_used}/{user.generations_limit} gens
                  </span>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-900">{user.email}</p>
                    <p className="text-[11px] capitalize text-slate-500">Plan: {user.plan}</p>
                  </div>
                  <button
                    onClick={() => navigate('generator')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <PlusCircle className="h-4 w-4 text-orange-500" />
                    New Generator Session
                  </button>
                  <button
                    onClick={() => navigate('settings')}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    Affiliate & API Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('generator')}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-600/30 transition-all hover:bg-orange-700 active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Generate Content
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="mb-2 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="mt-1 text-[11px] font-semibold text-orange-600">
                  {user.generations_used} / {user.generations_limit} Generations Used ({user.plan})
                </p>
              </div>
              <button
                onClick={() => navigate('dashboard')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('generator')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-orange-600 hover:bg-orange-50"
              >
                + New Article
              </button>
              <button
                onClick={() => navigate('my-articles')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Articles
              </button>
              <button
                onClick={() => navigate('settings')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Settings
              </button>
              {user.is_admin && (
                <button
                  onClick={() => navigate('admin')}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Admin Panel
                </button>
              )}
              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('features')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features
              </button>
              <button
                onClick={() => navigate('pricing')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('blog')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Blog
              </button>
              <button
                onClick={() => navigate('faq')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                FAQ
              </button>
              <button
                onClick={() => navigate('about')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                About
              </button>
              <button
                onClick={() => navigate('contact')}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Contact
              </button>
              <button
                onClick={() => navigate('appointment')}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-orange-600 hover:bg-orange-50"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('generator')}
                  className="w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                >
                  Generate Content
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
