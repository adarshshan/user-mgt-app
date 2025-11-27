import crypto from 'crypto';
import config from '../config';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(config.encryption.key, 'hex');
const IV = Buffer.from(config.encryption.iv, 'hex');

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (text: string): string => {
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
