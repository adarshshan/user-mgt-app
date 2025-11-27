import dotenv from "dotenv";

dotenv.config();

const config = {
  mongoUri: process.env.MONGO_URI as string,
  port: parseInt(process.env.PORT || "5000", 10),
  session: {
    secret: process.env.SESSION_SECRET as string,
    lifetime: parseInt(process.env.SESSION_LIFETIME || "86400000", 10),
  },
  email: {
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    from: process.env.EMAIL_FROM as string,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY as string,
    iv: process.env.ENCRYPTION_IV as string,
  },
  frontendUrl: process.env.FRONTEND_URL as string,
};

export default config;
