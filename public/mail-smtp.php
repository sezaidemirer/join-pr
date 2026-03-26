<?php
/**
 * Gmail SMTP ile mail gönderimi
 * mail-config.php'de smtp_* ayarları varsa SMTP kullanır
 * Hosting PHP mail() genelde gmail.com adreslerine güvenilir gönderim yapamaz
 */

function send_mail_smtp($to, $subject, $html_body, $from_email, $from_name, $reply_to = '') {
    $config_file = __DIR__ . '/mail-config.php';
    if (!file_exists($config_file)) {
        return mail($to, $subject, $html_body, "Content-Type: text/html; charset=UTF-8\r\nFrom: {$from_name} <{$from_email}>\r\n");
    }
    
    $smtp_host = $smtp_port = $smtp_user = $smtp_pass = '';
    include $config_file;
    $host = $smtp_host ?? '';
    $port = (int)($smtp_port ?? 587);
    $user = $smtp_user ?? '';
    $pass = $smtp_pass ?? '';
    
    if (!$host || !$user || !$pass) {
        return mail($to, $subject, $html_body, "Content-Type: text/html; charset=UTF-8\r\nFrom: {$from_name} <{$from_email}>\r\n");
    }
    
    $subject_encoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $to_addr = preg_match('/<([^>]+)>/', $to, $m) ? trim($m[1]) : trim($to);
    
    $smtp = @stream_socket_client(
        ($port == 465 ? 'ssl://' : '') . $host . ':' . $port,
        $errno, $errstr, 15,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]])
    );
    
    if (!$smtp) {
        error_log("SMTP connect failed: $errstr ($errno)");
        return false;
    }
    
    $read = function() use ($smtp) {
        $r = fgets($smtp, 515);
        return $r;
    };
    
    $send = function($cmd) use ($smtp) {
        fwrite($smtp, $cmd . "\r\n");
    };
    
    $read(); // banner
    
    $send("EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    while ($line = $read()) {
        if (substr($line, 3, 1) === ' ') break;
    }
    
    if ($port == 587) {
        $send("STARTTLS");
        $read();
        stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $send("EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
        while ($line = $read()) {
            if (substr($line, 3, 1) === ' ') break;
        }
    }
    
    $send("AUTH LOGIN");
    $read();
    $send(base64_encode($user));
    $read();
    $send(base64_encode($pass));
    $auth = $read();
    if (substr($auth, 0, 3) !== '235') {
        fclose($smtp);
        error_log("SMTP auth failed");
        return false;
    }
    
    $send("MAIL FROM:<" . $user . ">");
    $read();
    $send("RCPT TO:<" . $to_addr . ">");
    $read();
    $send("DATA");
    $read();
    
    $headers = "From: {$from_name} <{$from_email}>\r\n";
    $headers .= "To: {$to}\r\n";
    $headers .= "Subject: {$subject_encoded}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    if ($reply_to) $headers .= "Reply-To: {$reply_to}\r\n";
    
    $send($headers . "\r\n" . $html_body);
    $send(".");
    $read();
    
    $send("QUIT");
    fclose($smtp);
    return true;
}
