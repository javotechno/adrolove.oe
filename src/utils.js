import {dirname} from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config/config.js'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const hashPassword = async (e) => {
    return bcrypt.hash(e, 10)
}

export const comparePasswords = async (pass, ashedPass) => {
    return bcrypt.compare(pass, ashedPass)
}

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }
  const token = jwt.sign(payload, config.secretJwt, { expiresIn: '1h' });
  return token;
};