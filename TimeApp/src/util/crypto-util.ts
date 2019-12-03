import { pbkdf2Sync, createHash } from "crypto";

/** @hidden */
export function getSecret(userid: string, saltlength: number = 8) {
  var salt = randomBytes(saltlength);

  return pbkdf2Sync(userid, salt, 8, 8, 'sha1').toString('hex');
}

export function getSha1SafeforBrowser(userid: string) {
  var hash = createHash('sha1');
  return hash.update(userid).digest("hex");
}

export function checksum(value, options = {algorithm: "md5", encoding: "hex"}) {
  options || (options = {});

  if (!options.algorithm) options.algorithm = 'md5';
  if (!options.encoding) options.encoding = 'hex';

  var hash = createHash(options.algorithm);

  if (!hash.write) {
    hash.update(value);
  } else {
    hash.write(value);
  }

  return hash.digest(options.encoding);
}

/** @hidden */
export function randomBytes(n: number) {
  for (var bytes = []; n > 0; n--)
    bytes.push(Math.floor(Math.random() * 256));
  return bytes.join('');
}
