import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { 
  Activity, 
  Users, 
  Trophy, 
  TrendingUp, 
  Heart,
  Target,
  Clock,
  Calendar
} from 'lucide-react'

export function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    totalActivities: 0,
    communityMembers: 0,
    weeklyPoints: 0,
    currentStreak: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user activities
      const { data: activities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentActivities(activities || [])

      // Fetch community count
      const { count: communityCount } = await supabase
        .from('communities')
        .select('*', { count: 'exact' })

      // Calculate weekly points
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const { data: weeklyPointsData } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', profile?.id)
        .gte('created_at', oneWeekAgo.toISOString())

      const weeklyPoints = weeklyPointsData?.reduce((sum, item) => sum + item.points, 0) || 0

      setStats({
        totalActivities: activities?.length || 0,
        communityMembers: communityCount || 0,
        weeklyPoints,
        currentStreak: Math.floor(Math.random() * 7) + 1 // Mock streak for demo
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    let greeting = 'Good morning'
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon'
    else if (hour >= 17) greeting = 'Good evening'

    const firstName = profile?.full_name?.split(' ')[0] || 'there'
    return `${greeting}, ${firstName}!`
  }

  const getBMIStatus = () => {
    if (!profile?.bmi) return null
    
    const bmi = profile.bmi
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (bmi < 25) return { status: 'Healthy', color: 'text-green-600', bg: 'bg-green-100' }
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { status: 'Obese', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getPersonalizedTips = () => {
    const tips = []
    
    if (profile?.gender === 'female') {
      tips.push('💪 Consider cycle syncing your workouts for optimal results')
      tips.push('🌸 Track your menstrual cycle to align nutrition and exercise')
    } else if (profile?.gender === 'male') {
      tips.push('💪 Focus on compound movements for maximum muscle engagement')
      tips.push('🏋️ Progressive overload is key for strength development')
    }

    const bmiStatus = getBMIStatus()
    if (bmiStatus?.status === 'Underweight') {
      tips.push('🍽️ Focus on caloric surplus with nutrient-dense foods')
    } else if (bmiStatus?.status === 'Overweight') {
      tips.push('🏃 Combine cardio with strength training for best results')
    }

    tips.push('💧 Stay hydrated - aim for 8 glasses of water daily')
    tips.push('😴 Quality sleep is crucial for recovery and wellness')
    
    return tips.slice(0, 3) // Return top 3 tips
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  const bmiStatus = getBMIStatus()
  const personalizedTips = getPersonalizedTips()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h2>
        <p className="opacity-90 mb-4">
          Ready to continue your wellness journey? Let's make today count!
        </p>
        
        {bmiStatus && (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bmiStatus.bg} ${bmiStatus.color} bg-opacity-20 text-white`}>
            <Heart className="h-4 w-4 mr-1" />
            BMI: {profile?.bmi} ({bmiStatus.status})
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.total_points || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.weeklyPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Communities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.communityMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Tips & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personalized Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personalized Tips
            </h3>
          </div>
          
          <div className="space-y-3">
            {personalizedTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Log Workout</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">+10 pts</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Track Meditation</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm">+5 pts</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Join Community</span>
              </div>
              <span className="text-purple-600 dark:text-purple-400 text-sm">+15 pts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Progress
          </h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {/* Goal Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                {profile?.fitness_goal?.replace('_', ' ') || 'Wellness Goal'}
              </span>
              <span className="text-gray-900 dark:text-white font-medium">65%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          {/* Activity Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Weekly Activity</span>
              <span className="text-gray-900 dark:text-white font-medium">4/7 days</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}