import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import React, { Suspense } from 'react';

const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./pages/TermsConditions'));
const FoodProcessing = React.lazy(() => import('./pages/FoodProcessing'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Services = React.lazy(() => import('./pages/Services'));
const Admin = React.lazy(() => import('./pages/Admin'));

const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-navy-900 z-50">
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border-2 border-white/60 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white/60 rounded-sm" />
        </div>
        <div>
          <span className="text-white text-xl font-bold tracking-tight">PRINTWORK</span>
          <span className="text-white/40 text-[10px] ml-1 tracking-[0.2em] uppercase">Indonesia</span>
        </div>
      </div>
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <LoadingFallback />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <PageTransition>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/ProductDetail" element={<ProductDetail />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/FoodProcessing" element={<FoodProcessing />} />
          <Route path="/Portfolio" element={<Portfolio />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
