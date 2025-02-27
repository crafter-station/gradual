import { User } from '@/core/domain/user';
import { db } from '@/db';

export class UserRepo {
  async findFirst(): Promise<User | null> {
    const user = await db.query.user.findFirst();
    if (!user) {
      return null;
    }
    return new User(user.id, user.fullname, user.email, user.avatarUrl);
  }
}
