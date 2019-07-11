import { Crypto } from 'cryptojs';

/** @hidden */
export function getSecret(userid: string, saltlength: number = 16) {
  let salt = Crypto.util.randomBytes(16);
  return Crypto.PBKDF2(userid, salt, 16, { asString: true });
}
