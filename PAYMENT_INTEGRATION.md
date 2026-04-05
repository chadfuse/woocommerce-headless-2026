# WooCommerce Payment Integration Guide

## 🎯 Overview

Integrate real WooCommerce payment options for a complete checkout experience.

## 📋 Available Payment Methods

### Core WooCommerce Payments (Built-in)
- **BACS** - Bank Transfer
- **Cheque** - Check/Money Order  
- **COD** - Cash on Delivery
- **PayPal Standard** - PayPal integration

### Popular Extensions
- **Stripe** - Credit cards, Apple Pay, Google Pay
- **Square** - Credit cards, digital wallets
- **Klarna** - Buy now, pay later
- **Afterpay** - Installment payments

## 🚀 Implementation Options

### Option 1: Direct WooCommerce API (Recommended)
**Pros:** 
- Uses existing WooCommerce setup
- All payment methods available
- Secure and tested
- No additional fees

**Cons:**
- Requires WooCommerce payments configured
- Some methods need server-side processing

### Option 2: Payment Gateway APIs
**Pros:**
- More control over UX
- Better mobile experience
- Advanced features

**Cons:**
- More complex implementation
- Additional integration work
- PCI compliance requirements

## 🔧 Option 1: Direct API Implementation

### Step 1: Fetch Available Payment Methods
```typescript
// lib/woocommerce.ts
export async function getPaymentMethods() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/payment_gateways`,
    {
      headers: {
        'Authorization': `Basic ${btoa(
          `${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET}`
        )}`,
      },
    }
  )
  return response.json()
}
```

### Step 2: Payment Method Component
```typescript
// components/PaymentMethods.tsx
export function PaymentMethods() {
  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  })

  return (
    <div className="space-y-3">
      {paymentMethods?.map((method) => (
        <label key={method.id} className="flex items-center space-x-3">
          <input
            type="radio"
            name="payment_method"
            value={method.id}
            {...register('payment_method')}
          />
          <div>
            <div className="font-medium">{method.title}</div>
            {method.description && (
              <div className="text-sm text-gray-600">{method.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}
```

### Step 3: Order Creation with Payment
```typescript
// store/checkoutStore.ts
export async function createOrder(data: CheckoutFormData) {
  const orderData = {
    // ... other order data
    payment_method: data.payment_method,
    payment_method_title: getPaymentMethodTitle(data.payment_method),
    set_paid: data.payment_method === 'cod' ? false : true, // COD requires manual payment
  }

  const response = await fetch('/wp-json/wc/v3/orders', {
    method: 'POST',
    headers: { /* auth headers */ },
    body: JSON.stringify(orderData),
  })

  const order = await response.json()

  // Handle payment redirection if needed
  if (order.payment_url) {
    window.location.href = order.payment_url
  }

  return order
}
```

## 💳 Payment Method Handling

### COD (Cash on Delivery)
```typescript
// No additional processing needed
// Order created with status 'pending-payment'
```

### BACS (Bank Transfer)
```typescript
// Order created with bank transfer details
// Customer gets bank info in order confirmation
```

### PayPal Standard
```typescript
// WooCommerce redirects to PayPal
// Customer completes payment on PayPal site
// PayPal redirects back to your store
```

### Stripe
```typescript
// Two approaches:
// 1. WooCommerce Stripe Extension (Recommended)
//    - Uses WooCommerce's Stripe integration
//    - Handles PCI compliance
//    - Redirects to Stripe Checkout

// 2. Direct Stripe Integration
//    - More control but more complexity
//    - Requires PCI compliance
//    - Custom payment forms
```

## 🎨 UX Flow Examples

### COD Flow
```
Checkout → Select COD → Place Order → Order Confirmation → Pay on Delivery
```

### PayPal Flow
```
Checkout → Select PayPal → Place Order → Redirect to PayPal → Pay → Return to Store → Order Confirmation
```

### Stripe Flow (WooCommerce Extension)
```
Checkout → Select Stripe → Place Order → Redirect to Stripe → Pay → Return to Store → Order Confirmation
```

## 📱 Mobile Payment Support

### Apple Pay / Google Pay (Stripe)
```typescript
// Requires Stripe Extension + Apple Pay/Google Pay add-on
// Automatic detection of device capabilities
// One-tap payment on supported devices
```

## 🔒 Security Considerations

### PCI Compliance
- Use WooCommerce payment gateways (handles PCI)
- Never store credit card details
- Use HTTPS everywhere
- Validate payment confirmations

### Webhook Handling
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get('stripe-signature')!,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'payment_intent.succeeded') {
    // Update order status in WooCommerce
    await updateOrderStatus(event.data.object.metadata.order_id, 'processing')
  }

  return new Response('OK')
}
```

## 🛠️ Setup Requirements

### In WooCommerce Admin:
1. **Install Payment Gateways**
   - Go to WooCommerce → Extensions → Get more extensions
   - Install desired payment methods

2. **Configure Payment Methods**
   - Go to WooCommerce → Settings → Payments
   - Enable and configure each payment method

3. **API Keys**
   - Get API keys for payment gateways (Stripe, PayPal, etc.)
   - Store in environment variables

### Environment Variables:
```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Square
NEXT_PUBLIC_SQUARE_APP_ID=...
SQUARE_ACCESS_TOKEN=...
```

## 🎯 Recommended Implementation Strategy

### Phase 1: Core Payments (Easy)
1. **COD** - Already working
2. **BACS** - Bank transfer
3. **Cheque** - Check payments

### Phase 2: PayPal (Medium)
1. Install PayPal extension
2. Configure PayPal settings
3. Handle PayPal redirects

### Phase 3: Stripe (Advanced)
1. Install Stripe extension
2. Set up Stripe account
3. Configure Apple Pay/Google Pay

### Phase 4: BNPL (Optional)
1. Add Klarna/Afterpay
2. Configure installment options

## 📊 Testing Checklist

- [ ] Test each payment method in sandbox mode
- [ ] Test mobile payment flows
- [ ] Test payment failures and error handling
- [ ] Test webhook processing
- [ ] Test order status updates
- [ ] Test email notifications
- [ ] Test refund processing

## 🚨 Common Issues

### Payment Redirects
- Ensure return URLs are configured correctly
- Test both success and cancellation flows
- Handle timeout scenarios

### Webhook Failures
- Verify webhook URLs are accessible
- Test webhook signature validation
- Monitor webhook delivery logs

### Order Status Sync
- Ensure order status updates correctly
- Test manual payment confirmation
- Handle duplicate webhook events
