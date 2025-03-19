import * as jwt from 'jsonwebtoken';

export function cryptor(
  value: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt',
): string {
  const secretKey = process.env['JWT_PRIVATE_KEY'];

  if (mode === 'encrypt') {
    return jwt.sign(value, secretKey, {
      // expiresIn: 150 * 365 * 24 * 60 * 60 * 1000,
    });
  }

  return jwt.verify(value, secretKey, { ignoreExpiration: true }) as string;
}
