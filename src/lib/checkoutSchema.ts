import { z } from 'zod'

export const checkoutSchema = z.object({
  // Billing Information
  billing_first_name: z.string().min(2, 'First name must be at least 2 characters'),
  billing_last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  billing_company: z.string().optional(),
  billing_address_1: z.string().min(5, 'Address is required'),
  billing_address_2: z.string().optional(),
  billing_city: z.string().min(2, 'City is required'),
  billing_state: z.string().min(2, 'State is required'),
  billing_postcode: z.string().min(3, 'Postal code is required'),
  billing_country: z.string().min(2, 'Country is required'),
  billing_email: z.string().email('Valid email is required'),
  billing_phone: z.string().min(5, 'Phone number is required'),

  // Shipping Information (optional)
  shipping_to_different_address: z.boolean().optional(),
  shipping_first_name: z.string().optional(),
  shipping_last_name: z.string().optional(),
  shipping_company: z.string().optional(),
  shipping_address_1: z.string().optional(),
  shipping_address_2: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_postcode: z.string().optional(),
  shipping_country: z.string().optional(),

  // Order Notes
  order_notes: z.string().optional(),

  // Payment Method
  payment_method: z.enum(['cod', 'bacs', 'cheque', 'stripe', 'paypal']).refine((val) => val, {
    message: 'Payment method is required',
  }),

  // Terms
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
