import { pbkdf2Sync } from "crypto";

/** @hidden */
export function getSecret(userid: string, saltlength: number = 8) {
    var salt = randomBytes(saltlength);

    return pbkdf2Sync(userid, salt, 8, 8, 'sha1').toString('hex');
}

/** @hidden */
export function randomBytes(n: number) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes.join('');
}
