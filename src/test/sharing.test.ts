import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {DELETE, GET, POST} from '@/app/api/prompts/[id]/share/route';
import {prisma} from '@/lib/prisma';
import {auth} from '@/auth';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        prompt: {
            findUnique: vi.fn(),
        },
        shareLink: {
            create: vi.fn(),
            findMany: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

describe('Sharing API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/prompts/[id]/share', () => {
        it('should create a share link', async () => {
            (auth as Mock).mockResolvedValue({user: {id: 'user_1'}});
            (prisma.prompt.findUnique as Mock).mockResolvedValue({id: 'p1', userId: 'user_1'});
            (prisma.shareLink.create as Mock).mockResolvedValue({id: 's1', token: 'token123'});

            const req = new Request('http://localhost/api/prompts/p1/share', {method: 'POST'});
            const response = await POST(req, {params: Promise.resolve({id: 'p1'})});
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.token).toBe('token123');
            expect(prisma.shareLink.create).toHaveBeenCalled();
        });
    });

    describe('GET /api/prompts/[id]/share', () => {
        it('should list share links', async () => {
            (auth as Mock).mockResolvedValue({user: {id: 'user_1'}});
            const mockLinks = [{id: 's1', token: 'token123'}];
            (prisma.shareLink.findMany as Mock).mockResolvedValue(mockLinks);

            const req = new Request('http://localhost/api/prompts/p1/share');
            const response = await GET(req, {params: Promise.resolve({id: 'p1'})});
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockLinks);
        });
    });

    describe('DELETE /api/prompts/[id]/share', () => {
        it('should revoke a share link', async () => {
            (auth as Mock).mockResolvedValue({user: {id: 'user_1'}});

            const req = new Request('http://localhost/api/prompts/p1/share?tokenId=s1', {method: 'DELETE'});
            const response = await DELETE(req, {params: Promise.resolve({id: 'p1'})});
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe('Share link revoked');
            expect(prisma.shareLink.delete).toHaveBeenCalledWith({
                where: {id: 's1', promptId: 'p1'}
            });
        });
    });
});
