<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email   = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (!empty($name) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to      = "dh11any@hotmail.com";
        $subject = "New Message from $name";
        $body    = "Name: $name\nEmail: $email\nMessage:\n$message";
        $headers = "From: $email\r\nReply-To: $email";

        if (mail($to, $subject, $body, $headers)) {
            echo json_encode([
                'success' => true,
                'message' => '✅ Message sent successfully!',
                'data' => [
                    'name' => $name,
                    'email' => $email
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => '❌ Message could not be sent. Please try again later.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => '⚠️ Please fill in all fields correctly.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => '❌ Invalid request method.'
    ]);
}
