export type UserRole = 
  | 'ADMIN' 
  | 'FARMER' 
  | 'EXPORTER' 
  | 'LOGISTICS' 
  | 'IMPORTER' 
  | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
