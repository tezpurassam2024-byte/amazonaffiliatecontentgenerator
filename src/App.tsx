import React, { useState, useEffect } from 'react';
import { UserProfile, Article, AmazonProduct } from './types';
import { localDb } from './lib/convex';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyArticlesPage } from './pages/MyArticlesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { LegalPage } from './pages/LegalPage';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => localDb.getUser());
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [presetProduct, setPresetProduct] = useState<AmazonProduct | null>(null);

  // Sync route with browser hash for easy bookmarking and refresh support
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setCurrentRoute(hash);
    };

    if (window.location.hash) {
      handleHash();
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const handleStartGenerator = (prod?: AmazonProduct) => {
    if (prod) {
      setPresetProduct(prod);
    } else {
      setPresetProduct(null);
    }
    navigate('generator');
  };

  const handleSelectArticle = (art: Article) => {
    setPresetProduct(art.product);
    navigate('generator');
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    const updated = localDb.updateUser(updates);
    setUser(updated);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans antialiased">
      {/* Navigation */}
      <Navbar
        user={user}
        currentRoute={currentRoute}
        onRouteChange={navigate}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'landing' && (
          <LandingPage
            onStartGenerator={handleStartGenerator}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'generator' && (
          <GeneratorPage
            initialProduct={presetProduct}
            onArticleSaved={() => {
              // updated in localDb
            }}
          />
        )}

        {currentRoute === 'dashboard' && user && (
          <DashboardPage
            user={user}
            onNavigate={navigate}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {currentRoute === 'my-articles' && user && (
          <MyArticlesPage
            onNavigate={navigate}
            onOpenArticle={handleSelectArticle}
          />
        )}

        {currentRoute === 'settings' && user && (
          <SettingsPage user={user} onUpdateUser={handleUpdateUser} />
        )}

        {currentRoute === 'admin' && user?.is_admin && <AdminPage />}

        {currentRoute === 'features' && (
          <FeaturesPage onStart={() => handleStartGenerator()} />
        )}

        {currentRoute === 'pricing' && (
          <PricingPage
            onSelectPlan={(plan) => {
              if (user) {
                handleUpdateUser({ plan: plan as any });
                alert(`Your plan has been updated to ${plan.toUpperCase()}!`);
                navigate('dashboard');
              } else {
                setAuthModalOpen(true);
              }
            }}
          />
        )}

        {currentRoute === 'blog' && <BlogPage />}

        {currentRoute === 'faq' && <FAQPage />}

        {currentRoute === 'about' && <AboutPage />}

        {currentRoute === 'contact' && <ContactPage />}

        {(currentRoute === 'appointment' || currentRoute === 'booking') && (
          <AppointmentPage onNavigate={navigate} />
        )}

        {(currentRoute === 'privacy' ||
          currentRoute === 'terms' ||
          currentRoute === 'affiliate-disclosure' ||
          currentRoute === 'disclaimer') && (
          <LegalPage initialTab={currentRoute as any} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          navigate('dashboard');
        }}
      />
    </div>
  );
}
