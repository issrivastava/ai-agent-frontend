import { delay, http, HttpResponse } from 'msw';
import type { Role, User } from '@/types/user';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const COOKIE = 'token';

type StoredUser = User & { password: string };

// On globalThis so hot reloads don't reset the user list.
const g = globalThis as unknown as { __authUsers?: StoredUser[] };
const users = (g.__authUsers ??= [
  { id: 'U-001', name: 'Asha Admin', email: 'admin@example.com', role: 'admin', password: 'Admin123' },
  { id: 'U-002', name: 'Arjun Agent', email: 'agent@example.com', role: 'agent', password: 'Agent123' },
  { id: 'U-003', name: 'Vikram Viewer', email: 'viewer@example.com', role: 'viewer', password: 'Viewer123' },
]);

const publicUser = (u: User): User => ({ id: u.id, name: u.name, email: u.email, role: u.role });

function setSession(user: User) {
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

function clearSession() {
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
}

function readSession(): User | null {
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as User;
  } catch {
    return null;
  }
}

const unauthorized = () => HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
const forbidden = () => HttpResponse.json({ message: 'Admins only' }, { status: 403 });

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(600);
    const { email, password } = (await request.json()) as { email: string; password: string };
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    setSession(publicUser(user));
    return HttpResponse.json({ user: publicUser(user) });
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    await delay(700);
    const { name, email, password } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      return HttpResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }
    const user: StoredUser = {
      id: `U-${String(users.length + 1).padStart(3, '0')}`,
      name: name.trim(),
      email: normalized,
      role: 'viewer',
      password,
    };
    users.push(user);
    return HttpResponse.json({ user: publicUser(user) }, { status: 201 });
  }),

  http.get(`${API}/auth/me`, async () => {
    await delay(200);
    const session = readSession();
    if (!session) return unauthorized();
    // Prefer the stored user so role changes by an admin show up.
    const fresh = users.find((u) => u.id === session.id);
    return HttpResponse.json({ user: fresh ? publicUser(fresh) : session });
  }),

  http.post(`${API}/auth/logout`, async () => {
    await delay(200);
    clearSession();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/users`, async () => {
    await delay(400);
    const session = readSession();
    if (!session) return unauthorized();
    if (session.role !== 'admin') return forbidden();
    return HttpResponse.json(users.map(publicUser));
  }),

  http.patch(`${API}/users/:id`, async ({ params, request }) => {
    await delay(500);
    const session = readSession();
    if (!session) return unauthorized();
    if (session.role !== 'admin') return forbidden();
    const user = users.find((u) => u.id === String(params.id));
    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    const { role } = (await request.json()) as { role: Role };
    user.role = role;
    return HttpResponse.json(publicUser(user));
  }),
];