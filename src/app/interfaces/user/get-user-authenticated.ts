export interface GetUserAuthenticated {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  enable: boolean;
  avatar: string;
  created_at: Date;
  lastPasswordChangeAt: Date;
}
