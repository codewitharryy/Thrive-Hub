import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Loader, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChat({ isOpen, onClose }: ChatProps) {
  const { profile, user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat()
      setIsInitialized(true)
    }
  }, [isOpen, isInitialized])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    // Load previous messages
    if (user) {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20)

      if (data && data.length > 0) {
        const formattedMessages = data.flatMap(msg => [
          { type: 'user', content: msg.message, timestamp: msg.created_at },
          ...(msg.response ? [{ type: 'ai', content: msg.response, timestamp: msg.created_at }] : [])
        ])
        setMessages(formattedMessages)
      } else {
        // Show welcome message for new users
        const welcomeMessage = getPersonalizedWelcome()
        setMessages([{ type: 'ai', content: welcomeMessage, timestamp: new Date().toISOString() }])
      }
    }
  }

  const getPersonalizedWelcome = () => {
    const firstName = profile?.full_name?.split(' ')[0] || 'there'
    const gender = profile?.gender
    const goal = profile?.fitness_goal?.replace('_', ' ')
    const bmi = profile?.bmi

    let welcome = `Hi ${firstName}! I'm your AI wellness coach. I'm here to help you on your journey! 🌟\n\n`

    if (goal) {
      welcome += `I see your goal is ${goal}. That's fantastic! `
    }

    if (bmi) {
      if (bmi < 18.5) {
        welcome += `With your current BMI of ${bmi}, I can suggest some great strategies for healthy weight gain and muscle building. `
      } else if (bmi > 25) {
        welcome += `With your current BMI of ${bmi}, I can help you create a sustainable plan for healthy weight management. `
      } else {
        welcome += `Your BMI of ${bmi} is in the healthy range - great job! I can help you maintain this and work toward your fitness goals. `
      }
    }

    if (gender === 'female') {
      welcome += `\n\n💃 As a woman, I can provide cycle-synced workout suggestions and nutrition tips that align with your hormonal patterns. `
    } else if (gender === 'male') {
      welcome += `\n\n💪 I can suggest male-focused workout routines and nutrition strategies optimized for your goals. `
    }

    welcome += `\n\nWhat would you like to talk about today? I can help with:\n• Workout recommendations\n• Nutrition advice\n• Stress management\n• Sleep optimization\n• Motivation tips\n\nJust ask me anything! 😊`

    return welcome
  }

  const generateAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
    const gender = profile?.gender
    const goal = profile?.fitness_goal
    const bmi = profile?.bmi
    const activityLevel = profile?.activity_level

    // Workout-related responses
    if (message.includes('workout') || message.includes('exercise') || message.includes('training')) {
      if (gender === 'female') {
        return `🏋️‍♀️ Here are some great workout suggestions for you!\n\nBased on your profile, I recommend:\n\n**Upper Body (Week 1-2 of cycle):**\n• Push-ups: 3 sets of 8-12\n• Dumbbell rows: 3 sets of 10-15\n• Shoulder presses: 3 sets of 8-12\n\n**Lower Body (Week 3 of cycle):**\n• Squats: 3 sets of 12-15\n• Lunges: 3 sets of 10 per leg\n• Glute bridges: 3 sets of 15-20\n\n**Active Recovery (Week 4):**\n• Yoga or light stretching\n• 20-30 min walks\n• Swimming or gentle cycling\n\n${bmi && bmi > 25 ? 'Focus on compound movements and add 20-30 min cardio after strength training!' : 'Add some cardio 2-3x per week for heart health!'}\n\nWould you like me to create a specific weekly plan for you?`
      } else if (gender === 'male') {
        return `💪 Let's build that strength! Here's a solid workout plan:\n\n**Push Day:**\n• Bench press: 4 sets of 6-8\n• Overhead press: 3 sets of 8-10\n• Dips: 3 sets of 10-12\n• Push-ups: 2 sets to failure\n\n**Pull Day:**\n• Pull-ups/Rows: 4 sets of 6-10\n• Lat pulldowns: 3 sets of 8-12\n• Bicep curls: 3 sets of 10-15\n\n**Leg Day:**\n• Squats: 4 sets of 6-8\n• Deadlifts: 3 sets of 5-6\n• Lunges: 3 sets of 10 per leg\n• Calf raises: 4 sets of 15-20\n\n${goal === 'muscle_building' ? 'Focus on progressive overload - increase weight by 2.5-5lbs when you can complete all sets!' : 'Mix in some cardio 2-3x per week for overall health!'}\n\nNeed help with form tips or nutrition to support your workouts?`
      } else {
        return `🏃‍♀️ Great question about workouts! Here's a balanced routine:\n\n**Full Body Workout (3x/week):**\n• Squats: 3 sets of 10-15\n• Push-ups: 3 sets of 8-12\n• Rows: 3 sets of 10-12\n• Planks: 3 sets of 30-60 seconds\n• Walking lunges: 2 sets of 10 per leg\n\n**Cardio Days:**\n• 30-45 min walking/jogging\n• Dance or cycling\n• Swimming\n\nStart with what feels comfortable and gradually increase intensity. Listen to your body!\n\nWhat type of exercises do you enjoy most?`
      }
    }

    // Nutrition-related responses
    if (message.includes('diet') || message.includes('nutrition') || message.includes('food') || message.includes('meal')) {
      const bmiAdvice = bmi && bmi < 18.5 
        ? 'Focus on calorie-dense, nutritious foods like nuts, avocados, and protein shakes to gain healthy weight.'
        : bmi && bmi > 25
        ? 'Create a moderate calorie deficit with plenty of protein, vegetables, and whole grains for sustainable weight loss.'
        : 'Maintain a balanced diet with adequate protein, healthy fats, and complex carbohydrates.'

      return `🥗 Nutrition is so important! Here's what I recommend:\n\n**Daily Essentials:**\n• Protein: ${gender === 'male' ? '1.6-2.2g per kg body weight' : '1.2-1.8g per kg body weight'}\n• Water: 8-10 glasses daily\n• Fruits & vegetables: 5-9 servings\n\n**Sample Meal Plan:**\n**Breakfast:** Oatmeal with berries and nuts\n**Snack:** Greek yogurt with honey\n**Lunch:** Grilled chicken salad with quinoa\n**Snack:** Apple with almond butter\n**Dinner:** Salmon with sweet potato and broccoli\n\n${bmiAdvice}\n\n${gender === 'female' ? 'During your period, increase iron-rich foods like spinach, lean meat, and legumes!' : ''}\n\nWant me to suggest specific recipes or meal prep ideas?`
    }

    // Stress/mental health responses
    if (message.includes('stress') || message.includes('anxiety') || message.includes('mental') || message.includes('tired') || message.includes('overwhelmed')) {
      return `💙 I understand - stress management is crucial for overall wellness. Here are some strategies:\n\n**Immediate Relief:**\n• Deep breathing: 4-7-8 technique (inhale 4, hold 7, exhale 8)\n• 5-minute meditation or mindfulness\n• Quick walk outside\n\n**Daily Habits:**\n• Morning routine: 10 min meditation or journaling\n• Regular exercise (even 15-20 min helps!)\n• Consistent sleep schedule\n• Limit caffeine and screen time before bed\n\n**Professional Life:**\n• Time blocking for tasks\n• Take regular breaks (Pomodoro technique)\n• Set boundaries with work hours\n\n${profile?.profession?.toLowerCase().includes('student') ? 'As a student, also try: study groups, campus counseling services, and breaking large projects into smaller tasks.' : ''}\n\nRemember: It's okay to ask for help. Consider talking to a counselor if stress feels overwhelming.\n\nWhat's your biggest stress trigger right now?`
    }

    // Sleep-related responses
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return `😴 Quality sleep is essential! Here's how to improve it:\n\n**Sleep Hygiene:**\n• Same bedtime/wake time daily (even weekends!)\n• Cool, dark room (60-67°F)\n• No screens 1 hour before bed\n• Comfortable mattress and pillows\n\n**Evening Routine:**\n• Dim lights 2 hours before bed\n• Light stretching or reading\n• Herbal tea (chamomile, passionflower)\n• Gratitude journaling\n\n**What to Avoid:**\n• Caffeine after 2 PM\n• Large meals 3 hours before bed\n• Intense exercise close to bedtime\n• Alcohol (disrupts sleep quality)\n\n**Natural Sleep Aids:**\n• Magnesium supplement\n• Melatonin (consult doctor first)\n• White noise or earplugs\n\nAim for 7-9 hours nightly. Your body repairs and recovers during sleep - it's when the magic happens!\n\nAre you having trouble falling asleep or staying asleep?`
    }

    // Motivation/encouragement
    if (message.includes('motivated') || message.includes('give up') || message.includes('hard') || message.includes('difficult') || message.includes('discouraged')) {
      return `🌟 I believe in you! Every wellness journey has ups and downs - that's completely normal.\n\n**Remember:**\n• Progress isn't always linear\n• Small steps lead to big changes\n• You've already started - that's huge!\n• Every healthy choice matters\n\n**Quick Motivation Boosters:**\n• Set micro-goals (drink one extra glass of water today)\n• Celebrate small wins\n• Find an accountability buddy\n• Track progress (not just weight - energy, mood, sleep!)\n• Remember your 'why'\n\n**Your Journey So Far:**\n• You created a profile ✓\n• You're asking questions ✓\n• You're committed to change ✓\n\nThat's already more than most people do! ${profile?.total_points ? `Plus, you've earned ${profile.total_points} points!` : ''}\n\n${goal ? `Your goal of ${goal.replace('_', ' ')} is absolutely achievable. Let's break it down into smaller steps.` : ''}\n\nWhat's one small thing you could do today to move forward?`
    }

    // Period/women's health
    if ((message.includes('period') || message.includes('menstrual') || message.includes('cycle')) && gender === 'female') {
      return `🌸 Cycle syncing can really optimize your wellness! Here's how:\n\n**Menstrual Phase (Days 1-5):**\n• Light movement: yoga, walking, stretching\n• Iron-rich foods: spinach, lean meat, beans\n• Rest and recovery focus\n\n**Follicular Phase (Days 1-13):**\n• Try new workouts - your energy is building!\n• Great time for strength training\n• Focus on fresh, light foods\n\n**Ovulatory Phase (Days 14):**\n• Peak energy - perfect for HIIT or challenging workouts\n• Social activities and group fitness\n• Anti-inflammatory foods\n\n**Luteal Phase (Days 15-28):**\n• Strength training and pilates\n• Complex carbs for serotonin\n• Self-care and stress management\n\n**PMS Support:**\n• Magnesium and B6 supplements\n• Reduce caffeine and sugar\n• Gentle movement and heating pads\n\nTracking your cycle can help you work WITH your body, not against it!\n\nWould you like specific workout or nutrition recommendations for where you are in your cycle?`
    }

    // Default response
    const responses = [
      `That's a great question! Based on your profile, I'd love to help you with that. Could you tell me more about what specifically you'd like to know about ${goal ? `regarding your ${goal.replace('_', ' ')} goal` : 'your wellness journey'}?`,
      `I'm here to support your wellness journey! Whether it's about workouts, nutrition, stress management, or motivation - I've got you covered. What's on your mind today?`,
      `Thanks for reaching out! I can help with personalized advice for fitness, nutrition, mental wellness, and more. What would you like to focus on right now?`
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    const userMessage = newMessage.trim()
    setNewMessage('')
    setLoading(true)

    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }])

    try {
      // Generate AI response
      const aiResponse = generateAIResponse(userMessage)

      // Add AI response to UI
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }])

      // Save to database
      if (user) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          message: userMessage,
          response: aiResponse
        })

        // Award points for interaction
        await supabase.from('user_points').insert({
          user_id: user.id,
          points: 2,
          source: 'ai_chat',
          description: 'AI chat interaction'
        })
      }
    } catch (error) {
      console.error('Error in chat:', error)
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again!',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Bot className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Wellness Coach</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your personal wellness assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%]`}>
                {message.type === 'ai' && (
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex-shrink-0">
                    <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex-shrink-0">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                  <Loader className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me about workouts, nutrition, stress management..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}