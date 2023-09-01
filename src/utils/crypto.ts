import { createHash } from 'crypto';

export function hash(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}
