import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {PATCH} from '@/app/api/prompts/[id]/route';
import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        prompt: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

describe('Prompt Versioning', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a new version when content is updated', async () => {
        const userId = 'user_1';
        const promptId = 'prompt_1';
        (auth as Mock).mockResolvedValue({user: {id: userId}});

        (prisma.prompt.findUnique as Mock).mockResolvedValue({
            id: promptId,
            userId: userId,
            content: 'Old Content',
        });

        (prisma.prompt.update as Mock).mockResolvedValue({
            id: promptId,
            content: 'New Content',
        });

        const req = new Request(`http://localhost/api/prompts/${promptId}`, {
            method: 'PATCH',
            body: JSON.stringify({content: 'New Content'}),
        });

        const response = await PATCH(req, {params: Promise.resolve({id: promptId})});

        expect(response.status).toBe(200);
        expect(prisma.prompt.update).toHaveBeenCalledWith(expect.objectContaining({
            where: {id: promptId},
            data: expect.objectContaining({
                content: 'New Content',
                versions: {
                    create: {content: 'New Content'},
                },
            }),
        }));
    });

    it('should NOT create a new version if content is same', async () => {
        const userId = 'user_1';
        const promptId = 'prompt_1';
        (auth as Mock).mockResolvedValue({user: {id: userId}});

        (prisma.prompt.findUnique as Mock).mockResolvedValue({
            id: promptId,
            userId: userId,
            content: 'Same Content',
        });

        (prisma.prompt.update as Mock).mockResolvedValue({
            id: promptId,
            content: 'Same Content',
        });

        const req = new Request(`http://localhost/api/prompts/${promptId}`, {
            method: 'PATCH',
            body: JSON.stringify({content: 'Same Content', name: 'New Name'}),
        });

        const response = await PATCH(req, {params: Promise.resolve({id: promptId})});

        expect(response.status).toBe(200);
        const updateCall = (prisma.prompt.update as Mock).mock.calls[0][0];
        expect(updateCall.data.versions).toBeUndefined();
        expect(updateCall.data.name).toBe('New Name');
    });
});
