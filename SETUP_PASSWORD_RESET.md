# WordPress Password Reset Setup Guide

## 🚀 Quick Setup

### Option 1: Install Custom Plugin (Recommended)

1. **Copy Plugin File**
   ```bash
   # Copy the plugin file to your WordPress plugins directory
   cp wordpress-plugin/password-reset-api.php /path/to/wordpress/wp-content/plugins/
   ```

2. **Activate Plugin**
   - Go to WordPress Admin → Plugins
   - Find "Headless Store Password Reset API"
   - Click "Activate"

3. **Test the Endpoint**
   ```bash
   # Test the API endpoint
   curl -X POST https://your-site.com/wp-json/headless-store/v1/password-reset \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

### Option 2: Use Built-in WordPress API

The system will automatically fall back to WordPress core API if the custom plugin isn't installed.

## 🔧 WordPress Configuration

### Email Settings
1. **WordPress Admin → Settings → General**
   - Set "Email Address" to your store email
   - Set "Site Title" appropriately

2. **Configure SMTP (Recommended)**
   - Install "WP Mail SMTP" plugin
   - Configure your email service provider
   - Test email delivery

### Plugin Requirements
- WordPress 5.0+
- PHP 7.4+
- WooCommerce (for customer management)

## 🧪 Testing

### Test Password Reset Flow
1. **Go to Forgot Password Page**
   - URL: `/forgot-password`

2. **Enter Email**
   - Use existing customer email
   - Submit the form

3. **Check Console**
   - Look for API responses
   - Verify success message

4. **Check Email**
   - Should receive reset instructions
   - Verify reset link works

### Debug Mode
Add to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG_PASSWORD_RESET=true
```

## 🛠️ Custom Plugin Features

### Custom Endpoint: `/wp-json/headless-store/v1/password-reset`

**Features:**
- ✅ Proper email validation
- ✅ Security (doesn't reveal if email exists)
- ✅ WordPress native password reset
- ✅ CORS headers for headless access
- ✅ Detailed error messages
- ✅ Logging capabilities

**Response Format:**
```json
{
  "success": true,
  "message": "Password reset instructions have been sent to your email.",
  "data": {
    "reset_url": "https://yoursite.com/wp-login.php?action=rp&key=...",
    "user_login": "username"
  }
}
```

## 🔍 Troubleshooting

### Plugin Not Working
1. **Check Plugin Activation**
   - WordPress Admin → Plugins → Ensure plugin is active

2. **Check API Endpoint**
   - Visit: `/wp-json/headless-store/v1/password-reset`
   - Should return method not allowed (405) - this is normal

3. **Check WordPress Logs**
   - WordPress Admin → Tools → Site Health → Info
   - Look for error logs

### Emails Not Sending
1. **Check WordPress Email Settings**
   - WordPress Admin → Settings → General
   - Verify email address

2. **Install SMTP Plugin**
   - Recommended: "WP Mail SMTP"
   - Configure with your email provider

3. **Test Email Function**
   - Install "Check Email" plugin
   - Send test emails

### CORS Issues
The custom plugin includes CORS headers. If you still have issues:

1. **Add to .htaccess**
   ```apache
   <IfModule mod_headers.c>
     Header always set Access-Control-Allow-Origin "*"
     Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
     Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
   </IfModule>
   ```

2. **WordPress CORS Filter**
   Add to your theme's `functions.php`:
   ```php
   add_action('rest_api_init', function () {
     remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
   }, 15);
   
   add_filter('rest_pre_serve_request', function ($value) {
     header('Access-Control-Allow-Origin: *');
     return $value;
   });
   ```

## 📝 Manual Installation

If you can't copy the plugin file:

1. **Create Plugin Directory**
   ```bash
   mkdir /path/to/wordpress/wp-content/plugins/headless-store-password-reset
   ```

2. **Create Plugin File**
   ```bash
   touch /path/to/wordpress/wp-content/plugins/headless-store-password-reset/headless-store-password-reset.php
   ```

3. **Copy Plugin Code**
   - Copy contents from `wordpress-plugin/password-reset-api.php`
   - Paste into the new file

4. **Activate Plugin**
   - WordPress Admin → Plugins → Activate

## 🚀 Production Deployment

### Security Considerations
- The plugin follows WordPress security best practices
- Uses WordPress nonce system internally
- Validates all input parameters
- Implements proper error handling

### Performance
- Minimal overhead
- Uses WordPress native functions
- No database queries required

### Monitoring
- Monitor WordPress error logs
- Track email delivery rates
- Monitor API response times

## 📞 Support

If you encounter issues:

1. **Check Browser Console** - Look for JavaScript errors
2. **Check Network Tab** - Verify API calls
3. **Check WordPress Logs** - Look for PHP errors
4. **Test Email Function** - Verify WordPress can send emails

## 🔄 Updates

The plugin will automatically work with:
- WordPress updates
- WooCommerce updates
- PHP version changes (within supported versions)

For major updates, check the plugin compatibility before updating WordPress.
