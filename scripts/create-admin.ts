import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db/connect";
import { getEnv } from "../src/lib/env";
import AdminUser from "../src/models/AdminUser";

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = getEnv();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await AdminUser.findOne({ email });

  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await AdminUser.create({
    email,
    name: "Site Administrator",
    passwordHash,
    isActive: true,
  });

  console.log(`Created admin user: ${email}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
