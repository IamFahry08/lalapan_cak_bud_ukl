import { Injectable, OnModuleDestroy, INestApplication, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const isCloudDb = connectionString?.includes('neon.tech') || connectionString?.includes('supabase') || connectionString?.includes('sslmode=require');
        
        const pool = new Pool({
            connectionString,
            ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
        });
        const adapter = new PrismaPg(pool);
        
        super({ adapter });
    }

    async onModuleInit(){
        await this.$connect();
    }
}
