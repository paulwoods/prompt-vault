import {beforeEach, describe, expect, it, vi} from 'vitest';
import {GET, POST} from '@/app/api/prompts/route';
import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        prompt: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

describe('Prompts API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/prompts', () => {
        it('should return 401 if not authenticated', async () => {
            (auth as any).mockResolvedValue(null);
            const req = new Request('http://localhost/api/prompts');
            const response = await GET(req);
            expect(response.status).toBe(401);
        });

        it('should return prompts for authenticated user', async () => {
            (auth as any).mockResolvedValue({user: {id: 'user_1'}});
            const mockPrompts = [{id: 'p1', name: 'Prompt 1'}];
            (prisma.prompt.findMany as any).mockResolvedValue(mockPrompts);

            const req = new Request('http://localhost/api/prompts');
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockPrompts);
            expect(prisma.prompt.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({userId: 'user_1'})
            }));
        });
    });

    describe('POST /api/prompts', () => {
        it('should create a new prompt', async () => {
            (auth as any).mockResolvedValue({user: {id: 'user_1'}});
            const mockPrompt = {id: 'p1', name: 'New Prompt', content: 'Content'};
            (prisma.prompt.create as any).mockResolvedValue(mockPrompt);

            const req = new Request('http://localhost/api/prompts', {
                method: 'POST',
                body: JSON.stringify({name: 'New Prompt', content: 'Content', tags: ['tag1']}),
            });

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockPrompt);
            expect(prisma.prompt.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    name: 'New Prompt',
                    content: 'Content',
                    userId: 'user_1',
                })
            }));
        });
    });
});
