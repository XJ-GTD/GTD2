/** @hidden */
export function getSecret(userid: string, saltlength: number = 16) {
  let salt = randomBytes(16);
  return crypto.pbkdf2(userid, salt, 16, 32, 'sha1');
}

/** @hidden */
export function randomBytes(n: number) {
  for (let bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes;
}
