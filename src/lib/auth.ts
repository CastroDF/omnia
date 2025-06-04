import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';

export { authOptions };

export const getSession = () => getServerSession(authOptions);
