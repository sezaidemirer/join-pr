<?php
// Bu dosyayı mail-config.php olarak kopyalayın ve şifreyi girin
// mail-config.php .gitignore'da olmalı (şifre güvenliği)
//
// Seçenek 1: Hosting mail sunucusu (mail.domain.com)
// $smtp_host = 'mail.joinpr.com.tr';
// $smtp_port = 465;
//
// Seçenek 2: Gmail SMTP (hosting PHP mail() çalışmıyorsa)
// - Google Hesap → Güvenlik → 2 Adımlı Doğrulama (açık olmalı)
// - Uygulama Parolaları → Yeni oluştur → "Mail" → 16 haneli parola alın
// - Normal Gmail şifresi DEĞİL, sadece App Password kullanın
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_user = 'ornek@gmail.com';
$smtp_pass = 'xxxx xxxx xxxx xxxx';  // 16 haneli Uygulama Parolası
$to_email = 'sezai@joinpr.com.tr';
