import { User } from "@/core/domain/user";

export interface UserRepo {
  findFirst(): Promise<User>
};