import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required('JWT_SECRET', 'change-this-workshop-secret'),
  db: {
    host: required('DB_HOST', '127.0.0.1'),
    port: Number(process.env.DB_PORT ?? 3306),
    name: required('DB_NAME', 'campus_ai'),
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD ?? ''
  },
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  chatModel: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
  embedModel: process.env.OPENAI_EMBED_MODEL ?? 'text-embedding-3-small',
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
};
