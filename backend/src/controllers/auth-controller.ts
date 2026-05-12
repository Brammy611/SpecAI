import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Zod schemas for validation
const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Username/Email wajib diisi"), // Bisa email atau username
  password: z.string().min(1, "Password wajib diisi")
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Cek apakah email/username sudah dipakai
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validatedData.email }, { username: validatedData.username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email atau Username sudah digunakan" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash
      }
    });

    res.status(201).json({ message: "Registrasi berhasil", userId: user.id });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? "Input tidak valid" });
    }
    console.error("[/api/auth/register] Error:", error);
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({
        error: "Terjadi kesalahan internal",
        detail: error?.message ? String(error.message) : String(error),
      });
    }
    res.status(500).json({ error: "Terjadi kesalahan internal" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? "Input tidak valid" });
    }
    console.error("[/api/auth/login] Error:", error);
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({
        error: "Terjadi kesalahan internal",
        detail: error?.message ? String(error.message) : String(error),
      });
    }
    res.status(500).json({ error: "Terjadi kesalahan internal" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user di-set oleh authMiddleware
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan internal" });
  }
};
