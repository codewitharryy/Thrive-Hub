import React, { useState } from 'react'
import { 
  Heart, 
  Users, 
  Trophy, 
  Brain,
  Activity,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Shield,
  Target,
  Award,
  TrendingUp,
  MessageCircle,
  BookOpen,
  UserCheck
} from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Wellness Coach',
      description: 'Get personalized recommendations based on your unique profile, goals, and progress.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with like-minded individuals and professional trainers on your wellness journey.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Target,
      title: 'Goal-Oriented Plans',
      description: 'Customized fitness and wellness plans tailored to your specific objectives.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Trophy,
      title: 'Gamified Experience',
      description: 'Earn points, unlock achievements, and compete with friends to stay motivated.',
      color: 'from-yellow-500 to-orange-600'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '95%', label: 'Success Rate', icon: TrendingUp },
    { number: '24/7', label: 'AI Support', icon: MessageCircle },
    { number: '1000+', label: 'Resources', icon: BookOpen }
  ]

  const benefits = [
    'Personalized AI wellness coaching',
    'Gender-specific health guidance',
    'Professional trainer access',
    'Mental health support',
    'Nutrition planning',
    'Progress tracking',
    'Community challenges',
    'Reward system'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 dark:from-emerald-400/5 dark:to-teal-400/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium animate-bounce-subtle">
                  <Zap className="h-4 w-4 mr-2" />
                  AI-Powered Wellness Platform
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Wellness Journey</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join thousands of students and professionals who've revolutionized their health with our AI-driven platform. Get personalized plans, expert guidance, and community support.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onSignIn}
                  className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 flex items-center justify-center"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-emerald-600 mr-2" />
                  Secure & Private
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-emerald-600 mr-2" />
                  4.9/5 Rating
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Feature Showcase */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <div className="space-y-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          activeFeature === index
                            ? 'bg-gradient-to-r ' + feature.color + ' text-white transform scale-105'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setActiveFeature(index)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            activeFeature === index ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              activeFeature === index ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${
                              activeFeature === index ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {feature.title}
                            </h3>
                            <p className={`text-sm ${
                              activeFeature === index ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Wellness Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools, guidance, and support you need to achieve your health and fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join our community today and take the first step towards a healthier, happier you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Your Journey
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200 flex items-center justify-center">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}