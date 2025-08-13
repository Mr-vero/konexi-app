export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enhanced Database Types for Job Portal
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          user_type: 'job_seeker' | 'employer' | 'admin'
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          location: string | null
          avatar_url: string | null
          resume_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          bio: string | null
          skills: string[] | null
          experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
          desired_salary_min: number | null
          desired_salary_max: number | null
          is_open_to_work: boolean
          profile_visibility: 'public' | 'private' | 'employers_only'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_type?: 'job_seeker' | 'employer' | 'admin'
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          desired_salary_min?: number | null
          desired_salary_max?: number | null
          is_open_to_work?: boolean
          profile_visibility?: 'public' | 'private' | 'employers_only'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_type?: 'job_seeker' | 'employer' | 'admin'
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          desired_salary_min?: number | null
          desired_salary_max?: number | null
          is_open_to_work?: boolean
          profile_visibility?: 'public' | 'private' | 'employers_only'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          logo_url: string | null
          industry: string | null
          size: 'startup' | 'small' | 'medium' | 'large' | null
          location: string | null
          founded_year: number | null
          culture_images: string[] | null
          benefits: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          industry?: string | null
          size?: 'startup' | 'small' | 'medium' | 'large' | null
          location?: string | null
          founded_year?: number | null
          culture_images?: string[] | null
          benefits?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          industry?: string | null
          size?: 'startup' | 'small' | 'medium' | 'large' | null
          location?: string | null
          founded_year?: number | null
          culture_images?: string[] | null
          benefits?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'companies_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      jobs: {
        Row: {
          id: string
          company_id: string | null
          posted_by: string
          title: string
          description: string
          requirements: string | null
          responsibilities: string | null
          location: string
          location_type: 'remote' | 'onsite' | 'hybrid'
          job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
          experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
          salary_min: number | null
          salary_max: number | null
          salary_currency: string | null
          benefits: string[] | null
          skills_required: string[] | null
          education_required: string | null
          application_deadline: string | null
          is_active: boolean
          view_count: number
          application_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          posted_by: string
          title: string
          description: string
          requirements?: string | null
          responsibilities?: string | null
          location: string
          location_type?: 'remote' | 'onsite' | 'hybrid'
          job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          benefits?: string[] | null
          skills_required?: string[] | null
          education_required?: string | null
          application_deadline?: string | null
          is_active?: boolean
          view_count?: number
          application_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          posted_by?: string
          title?: string
          description?: string
          requirements?: string | null
          responsibilities?: string | null
          location?: string
          location_type?: 'remote' | 'onsite' | 'hybrid'
          job_type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          benefits?: string[] | null
          skills_required?: string[] | null
          education_required?: string | null
          application_deadline?: string | null
          is_active?: boolean
          view_count?: number
          application_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_posted_by_fkey'
            columns: ['posted_by']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      applications: {
        Row: {
          id: string
          job_id: string
          applicant_id: string
          cover_letter: string | null
          resume_url: string | null
          status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          notes: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'applications_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'applications_applicant_id_fkey'
            columns: ['applicant_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          saved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'saved_jobs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'saved_jobs_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          search_query: string | null
          filters: Json | null
          is_active: boolean
          created_at: string
          last_sent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          search_query?: string | null
          filters?: Json | null
          is_active?: boolean
          created_at?: string
          last_sent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          search_query?: string | null
          filters?: Json | null
          is_active?: boolean
          created_at?: string
          last_sent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'job_alerts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'application_update' | 'new_job_alert' | 'interview_scheduled' | 'message'
          title: string
          message: string
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'application_update' | 'new_job_alert' | 'interview_scheduled' | 'message'
          title: string
          message: string
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'application_update' | 'new_job_alert' | 'interview_scheduled' | 'message'
          title?: string
          message?: string
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_job_view_count: {
        Args: {
          job_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
      experience_level: 'entry' | 'mid' | 'senior' | 'executive'
      location_type: 'remote' | 'onsite' | 'hybrid'
      user_type: 'job_seeker' | 'employer' | 'admin'
      application_status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
      company_size: 'startup' | 'small' | 'medium' | 'large'
      notification_type: 'application_update' | 'new_job_alert' | 'interview_scheduled' | 'message'
      profile_visibility: 'public' | 'private' | 'employers_only'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type Application = Database['public']['Tables']['applications']['Row']
export type SavedJob = Database['public']['Tables']['saved_jobs']['Row']
export type JobAlert = Database['public']['Tables']['job_alerts']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Insert types
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type SavedJobInsert = Database['public']['Tables']['saved_jobs']['Insert']
export type JobAlertInsert = Database['public']['Tables']['job_alerts']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// Update types
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']
export type SavedJobUpdate = Database['public']['Tables']['saved_jobs']['Update']
export type JobAlertUpdate = Database['public']['Tables']['job_alerts']['Update']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

// Enum types
export type JobType = Database['public']['Enums']['job_type']
export type ExperienceLevel = Database['public']['Enums']['experience_level']
export type LocationType = Database['public']['Enums']['location_type']
export type UserType = Database['public']['Enums']['user_type']
export type ApplicationStatus = Database['public']['Enums']['application_status']
export type CompanySize = Database['public']['Enums']['company_size']
export type NotificationType = Database['public']['Enums']['notification_type']
export type ProfileVisibility = Database['public']['Enums']['profile_visibility']

// Extended types with relationships
export type JobWithCompany = Job & {
  company: Company | null
  posted_by_profile: UserProfile
}

export type ApplicationWithJob = Application & {
  job: Job
  applicant: UserProfile
}

export type UserProfileWithStats = UserProfile & {
  job_count?: number
  application_count?: number
}