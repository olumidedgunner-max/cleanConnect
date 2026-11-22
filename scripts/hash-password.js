// Generates ADMIN_PASSWORD_HASH. The password itself is never stored.
//   node scripts/hash-password.js "your password"
const { scryptSync, randomBytes } = require("node:crypto");

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "your password"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
console.log(`${salt}:${hash}`);
