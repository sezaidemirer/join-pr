import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { deleteBlogPost, updateBlogPost } from '@/lib/blog';

function isAuthorized(req: NextRequest) {
  if (hasAdminCookieInRequest(req)) return true;
  const expected = process.env.ADMIN_PANEL_KEY;
  const incoming = req.headers.get('x-admin-key');
  return Boolean(expected && incoming === expected);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      title,
      titleEn,
      slug,
      category,
      categoryEn,
      description,
      descriptionEn,
      content,
      contentEn,
      image,
      publishedAt,
    } = body ?? {};
    if (!title || !description || !content) {
      return NextResponse.json({ error: 'title, description ve content zorunludur.' }, { status: 400 });
    }
    const item = await updateBlogPost(params.id, {
      title,
      titleEn,
      slug,
      category,
      categoryEn,
      description,
      descriptionEn,
      content,
      contentEn,
      image,
      isPublished: true,
      noindex: false,
      publishedAt,
    });
    revalidatePath('/kategori/blog');
    revalidatePath(`/blog/${item.slug}`);
    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const deleted = await deleteBlogPost(params.id);
    revalidatePath('/kategori/blog');
    if (deleted?.slug) revalidatePath(`/blog/${deleted.slug}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
