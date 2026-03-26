<?php
/**
 * Bülten Abonelik - PHP mail() kullanır
 * 1. sezai@joinpr.com.tr'ye bildirim gönderir
 * 2. Kullanıcıya "Bültene Hoş Geldiniz" maili gönderir
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

$email = trim($body['email'] ?? '');
$locale = trim($body['locale'] ?? 'tr');

if (!$email) {
    echo json_encode(['error' => 'E-posta adresi zorunludur.']);
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

$to_admin = 'sezai@joinpr.com.tr';
$from_email = 'sezai@joinpr.com.tr';
if (file_exists(__DIR__ . '/mail-config.php')) {
    include __DIR__ . '/mail-config.php';
    $from_email = $smtp_user ?? $to_admin;
}

// 1. Admin bildirimi
$admin_subject = 'Yeni Bülten Aboneliği: ' . $email;
$admin_html = "
<div style='font-family:Arial,sans-serif;max-width:600px;'>
<h2 style='color:#0ea5e9'>Yeni Bülten Aboneliği</h2>
<div style='background:#f9fafb;padding:20px;border-radius:8px;'>
<p><strong>E-posta:</strong> <a href='mailto:{$email}'>{$email}</a></p>
<p><strong>Tarih:</strong> " . date('d.m.Y H:i') . "</p>
</div>
</div>";

$admin_ok = function_exists('send_mail_smtp')
    ? send_mail_smtp($to_admin, $admin_subject, $admin_html, $from_email, 'Join PR Bülten')
    : mail($to_admin, '=?UTF-8?B?' . base64_encode($admin_subject) . '?=', $admin_html, "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: Join PR Bülten <{$from_email}>\r\n");

// 2. Kullanıcıya hoş geldin maili
$year = date('Y');
if ($locale === 'en') {
    $welcome_subject = 'Welcome to the Newsletter! | Join PR';
    $welcome_html = "
<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;'>
<div style='text-align:center;margin-bottom:24px;'>
<h1 style='color:#0d9488;font-size:28px;margin:0;'>Join PR</h1>
<p style='color:#64748b;font-size:14px;margin-top:8px;'>Welcome to the Newsletter!</p>
</div>
<div style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:16px;padding:32px;color:#e2e8f0;'>
<h2 style='color:#fff;font-size:22px;margin:0 0 16px 0;'>Hello,</h2>
<p style='font-size:16px;line-height:1.6;margin:0 0 16px 0;'>
Thank you for subscribing to the Join PR newsletter! You will now receive curated insights, projects and opportunities from our ecosystem directly to your inbox.
</p>
<p style='font-size:16px;line-height:1.6;margin:0;'>
Stay tuned — you'll be the first to know about our latest news and campaigns.
</p>
</div>
<p style='text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;'>© {$year} Join PR. All rights reserved.</p>
</div>";
} else {
    $welcome_subject = 'Bültene Hoş Geldiniz! | Join PR';
    $welcome_html = "
<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;'>
<div style='text-align:center;margin-bottom:24px;'>
<h1 style='color:#0d9488;font-size:28px;margin:0;'>Join PR</h1>
<p style='color:#64748b;font-size:14px;margin-top:8px;'>Bültene Hoş Geldiniz!</p>
</div>
<div style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:16px;padding:32px;color:#e2e8f0;'>
<h2 style='color:#fff;font-size:22px;margin:0 0 16px 0;'>Merhaba,</h2>
<p style='font-size:16px;line-height:1.6;margin:0 0 16px 0;'>
Join PR bültenine abone olduğunuz için teşekkür ederiz! Artık ekosistemimizden seçilmiş içgörüler, projeler ve fırsatlar doğrudan e-posta kutunuza gelecek.
</p>
<p style='font-size:16px;line-height:1.6;margin:0;'>
Bizi takip etmeye devam edin — en son haberler ve kampanyalardan ilk siz haberdar olacaksınız.
</p>
</div>
<p style='text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;'>© {$year} Join PR. Tüm hakları saklıdır.</p>
</div>";
}

$welcome_ok = function_exists('send_mail_smtp')
    ? send_mail_smtp($email, $welcome_subject, $welcome_html, $from_email, 'Join PR Bülten', $to_admin)
    : mail($email, '=?UTF-8?B?' . base64_encode($welcome_subject) . '?=', $welcome_html, "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: Join PR Bülten <{$from_email}>\r\nReply-To: {$to_admin}\r\n");

if ($admin_ok || $welcome_ok) {
    echo json_encode(['success' => true, 'message' => 'Bültene başarıyla abone oldunuz.']);
    http_response_code(200);
} else {
    error_log('PHP mail() failed for newsletter: ' . $email);
    echo json_encode(['error' => 'Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.']);
    http_response_code(500);
}
