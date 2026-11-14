import "dotenv/config";
import { Pool } from "pg";
import argon2 from "argon2";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Starting database seeding...");

    await client.query(`
      INSERT INTO roles (name) VALUES 
      ('SUPER_ADMIN'), 
      ('ADMIN'), 
      ('WAREHOUSE_STAFF'), 
      ('DRIVER')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log("Roles seeded successfully.");

    const roleResult = await client.query(
      "SELECT id FROM roles WHERE name = 'SUPER_ADMIN'",
    );
    const superAdminRoleId = roleResult.rows[0].id;

    const plainPassword = "SuperSecretPassword123!";
    const passwordHash = await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const adminEmail = "admin@routeflow.com";
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail],
    );

    if (existingUser.rows.length === 0) {
      await client.query(
        `
        INSERT INTO users (name, email, password_hash, role_id, status)
        VALUES ($1, $2, $3, $4, 'ACTIVE');
      `,
        ["System Super Admin", adminEmail, passwordHash, superAdminRoleId],
      );
    } else {
      console.log("Super Admin account already exists. Skipping creation.");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("error in sending");
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
