'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { UserProfile, UserType } from '@/lib/types/database'

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  userType: UserType | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userType: UserType) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!error && data) {
      setUserProfile(data)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Redirect based on user type
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('email', email)
      .single()
    
    if (profile?.user_type === 'employer') {
      router.push('/dashboard/employer')
    } else if (profile?.user_type === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard')
    }
  }

  const signUp = async (email: string, password: string, userType: UserType = 'job_seeker') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
        },
      },
    })
    if (error) throw error

    // The user profile will be created automatically by the database trigger
    // but we can update the user type if needed
    if (data.user) {
      await supabase
        .from('user_profiles')
        .update({ user_type: userType })
        .eq('user_id', data.user.id)
    }

    router.push('/onboarding')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUserProfile(null)
    router.push('/')
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  const userType = userProfile?.user_type || null

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userProfile, 
        userType,
        loading, 
        signIn, 
        signUp, 
        signOut,
        refreshProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}