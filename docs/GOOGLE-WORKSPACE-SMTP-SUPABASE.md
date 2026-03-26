# Google Workspace SMTP – Supabase Üye Olamama Sorunu

Üye olurken hata alıyorsanız veya doğrulama e-postası gelmiyorsa aşağıdakileri tek tek kontrol edin.

## 1. Şifre: Mutlaka “Uygulama Şifresi” kullanın

- **Normal Google / Workspace şifrenizi** SMTP şifresi olarak **kullanmayın**; çalışmaz.
- **Uygulama şifresi** oluşturmanız gerekir:
  1. Google Hesabı: https://myaccount.google.com/
  2. **Güvenlik** → **2 Adımlı Doğrulama** açık olmalı (yoksa önce açın).
  3. **Güvenlik** → **Uygulama şifreleri** → Uygulama seçin (örn. “Mail”) → Oluştur.
  4. Çıkan 16 karakterli şifreyi kopyalayın; **boşluksuz** Supabase SMTP şifresi alanına yapıştırın.

## 2. Gönderen e-posta = SMTP kullanıcı adı

- **Sender email** ve **SMTP username** alanları **aynı** olmalı: Workspace’teki gerçek e-posta adresiniz (örn. `info@joinpr.com.tr` veya `no-reply@joinpr.com.tr`).
- Farklı bir “gönderen” adresi kullanırsanız Google SMTP reddeder.

## 3. Host ve port

- **smtp-relay.gmail.com** kullanıyorsanız: Port **sadece 465**.
- **smtp.gmail.com** kullanıyorsanız: Port **465** veya **587**.

Supabase SMTP ayarlarında:
- Host: `smtp.gmail.com` veya `smtp-relay.gmail.com`
- Port: 465 (tercih) veya 587 (sadece smtp.gmail.com için)

## 4. Supabase tarafında kontrol

- **Project Settings** → **Authentication** → **SMTP Settings**
- Custom SMTP **açık** olsun.
- **Sender name:** Join PR (isteğe bağlı)
- **Sender email** = **SMTP username** = Workspace e-postanız
- **Password** = Uygulama şifresi (16 karakter, boşluksuz)

## 5. Hata mesajını görmek

- Kayıt formunda kırmızıyla çıkan mesaj Supabase’den gelir; tam metni not alın.
- Tarayıcıda **F12** → **Console** sekmesi → Kayıt butonuna basın, kırmızı hata var mı bakın.
- Supabase Dashboard: **Authentication** → **Logs** → Son “Sign up” denemelerinde hata var mı bakın.

Sık görülen hatalar:
- “Invalid login” / “Username and Password not accepted” → Uygulama şifresi kullanın, 2FA açık olsun.
- “Email rate limit exceeded” → Saatlik limit; biraz sonra tekrar deneyin veya limiti artırın.
- “Unable to send email” → SMTP ayarları (host, port, kullanıcı, şifre) yanlış veya Google engelliyor.

## 6. E-posta gelmiyorsa (kayıt “başarılı” görünüyor)

- Spam / Gereksiz klasörüne bakın.
- Supabase **Authentication** → **Users**: Kullanıcı oluşmuş mu? “Email confirmed” false ise doğrulama maili gidiyor demektir; bazen SMTP maili düşürüyor ama kullanıcı yine oluşur.
- **Authentication** → **Logs** içinde “Send confirmation email” / hata kaydı var mı bakın.

## Özet kontrol listesi

| Ayar              | Ne olmalı?                                      |
|-------------------|--------------------------------------------------|
| SMTP şifre        | Uygulama şifresi (normal hesap şifresi değil)   |
| 2 Adımlı doğrulama| Açık                                             |
| Sender email      | Workspace e-postanız (örn. no-reply@joinpr.com.tr) |
| SMTP username     | Sender email ile aynı                            |
| Host              | smtp.gmail.com veya smtp-relay.gmail.com         |
| Port              | 465 (smtp-relay için sadece 465)                |

Bunlara rağmen üye olunamıyorsa, tarayıcı konsolundaki veya Supabase Auth Logs’taki **tam hata mesajını** paylaşırsanız bir sonraki adımı net söyleyebiliriz.
