import { prisma } from "./src/builder";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const utils = {
  userExist: async (userId: string) => {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    return user;
  },
  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 10);
  },
  comparePassword: async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  },
  generateToken: async (id: string, role: string, email: string) => {
    const maxAge = 3 * 60 * 60;
    return jwt.sign(
      {
        id,
        email,
        role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: maxAge,
      }
    );
  },
};

export default utils
