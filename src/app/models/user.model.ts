export class User {
  constructor(
    public email: string,
    public fullName: string,
    public roles: string[],
    public id: number,
    public documento: string,
    public avatar?: string,
    public createdAt?: Date,
    public lastPasswordChangeAt?: Date,
    public enabled?: boolean,
    public username?: string
  ) {}
}
