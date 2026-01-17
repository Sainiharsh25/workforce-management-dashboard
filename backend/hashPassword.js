import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const plaintextPassword = "password123"; // Replace this with your actual plaintext password
  const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();
