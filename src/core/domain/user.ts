export class User {
  constructor(
    private _id: string,
    private _fullname: string,
    private _email: string,
    private _avatarUrl: string
  ) {}

  get id(): string {
    return this._id;
  }

  get fullname(): string {
    return this._fullname;
  }

  get email(): string {
    return this._email;
  }

  get avatarUrl(): string {
    return this._avatarUrl;
  }
}
