import { pbkdf2Sync } from "crypto";

/** @hidden */
export function getSecret(userid: string, saltlength: number = 16) {
    var salt = randomBytes(16);

    return pbkdf2Sync(userid, salt, 16, 32, 'sha1').toString('hex');
}

/** @hidden */
export function randomBytes(n: number) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes.join('');
}
