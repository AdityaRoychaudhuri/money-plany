import { sql } from "./db.js";


export default async function initDB() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`


    await sql`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM (
          'EXPENSE',
          'INCOME'
        );
        EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `

    await sql`
      DO $$ BEGIN
      CREATE TYPE transaction_category AS ENUM (
        'FOOD',
        'TRANSPORT',
        'RENT',
        'BILL',
        'SHOPPING',
        'GROCERY',
        'ENTERTAINMENT',
        'EDUCATION',
        'HEALTH',
        'MISC'
      );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      type transaction_type NOT NULL,
      category transaction_category,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_created
      ON transactions(user_id, created_at DESC);
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_category
      ON transactions(user_id, category);
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_created_at
      ON transactions(created_at DESC);
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_type
      on transactions(user_id, type);
    `

    console.log("Database initialised successfully");
  } catch (error) {
    console.error("Error initializing database: "+error);
    process.exit(1);
  }  
}