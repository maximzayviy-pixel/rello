import { verifyInitData } from './telegram';

export function requireUserFromInitData(initData: string | null) {
  if (!initData) return null;
  try {
    return verifyInitData(initData);
  } catch {
    return null;
  }
}
