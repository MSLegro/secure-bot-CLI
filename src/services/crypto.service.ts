import crypto from 'crypto';
import argon2 from 'argon2';
import fs from 'fs';
import os from 'os';
import path from 'path';

const algorithm = 'aes-256-cbc';
const APP_DIR = path.join(os.homedir(), '.securebot');
const SALT_FILE = path.join(APP_DIR, 'salt.bin');

function ensureAppDirExists(): void {
  if (!fs.existsSync(APP_DIR)) {
    fs.mkdirSync(APP_DIR, { recursive: true });
  }
}

function generateSalt(): Buffer {
  ensureAppDirExists();
  const salt = crypto.randomBytes(16);
  fs.writeFileSync(SALT_FILE, salt);
  return salt;
}

function getSalt(): Buffer {
  if (!fs.existsSync(SALT_FILE)) {
    return generateSalt();
  }
  return fs.readFileSync(SALT_FILE);
}

export async function deriveKey(masterPassword: string): Promise<Buffer> {
  const salt = getSalt();
  return await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true
  });
}

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(data: string, key: Buffer): string {
  const [ivHex, encryptedHex] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}
