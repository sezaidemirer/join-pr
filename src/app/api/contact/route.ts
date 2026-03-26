import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, topic, message } = body;

    // Form validasyonu
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'İsim, e-posta ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // Nodemailer transporter - mail.joinpr.com.tr (SSL 465)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.joinpr.com.tr',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'sezai@joinpr.com.tr',
        pass: process.env.SMTP_PASSWORD || '',
      },
      tls: {
        rejectUnauthorized: false, // self-signed cert desteği
      },
    });

    // Mail içeriği
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@joinpr.com.tr',
      to: process.env.CONTACT_EMAIL || 'sezai@joinpr.com.tr',
      subject: `İletişim Formu: ${topic || 'Genel İletişim'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Yeni İletişim Formu Mesajı</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>İsim:</strong> ${name}</p>
            <p><strong>Şirket:</strong> ${company || 'Belirtilmemiş'}</p>
            <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> ${phone || 'Belirtilmemiş'}</p>
            <p><strong>Konu:</strong> ${topic || 'Belirtilmemiş'}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #0ea5e9;">Mesaj:</h3>
            <p style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
      replyTo: email, // Müşterinin e-postasına cevap verilebilmesi için
    };

    // 1. Admin'e bildirim maili gönder
    await transporter.sendMail(mailOptions);

    // 2. Müşteriye onay maili gönder
    const customerFirstName = name.split(' ')[0] || name;
    const customerSubject = 'Talebiniz Alındı | Join PR';
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        </div>
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
          <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Merhaba ${customerFirstName},</h2>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Talebinizi aldık. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0;">
            Saygılarımızla,<br><strong>Join PR Destek Ekibi</strong>
          </p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Join PR. Tüm hakları saklıdır.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `Join PR Destek <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@joinpr.com.tr'}>`,
      to: email,
      subject: customerSubject,
      html: customerHtml,
      replyTo: process.env.CONTACT_EMAIL || 'sezai@joinpr.com.tr',
    });

    return NextResponse.json(
      { success: true, message: 'Mesajınız başarıyla gönderildi.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Mail gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Mail gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
