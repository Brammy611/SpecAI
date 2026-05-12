"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = `${process.env.DATABASE_URL}`;
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter: new adapter_pg_1.PrismaPg(new pg_1.Pool({ connectionString })),
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
