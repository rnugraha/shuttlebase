import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const members = [
  {
    firstName: "Alice",
    lastName: "Tan",
    email: "alice.tan@example.com",
    phone: "0411111111",
    pronoun: "she/her",
    dob: new Date("1995-03-12"),
    address: "12 Maple St, Sydney",
    level: "ADVANCED",
    status: "ACTIVE",
    paymentStatus: "PAID",
    paidAt: new Date("2026-01-10"),
  },
  {
    firstName: "Bob",
    lastName: "Nguyen",
    email: "bob.nguyen@example.com",
    phone: "0422222222",
    pronoun: "he/him",
    dob: new Date("1990-07-24"),
    address: "5 Oak Ave, Melbourne",
    level: "INTERMEDIATE",
    status: "ACTIVE",
    paymentStatus: "PAID",
    paidAt: new Date("2026-01-15"),
  },
  {
    firstName: "Carol",
    lastName: "Smith",
    email: "carol.smith@example.com",
    phone: "0433333333",
    pronoun: "she/her",
    dob: new Date("2000-11-03"),
    address: "88 Pine Rd, Brisbane",
    level: "BEGINNER",
    status: "ACTIVE",
    paymentStatus: "UNPAID",
    paidAt: null,
  },
  {
    firstName: "David",
    lastName: "Lee",
    email: "david.lee@example.com",
    phone: "0444444444",
    pronoun: "he/him",
    dob: new Date("1988-05-19"),
    address: "3 Cedar Ln, Perth",
    level: "ADVANCED",
    status: "INACTIVE",
    paymentStatus: "OVERDUE",
    paidAt: null,
  },
  {
    firstName: "Eva",
    lastName: "Martinez",
    email: "eva.martinez@example.com",
    phone: "0455555555",
    pronoun: "she/her",
    dob: new Date("1998-09-30"),
    address: "21 Birch Blvd, Adelaide",
    level: "INTERMEDIATE",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paidAt: null,
  },
  {
    firstName: "Frank",
    lastName: "Wong",
    email: "frank.wong@example.com",
    phone: "0466666666",
    pronoun: "he/him",
    dob: new Date("1993-02-14"),
    address: "7 Willow Way, Sydney",
    level: "BEGINNER",
    status: "WAITLIST",
    paymentStatus: "UNPAID",
    paidAt: null,
  },
  {
    firstName: "Grace",
    lastName: "Kim",
    email: "grace.kim@example.com",
    phone: "0477777777",
    pronoun: "she/her",
    dob: new Date("2002-06-08"),
    address: "15 Elm St, Melbourne",
    level: "BEGINNER",
    status: "TRYOUT",
    paymentStatus: "UNPAID",
    paidAt: null,
  },
  {
    firstName: "Henry",
    lastName: "Patel",
    email: "henry.patel@example.com",
    phone: "0488888888",
    pronoun: "he/him",
    dob: new Date("1985-12-25"),
    address: "99 Ash Ct, Brisbane",
    level: "ADVANCED",
    status: "ACTIVE",
    paymentStatus: "EXEMPT",
    paidAt: null,
  },
  {
    firstName: "Irene",
    lastName: "Chen",
    email: "irene.chen@example.com",
    phone: "0499999999",
    pronoun: "she/her",
    dob: new Date("1997-04-17"),
    address: "42 Spruce Dr, Sydney",
    level: "INTERMEDIATE",
    status: "ACTIVE",
    paymentStatus: "PAID",
    paidAt: new Date("2026-02-01"),
  },
  {
    firstName: "James",
    lastName: "Brown",
    email: "james.brown@example.com",
    phone: null,
    pronoun: null,
    dob: null,
    address: null,
    level: "BEGINNER",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paidAt: null,
  },
] as const;

const passwordHash = await bcrypt.hash("admin123", 10);

const admins = [
  {
    email: "admin@shuttlebase.com",
    passwordHash,
  },
] as const;

async function main() {
  await prisma.member.deleteMany();

  for (const data of members) {
    await prisma.member.create({ data });
  }

  console.log(`Seeded ${members.length} members.`);

  await prisma.admin.deleteMany();

  for (const data of admins) {
    await prisma.admin.create({ data });
  }

  console.log(`Seeded ${admins.length} admins.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
