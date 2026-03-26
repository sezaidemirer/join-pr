# Join PR – E-posta Gönderen Adını Ayarlama

E-postaların "Supabase" yerine **"Join PR"** olarak görünmesi için Supabase'de **Custom SMTP** kullanmanız ve gönderen adını ayarlamanız gerekir.

## 1. Neden Custom SMTP?

- Supabase varsayılan olarak kendi sunucusundan mail atar; gönderen "Supabase" görünür.
- Custom SMTP ile kendi e-posta servisinizi (Resend, SendGrid, Brevo vb.) bağlarsınız ve **gönderen adı** olarak "Join PR" yazarsınız.

## 2. Hızlı Yol: Resend (Ücretsiz kotası var)

1. **Resend:** https://resend.com → Ücretsiz hesap açın.
2. **Domain ekleyin:** joinpr.com.tr (veya kullandığınız domain). DNS'te verilen kayıtları ekleyin (SPF, DKIM).
3. **API Key alın:** Resend Dashboard → API Keys → Create.
4. **Supabase'e girin:**
   - Supabase Dashboard → **Project Settings** (sol altta dişli) → **Authentication**.
   - **SMTP Settings** bölümüne inin.
   - **Enable Custom SMTP** açın.
   - Şunları doldurun:

| Ayar | Değer (Resend için) |
|------|----------------------|
| **Sender email** | `no-reply@joinpr.com.tr` (veya doğruladığınız domain'den bir adres) |
| **Sender name** | `Join PR` |
| **Host** | `smtp.resend.com` |
| **Port** | `465` (veya 587) |
| **Username** | `resend` |
| **Password** | Resend'den aldığınız **API Key** |

5. **Save** ile kaydedin.

Bundan sonra gönderilen tüm auth mailleri (doğrulama, şifre sıfırlama vb.) **"Join PR"** gönderen adı ve belirttiğiniz adresle gidecektir.

## 3. Alternatif: SendGrid / Brevo / AWS SES

Aynı mantık: Herhangi bir SMTP sağlayıcıda hesap açın, SMTP bilgilerini alın ve Supabase **Authentication → SMTP Settings** ekranında:

- **Sender name:** `Join PR`
- **Sender email:** `no-reply@joinpr.com.tr` (veya domain'inize uygun adres)
- **Host / Port / User / Password:** Sağlayıcının verdiği SMTP bilgileri

şeklinde doldurup kaydedin.

## 4. API ile Ayarlama (İsteğe bağlı)

Supabase Access Token ile de SMTP ayarlanabilir; gönderen adı alanı `smtp_sender_name`:

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/SUPABASE_PROJECT_REF/config/auth" \
  -H "Authorization: Bearer SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_admin_email": "no-reply@joinpr.com.tr",
    "smtp_sender_name": "Join PR",
    "smtp_host": "smtp.resend.com",
    "smtp_port": 465,
    "smtp_user": "resend",
    "smtp_pass": "re_xxxxxxxxxxxx"
  }'
```

## Özet

- Mail'lerin "Join PR" görünmesi için **Custom SMTP** zorunlu.
- **Sender name** alanına `Join PR` yazın.
- **Sender email** alanına domain'inize ait bir adres (örn. `no-reply@joinpr.com.tr`) koyun ve bu domain'i SMTP sağlayıcıda doğrulayın.

Bu adımlardan sonra yeni giden tüm doğrulama / şifre sıfırlama mailleri "Join PR" olarak görünecektir.
