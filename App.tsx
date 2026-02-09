import React, { useState, useEffect } from 'react'

import Store from './components/Store/Store';
import CartDrawer from './components/Store/CartDrawer';
import Checkout from './components/Store/Checkout';
import OrderSuccess from './components/Store/OrderSuccess';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LandingPage } from './components/Landing/LandingPage'
import { AuthForm } from './components/Auth/AuthForm'
import { ProfileSetup } from './components/Profile/ProfileSetup'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { Dashboard } from './components/Dashboard/Dashboard'
import { AIChat } from './components/Chat/AIChat'
import { WhyJoin } from './components/Sections/WhyJoin'
import { About } from './components/Sections/About'
import { Community } from './components/Sections/Community'
import { Resources } from './components/Sections/Resources'
import { Scoreboard } from './components/Sections/Scoreboard'
import { Profile } from './components/Sections/Profile'
import { Points } from './components/Sections/Points'
import { Trainers } from './components/Sections/Trainers'
import { Rewards } from './components/Sections/Rewards'
import { MessageCircle } from 'lucide-react'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showLanding, setShowLanding] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [chatOpen, setChatOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    // Auto-open chat for new users after profile setup
    if (profile?.profile_completed && profile.total_points === 0) {
      setTimeout(() => setChatOpen(true), 2000)
    }
  }, [profile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600">
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  if (!user && showLanding) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLanding(false)
          setAuthMode('signup')
        }}
        onSignIn={() => {
          setShowLanding(false)
          setAuthMode('signin')
        }}
      />
    )
  }

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onModeChange={setAuthMode}
        onBack={() => setShowLanding(true)}
      />
    )
  }

  if (!profile?.profile_completed) {
    return <ProfileSetup />
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'why-join':
        return <WhyJoin />
      case 'about':
        return <About />
      case 'community':
        return <Community />
      case 'resources':
        return <Resources />
      case 'scoreboard':
        return <Scoreboard />
      case 'profile':
        return <Profile />
      case 'points':
        return <Points />
      case 'trainers':
        return <Trainers />
      case 'rewards':
        return <Rewards />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="pt-4 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {renderActiveSection()}
        </div>
      </main>

      {/* Cart Button */}
      <button onClick={()=> setCartOpen(true)} className="fixed bottom-20 right-6 p-4 bg-gray-800/80 text-white rounded-full shadow-lg z-40">Cart</button>
      <CartDrawer onCheckout={()=> window.location.href='/checkout'} />

      {/* AI Chat Button */}
      <button
        onClick={() => setChatOpen(true)}

        className="fixed bottom-6 right-6 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 hover:scale-110 animate-pulse"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* AI Chat Modal */}
      <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App