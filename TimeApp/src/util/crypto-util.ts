import { pbkdf2 } from "crypto";

/** @hidden */
export async function getSecret(userid: string, saltlength: number = 16) {
    var salt = randomBytes(16);

    return await pbkdf2(userid, salt, 16, 32, 'sha1');
}

/** @hidden */
export function randomBytes(n: number) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes.join('');
}
