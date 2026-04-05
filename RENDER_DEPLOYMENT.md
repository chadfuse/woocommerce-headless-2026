# Render Deployment Guide

> **Status: ✅ READY FOR RENDER**  
> **Repository:** https://github.com/chadfuse/woocommerce-headless-2026.git  
> **Date: 2026-04-05**

---

## 🚀 **Render Deployment Options**

### **Option 1: Web Service (Recommended)**
**Best for:** Dynamic sites with server-side functionality

#### **Quick Setup:**
1. **Go to [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Click "New +" → "Web Service"**
4. **Select repository:** `chadfuse/woocommerce-headless-2026`
5. **Environment:** Node
6. **Build Command:** `npm run build`
7. **Start Command:** `npm start`
8. **Runtime:** Node 18

#### **Environment Variables:**
```
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
```

#### **Deploy:**
- Click "Create Web Service"
- Wait for build (2-3 minutes)
- Site live at: `https://your-project.onrender.com`

---

### **Option 2: Static Site**
**Best for:** Better performance, lower cost

#### **Quick Setup:**
1. **Go to [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Click "New +" → "Static Site"**
4. **Select repository:** `chadfuse/woocommerce-headless-2026`
5. **Build Command:** `npm run export`
6. **Publish Directory:** `out`
6. **Environment Variable:** `RENDER_STATIC=true`

#### **Environment Variables:**
```
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
RENDER_STATIC=true
```

#### **Deploy:**
- Click "Create Static Site"
- Wait for build (1-2 minutes)
- Site live at: `https://your-project.onrender.com`

---

## 🎯 **Render Features**

### **✅ Included:**
- **Automatic HTTPS:** Free SSL certificate
- **Global CDN:** Fast loading worldwide
- **Auto-Deploy:** Deploy on git push
- **Preview Deployments:** Test changes before production
- **Custom Domains:** Free custom domain support
- **Environment Variables:** Secure configuration
- **Docker Support:** Container-based deployment
- **Health Checks:** Automatic monitoring

### **✅ Performance:**
- **Fast Builds:** Optimized build process
- **Global Edge Network:** CDN included
- **Automatic Scaling:** Handle traffic spikes
- **Zero Downtime:** Seamless deployments

---

## 🔧 **Configuration Files**

### **render.yaml** (Auto-detected)
```yaml
services:
  - type: web
    name: woocommerce-headless-store
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    healthCheckPath: /
```

### **next.config.js** (Render-ready)
```javascript
// Static export for Render static sites
output: process.env.NODE_ENV === 'production' && process.env.RENDER_STATIC === 'true' ? 'export' : undefined,
distDir: process.env.NODE_ENV === 'production' && process.env.RENDER_STATIC === 'true' ? 'out' : '.next',
```

---

## 📊 **Performance Comparison**

| Feature | Web Service | Static Site |
|---------|-------------|-------------|
| **Build Time** | 2-3 minutes | 1-2 minutes |
| **Cold Start** | ~2 seconds | ~100ms |
| **Cost** | Free tier available | Free tier available |
| **Server-Side** | ✅ Yes | ❌ No |
| **API Routes** | ✅ Yes | ❌ No |
| **Performance** | Good | Excellent |
| **Scalability** | Auto-scaling | CDN scaling |

---

## 🎨 **Recommendation**

### **Choose Web Service if:**
- You need server-side functionality
- You have API routes
- You need dynamic content
- You need real-time features

### **Choose Static Site if:**
- You want maximum performance
- You want lower cost
- Your content is mostly static
- You don't need server-side features

---

## 🚀 **Quick Deploy Commands**

### **Using Render CLI:**
```bash
# Install Render CLI
npm install -g render

# Login to Render
render login

# Create Web Service
render create web-service

# Create Static Site
render create static-site
```

---

## 🔍 **Testing Before Deploy**

### **Local Testing:**
```bash
# Test Web Service build
npm run build
npm start

# Test Static Site build
RENDER_STATIC=true npm run build
```

### **Environment Variables:**
```bash
# Test with local environment
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com/wp-json/wc/v3
npm run dev
```

---

## 🎊 **Deployment Success!**

### **✅ What You Get:**
- **Live Website:** Your e-commerce store on Render
- **HTTPS Enabled:** Free SSL certificate
- **Global CDN:** Fast loading worldwide
- **Auto-Deploy:** Updates on git push
- **Free Tier:** No cost for small projects

### **✅ Next Steps:**
1. **Configure Custom Domain** (optional)
2. **Set Up Monitoring** (built-in)
3. **Test All Features**
4. **Monitor Performance**
5. **Scale if needed**

---

## 🆘 **Troubleshooting**

### **Common Issues:**
- **Build Failures:** Check environment variables
- **API Errors:** Verify WooCommerce URL and keys
- **Performance Issues:** Try static site option
- **Domain Issues:** Check DNS configuration

### **Support:**
- Render documentation: [render.com/docs](https://render.com/docs)
- GitHub issues: Create issue in repository
- Community: Render community forums

---

**🎉 Your WooCommerce Headless Store is ready for Render deployment!**

Choose between Web Service (dynamic) or Static Site (performance) based on your needs, configure your environment variables, and deploy with confidence. The project is fully optimized for Render's platform.
