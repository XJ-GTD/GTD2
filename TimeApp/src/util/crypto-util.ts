import { pbkdf2 } from "crypto";

/** @hidden */
export function getSecret(userid: string, saltlength: number = 16) {
  return new Promise<any>(async (resolve, reject) => {
    var salt = randomBytes(16);

    pbkdf2(userid, salt, 16, 32, 'sha1', (err, deliverykey) => {
      return deliverykey;
    });
  });
}

/** @hidden */
export function randomBytes(n: number) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes.join('');
}
