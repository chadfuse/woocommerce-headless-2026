export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: 'simple' | 'variable' | 'grouped' | 'external'
  status: 'publish' | 'draft' | 'private'
  featured: boolean
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden'
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from?: string
  date_on_sale_to?: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: Array<{
    id: number
    name: string
    file: string
  }>
  download_limit: number
  download_expiry: number
  external_url?: string
  button_text?: string
  tax_status: 'taxable' | 'shipping' | 'none'
  tax_class: string
  manage_stock: boolean
  stock_quantity?: number
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  backorders: 'no' | 'notify' | 'yes'
  backorders_allowed: boolean
  backordered: boolean
  sold_individually: boolean
  weight?: string
  dimensions?: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  related_ids: number[]
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: WooCommerceCategory[]
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  images: Array<{
    id: number
    src: string
    name: string
    alt: string
  }>
  attributes: Array<{
    id: number
    name: string
    position: number
    visible: boolean
    variation: boolean
    options: string[]
  }>
  default_attributes?: Array<{
    id: number
    name: string
    option: string
  }>
  variations?: number[]
  grouped_products?: number[]
  menu_order: number
  meta_data: Array<{
    id: number
    key: string
    value: any
  }>
}

export interface WooCommerceCategory {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: 'default' | 'products' | 'subcategories' | 'both'
  image?: {
    id: number
    src: string
    name: string
    alt: string
  }
  menu_order: number
  count: number
}

export interface WooCommerceOrder {
  id: number
  parent_id: number
  number: string
  order_key: string
  created_via: string
  version: string
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed'
  currency: string
  date_created: string
  date_modified: string
  discount_total: string
  discount_tax: string
  shipping_total: string
  shipping_tax: string
  cart_tax: string
  total: string
  total_tax: string
  prices_include_tax: boolean
  customer_id: number
  customer_ip_address: string
  customer_user_agent: string
  customer_note: string
  billing: WooCommerceAddress
  shipping: WooCommerceAddress
  payment_method: string
  payment_method_title: string
  transaction_id: string
  date_paid?: string
  date_completed?: string
  cart_hash: string
  meta_data: Array<{
    id: number
    key: string
    value: any
  }>
  line_items: Array<{
    id: number
    name: string
    product_id: number
    variation_id: number
    quantity: number
    tax_class: string
    subtotal: string
    subtotal_tax: string
    total: string
    total_tax: string
    taxes: Array<{
      id: number
      total: string
      subtotal: string
    }>
    meta_data: Array<{
      id: number
      key: string
      value: any
    }>
    sku: string
    price: number
    parent_name: string
  }>
  tax_lines: Array<{
    id: number
    rate_code: string
    label: string
    tax_total: string
    shipping_tax_total: string
    rate_id: number
    compound: boolean
    meta_data: Array<{
      id: number
      key: string
      value: any
    }>
  }>
  shipping_lines: Array<{
    id: number
    method_title: string
    method_id: string
    total: string
    total_tax: string
    taxes: Array<{
      id: number
      total: string
    }>
    meta_data: Array<{
      id: number
      key: string
      value: any
    }>
  }>
  fee_lines: Array<{
    id: number
    name: string
    tax_class: string
    tax_status: string
    total: string
    total_tax: string
    taxes: Array<{
      id: number
      total: string
      subtotal: string
    }>
    meta_data: Array<{
      id: number
      key: string
      value: any
    }>
  }>
  coupon_lines: Array<{
    id: number
    code: string
    discount: string
    discount_tax: string
    meta_data: Array<{
      id: number
      key: string
      value: any
    }>
  }>
  refunds: Array<{
    id: number
    reason: string
    total: string
  }>
  payment_url?: string
  is_editable: boolean
  needs_payment: boolean
  needs_processing: boolean
}

export interface WooCommerceAddress {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  email: string
  phone: string
}

export interface WooCommerceCustomer {
  id: number
  date_created: string
  date_modified: string
  email: string
  first_name: string
  last_name: string
  username: string
  role: string
  billing: WooCommerceAddress
  shipping: WooCommerceAddress
  is_paying_customer: boolean
  avatar_url: string
  meta_data: Array<{
    id: number
    key: string
    value: any
  }>
}

export interface WooCommerceCart {
  cart_hash: string
  cart_key: string
  cart_contents: Array<{
    key: string
    product_id: number
    variation_id: number
    variation: Array<{
      attribute_name: string
      value: string
    }>
    quantity: number
    data_hash: string
    line_tax_data: {
      subtotal: Array<{
        key: string
        value: string
      }>
      total: Array<{
        key: string
        value: string
      }>
    }
    line_subtotal: number
    line_subtotal_tax: number
    line_total: number
    line_tax: number
    data: WooCommerceProduct
  }>
  applied_coupons: string[]
  coupon_discount_amounts: Array<{
    coupon_code: string
    discount_amount: number
  }>
  coupon_discount_tax_amounts: Array<{
    coupon_code: string
    discount_amount: number
  }>
  removed_cart_contents: any[]
  cart_contents_total: number
  cart_contents_weight: number
  cart_contents_tax: number
  subtotal: number
  subtotal_tax: number
  discount_total: number
  discount_tax: number
  shipping_total: number
  shipping_tax: number
  total: number
  total_tax: number
  fees: Array<{
    name: string
    amount: number
    tax_class: string
    tax_status: string
    total: number
    total_tax: number
    taxes: Array<{
      id: number
      total: string
      subtotal: string
    }>
  }>
  shipping_methods: Array<{
    id: string
    label: string
    cost: number
    taxes: Array<{
      id: number
      total: string
    }>
  }>
  shipping_taxes: Array<{
    id: number
    total: string
    rate_id: number
    rate_code: string
    label: string
    compound: boolean
  }>
  fee_tax: number
  cart_tax: number
  taxes: Array<{
    id: number
    total: string
    rate_id: number
    rate_code: string
    label: string
    compound: boolean
  }>
  taxes_total: number
  customer: {
    id: number
    email: string
    first_name: string
    last_name: string
    username: string
    avatar_url: string
  }
}
