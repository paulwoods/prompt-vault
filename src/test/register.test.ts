import {beforeEach, describe, expect, it, vi} from 'vitest';
import {POST} from '@/app/api/register/route';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
    },
}));

describe('Register API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if fields are missing', async () => {
        const req = new Request('http://localhost/api/register', {
            method: 'POST',
            body: JSON.stringify({email: 'test@example.com'}),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('Missing required fields');
    });

    it('should return 400 if user already exists', async () => {
        (prisma.user.findUnique as any).mockResolvedValue({id: '1', email: 'test@example.com'});

        const req = new Request('http://localhost/api/register', {
            method: 'POST',
            body: JSON.stringify({name: 'Test', email: 'test@example.com', password: 'password123'}),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('User already exists');
    });

    it('should create a new user and return 201', async () => {
        (prisma.user.findUnique as any).mockResolvedValue(null);
        (bcrypt.hash as any).mockResolvedValue('hashed_password');
        (prisma.user.create as any).mockResolvedValue({id: 'user_123'});

        const req = new Request('http://localhost/api/register', {
            method: 'POST',
            body: JSON.stringify({name: 'Test', email: 'test@example.com', password: 'password123'}),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe('User created successfully');
        expect(data.userId).toBe('user_123');
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: 'Test',
                email: 'test@example.com',
                password: 'hashed_password',
            },
        });
    });
});
