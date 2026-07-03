import postgres from 'postgres';

export const sql = postgres(process.env.DATABASE_URL, {
  max: 10,
  ssl: { rejectUnauthorized: false },  // Supabase requires SSL
});
