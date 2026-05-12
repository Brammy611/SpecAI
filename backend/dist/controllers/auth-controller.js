"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// Zod schemas for validation
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username minimal 3 karakter"),
    email: zod_1.z.string().email("Format email tidak valid"),
    password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: zod_1.z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"]
});
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, "Username/Email wajib diisi"), // Bisa email atau username
    password: zod_1.z.string().min(1, "Password wajib diisi")
});
const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        // Cek apakah email/username sudah dipakai
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email: validatedData.email }, { username: validatedData.username }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email atau Username sudah digunakan" });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(validatedData.password, salt);
        const user = await prisma_1.prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                passwordHash
            }
        });
        res.status(201).json({ message: "Registrasi berhasil", userId: user.id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.register = register;
const login = async (req, res) => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }]
            }
        });
        if (!user) {
            return res.status(401).json({ error: "Kredensial tidak valid" });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Kredensial tidak valid" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "7d"
        });
        res.json({
            message: "Login berhasil",
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.login = login;
const getMe = async (req, res) => {
    try {
        // req.user di-set oleh authMiddleware
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, createdAt: true }
        });
        if (!user)
            return res.status(404).json({ error: "User tidak ditemukan" });
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan internal" });
    }
};
exports.getMe = getMe;
