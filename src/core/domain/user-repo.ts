import { User } from "@/core/domain/user";
import { db } from "@/db";

export class UserRepo {
  async findFirst(): Promise<User | null> {
    const user = db.query.users.findFirst();
    if (!user) {
      return null;
    }
    return new User(user);
  }
}
