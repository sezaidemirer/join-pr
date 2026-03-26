<?php
/**
 * Turizm Form - PHP mail() kullanır
 * Dış SMTP yok - sunucu kendi posta sistemini kullanır (GoDaddy uyumlu)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Sadece POST kabul edilir.']);
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!$body) {
    echo json_encode(['error' => 'Geçersiz veri.']);
    http_response_code(400);
    exit;
}

$name = trim($body['name'] ?? $body['company'] ?? '');
$company = trim($body['company'] ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');
$topic = trim($body['topic'] ?? 'Turizm - Ücretsiz Dijital Konum Analizi');
$message = trim($body['message'] ?? '');

if (!$name || !$email) {
    echo json_encode(['error' => 'İsim ve e-posta zorunludur.']);
    http_response_code(400);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Geçerli e-posta giriniz.']);
    http_response_code(400);
    exit;
}

if (file_exists(__DIR__ . '/mail-smtp.php')) {
    require_once __DIR__ . '/mail-smtp.php';
}

$to_email = 'sezai@joinpr.com.tr';
$from_email = 'sezai@joinpr.com.tr';
if (file_exists(__DIR__ . '/mail-config.php')) {
    include __DIR__ . '/mail-config.php';
    $from_email = $smtp_user ?? $to_email;
}

$subject = 'İletişim Formu: ' . $topic;

$html = "
<div style='font-family:Arial,sans-serif;max-width:600px;'>
<h2 style='color:#0ea5e9'>Yeni İletişim Formu Mesajı</h2>
<div style='background:#f9fafb;padding:20px;border-radius:8px;'>
<p><strong>İsim:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Şirket:</strong> " . htmlspecialchars($company ?: 'Belirtilmemiş') . "</p>
<p><strong>E-posta:</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Telefon:</strong> " . htmlspecialchars($phone ?: 'Belirtilmemiş') . "</p>
<p><strong>Konu:</strong> " . htmlspecialchars($topic ?: 'Belirtilmemiş') . "</p>
</div>
<div style='margin-top:20px;'><h3 style='color:#0ea5e9'>Mesaj:</h3>
<p style='background:#f9fafb;padding:15px;border-radius:8px;white-space:pre-wrap'>" . nl2br(htmlspecialchars($message)) . "</p></div>
</div>";

$admin_ok = function_exists('send_mail_smtp')
    ? send_mail_smtp($to_email, $subject, $html, $from_email, 'Yeni Talep', $name . ' <' . $email . '>')
    : mail($to_email, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: Yeni Talep <{$from_email}>\r\nReply-To: {$name} <{$email}>\r\n");

// Müşteriye onay maili
$customer_first_name = explode(' ', $name)[0] ?: $name;
$customer_subject = 'Talebiniz Alındı | Join PR';
$customer_subject_encoded = '=?UTF-8?B?' . base64_encode($customer_subject) . '?=';
$customer_html = "
<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;'>
<div style='text-align:center;margin-bottom:24px;'>
<h1 style='color:#0d9488;font-size:28px;margin:0;'>Join PR</h1>
</div>
<div style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:16px;padding:32px;color:#e2e8f0;'>
<h2 style='color:#fff;font-size:22px;margin:0 0 16px 0;'>Merhaba " . htmlspecialchars($customer_first_name) . ",</h2>
<p style='font-size:16px;line-height:1.6;margin:0 0 16px 0;'>
Talebinizi aldık. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
</p>
<p style='font-size:16px;line-height:1.6;margin:0;'>
Saygılarımızla,<br><strong>Join PR Destek Ekibi</strong>
</p>
</div>
<p style='text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;'>© " . date('Y') . " Join PR. Tüm hakları saklıdır.</p>
</div>";

$customer_ok = function_exists('send_mail_smtp')
    ? send_mail_smtp($email, $customer_subject, $customer_html, $from_email, 'Join PR Destek', $to_email)
    : mail($email, $customer_subject_encoded, $customer_html, "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: Join PR Destek <{$from_email}>\r\nReply-To: {$to_email}\r\n");

if ($admin_ok || $customer_ok) {
    echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla gönderildi.']);
    http_response_code(200);
} else {
    error_log('PHP mail() failed for ' . $to_email);
    echo json_encode(['error' => 'Mail gönderilemedi. Sunucu ayarlarını kontrol edin.']);
    http_response_code(500);
}
