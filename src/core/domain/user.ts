export class User {
  constructor(private userRecord: any) {}

  get id(): string {
    return this.userRecord.id;
  }

  get name(): string {
    return this.userRecord.name;
  }

  get email(): string {
    return this.userRecord.email;
  }

  get avatarUrl(): string {
    return this.userRecord.avatarUrl;
  }
}
