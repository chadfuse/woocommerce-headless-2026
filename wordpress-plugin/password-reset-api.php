<?php
/**
 * Plugin Name: Headless Store Password Reset API
 * Description: Custom API endpoint for password reset in headless store
 * Version: 1.0.0
 * Author: Headless Store
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API endpoint for password reset
 */
add_action('rest_api_init', function () {
    register_rest_route('headless-store/v1', '/password-reset', [
        'methods' => 'POST',
        'callback' => 'handle_password_reset',
        'permission_callback' => '__return_true',
        'args' => [
            'email' => [
                'required' => true,
                'validate_callback' => function($param) {
                    return is_email($param);
                },
            ],
        ],
    ]);
});

/**
 * Handle password reset request
 */
function handle_password_reset($request) {
    $email = $request->get_param('email');
    
    // Check if user exists
    $user = get_user_by('email', $email);
    
    if (!$user) {
        // For security, don't reveal if user exists
        return new WP_REST_Response([
            'success' => true,
            'message' => 'If an account exists with this email, you will receive password reset instructions.'
        ], 200);
    }
    
    // Generate password reset key
    $reset_key = get_password_reset_key($user);
    
    if (is_wp_error($reset_key)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Unable to generate reset key.'
        ], 500);
    }
    
    // Create reset URL
    $reset_url = add_query_arg([
        'action' => 'rp',
        'key' => $reset_key,
        'login' => $user->user_login,
    ], wp_login_url());
    
    // Send reset email
    $subject = 'Password Reset Request';
    $message = "Someone requested that the password be reset for the following account:\n\n";
    $message .= "Site: " . get_bloginfo('name') . "\n";
    $message .= "Username: " . $user->user_login . "\n\n";
    $message .= "If this was a mistake, just ignore this email and nothing will happen.\n\n";
    $message .= "To reset your password, visit the following address:\n";
    $message .= $reset_url . "\n";
    
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    
    $sent = wp_mail($user->user_email, $subject, $message, $headers);
    
    if (!$sent) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to send reset email.'
        ], 500);
    }
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Password reset instructions have been sent to your email.',
        'data' => [
            'reset_url' => $reset_url,
            'user_login' => $user->user_login
        ]
    ], 200);
}

/**
 * Add CORS headers for headless store
 */
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
}, 15);

add_filter('rest_pre_serve_request', function ($value) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    return $value;
});

/**
 * Handle OPTIONS requests for CORS
 */
add_action('rest_api_init', function () {
    register_rest_route('headless-store/v1', '/password-reset', [
        'methods' => 'OPTIONS',
        'callback' => function() {
            return new WP_REST_Response(null, 200);
        },
    ]);
});
?>
