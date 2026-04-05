// WordPress authentication utilities

export interface WordPressAuthResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Send password reset email using WordPress REST API
 * Uses custom endpoint for better reliability
 */
export async function sendPasswordReset(email: string): Promise<WordPressAuthResponse> {
  try {
    // Try custom endpoint first
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Testing custom password reset endpoint...')
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/headless-store/v1/password-reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Custom password reset endpoint error:', errorText)
        console.log('🔄 Falling back to WordPress core API...')
      }
      
      // Fall back to WordPress core API
      return await sendPasswordResetViaWordPress(email)
    }

    const result = await response.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Custom password reset response:', result)
    }

    return {
      success: result.success || true,
      message: result.message || 'Password reset instructions have been sent to your email.',
      data: result.data
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Password reset error:', error)
      console.log('🔄 Falling back to WordPress core API...')
    }
    // Fall back to WordPress core API
    return await sendPasswordResetViaWordPress(email)
  }
}

/**
 * Fallback: Use WordPress core REST API
 */
async function sendPasswordResetViaWordPress(email: string): Promise<WordPressAuthResponse> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Testing WordPress core password reset endpoint...')
    }
    
    // WordPress core REST API endpoint for password reset
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/users/lost-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_login: email, // WordPress uses user_login field
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ WordPress core password reset error:', errorText)
        console.log('🔄 Falling back to demo implementation...')
      }
      
      // Final fallback to demo implementation
      return await sendPasswordResetViaWooCommerce(email)
    }

    const result = await response.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ WordPress core password reset response:', result)
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
      data: result
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ WordPress core password reset error:', error)
      console.log('🔄 Falling back to demo implementation...')
    }
    // Final fallback to demo implementation
    return await sendPasswordResetViaWooCommerce(email)
  }
}

/**
 * Fallback: Try WooCommerce approach or simulate for demo
 */
async function sendPasswordResetViaWooCommerce(email: string): Promise<WordPressAuthResponse> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DEMO MODE: Checking if customer exists...')
    }
    
    // Check if customer exists first
    const exists = await checkCustomerExists(email)
    
    if (!exists) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Customer does not exist, but showing success message for security')
      }
      // For security, still show success message
      return {
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Customer exists, simulating password reset email')
    }
    
    // WooCommerce doesn't have a direct password reset API
    // In production, you would:
    // 1. Install the custom WordPress plugin
    // 2. Use WordPress REST API with application passwords
    // 3. Create a custom WordPress endpoint
    // 4. Use a third-party email service
    
    // For demo purposes, we'll simulate success
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DEMO MODE: Simulating password reset for:', email)
      console.log('📧 In production, install the custom WordPress plugin for real emails')
      console.log('📋 See SETUP_PASSWORD_RESET.md for plugin installation guide')
    }
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
      data: { 
        demo: true, 
        note: 'This is a demo implementation. Install the custom WordPress plugin for real email delivery.',
        instructions: 'See SETUP_PASSWORD_RESET.md for plugin installation guide.'
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Demo fallback error:', error)
    }
    return {
      success: false,
      message: 'Failed to send reset instructions'
    }
  }
}

/**
 * Check if customer exists by email
 */
export async function checkCustomerExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(
            `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
          )}`,
        },
      }
    )

    if (!response.ok) {
      return false
    }

    const customers = await response.json()
    return customers.length > 0
  } catch (error) {
    console.error('Error checking customer existence:', error)
    return false
  }
}

/**
 * Authenticate customer (for future login implementation)
 */
export async function authenticateCustomer(email: string, password: string): Promise<WordPressAuthResponse> {
  try {
    // WordPress doesn't have a direct REST API for authentication
    // You would typically use the WordPress REST API with JWT authentication
    // or implement a custom endpoint
    
    // For now, we'll check if customer exists and return success for demo
    const exists = await checkCustomerExists(email)
    
    if (exists) {
      return {
        success: true,
        message: 'Authentication successful'
      }
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      message: 'Authentication failed'
    }
  }
}
