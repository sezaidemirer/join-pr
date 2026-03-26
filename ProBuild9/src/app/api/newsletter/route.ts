import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'sezai@joinpr.com.tr';
const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@joinpr.com.tr';

const WELCOME_EMAIL_TR = {
  subject: 'Bültene Hoş Geldiniz! | Join PR',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Bültene Hoş Geldiniz!</p>
      </div>
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
        <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Merhaba,</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Join PR bültenine abone olduğunuz için teşekkür ederiz! Artık ekosistemimizden seçilmiş içgörüler, projeler ve fırsatlar doğrudan e-posta kutunuza gelecek.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          Bizi takip etmeye devam edin — en son haberler ve kampanyalardan ilk siz haberdar olacaksınız.
        </p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        © ${new Date().getFullYear()} Join PR. Tüm hakları saklıdır.
      </p>
    </div>
  `,
};

const WELCOME_EMAIL_EN = {
  subject: 'Welcome to the Newsletter! | Join PR',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Welcome to the Newsletter!</p>
      </div>
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
        <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Hello,</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Thank you for subscribing to the Join PR newsletter! You will now receive curated insights, projects and opportunities from our ecosystem directly to your inbox.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          Stay tuned — you'll be the first to know about our latest news and campaigns.
        </p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        © ${new Date().getFullYear()} Join PR. All rights reserved.
      </p>
    </div>
  `,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, locale = 'tr' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'E-posta adresi zorunludur.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.joinpr.com.tr',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'sezai@joinpr.com.tr',
        pass: process.env.SMTP_PASSWORD || '',
      },
      tls: { rejectUnauthorized: false },
    });

    const welcomeEmail = locale === 'en' ? WELCOME_EMAIL_EN : WELCOME_EMAIL_TR;

    // 1. Bildirim maili - sezai@joinpr.com.tr'ye
    await transporter.sendMail({
      from: `Join PR Bülten <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Yeni Bülten Aboneliği: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #0ea5e9;">Yeni Bülten Aboneliği</h2>
          <div style="background:#f9fafb;padding:20px;border-radius:8px;">
            <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          </div>
        </div>
      `,
    });

    // 2. Hoş geldin maili - abone olan kullanıcıya
    await transporter.sendMail({
      from: `Join PR <${FROM_EMAIL}>`,
      to: email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });

    return NextResponse.json(
      { success: true, message: 'Bültene başarıyla abone oldunuz.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Bülten abonelik hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
