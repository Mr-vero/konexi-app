export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          title: string
          company_name: string
          description: string
          location: string
          job_type: 'Full-Time' | 'Part-Time' | 'Contract'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company_name: string
          description: string
          location: string
          job_type: 'Full-Time' | 'Part-Time' | 'Contract'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company_name?: string
          description?: string
          location?: string
          job_type?: 'Full-Time' | 'Part-Time' | 'Contract'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_type: 'Full-Time' | 'Part-Time' | 'Contract'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}