import { getServerSession as getSession } from 'next-auth';
import {auth}

export async function getServerSession() {
  return await getSession(authOptions);
}
