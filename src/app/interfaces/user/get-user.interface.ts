export interface GetUser {
  id: number;
  fullName: string;
  documento: string;
  email: string;
  roles: string[];
  enable: boolean;
  created_at: Date;
  lastPasswordChangeAt: Date;
}
