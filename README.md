# 🚀 SaaS Starter Kit

![SaaS Starter Kit Banner](banner.png)

A complete, production-ready SaaS starter kit built with **Next.js 15**, **React 19**, **TypeScript**, **Better Auth**, **Stripe**, and **shadcn/ui** components. Get your SaaS up and running in minutes!

## ✨ Features

- 🚀 **Next.js 15** with App Router and React 19
- 🔐 **Better Auth** for authentication (email/password + social logins)
- 💳 **Stripe Integration** with subscription management and webhooks
- 🎨 **shadcn/ui** components with Tailwind CSS
- 📊 **Prisma** database with PostgreSQL
- 📱 **Responsive Design** with modern UI/UX
- 🔒 **Type Safety** with TypeScript throughout
- 🎯 **Payment Verification** with fallback systems
- 🛡️ **Security** with proper authentication and session management

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd saas-starter-kit
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-better-auth-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Stripe Price IDs (replace with actual Stripe price IDs)
STRIPE_STARTER_PRICE_ID="price_starter_actual_id"
STRIPE_PRO_PRICE_ID="price_pro_actual_id"
STRIPE_ENTERPRISE_PRICE_ID="price_enterprise_actual_id"

# Social Auth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View your database
npx prisma studio
```

### 4. Stripe Setup

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Copy your publishable and secret keys from the dashboard
3. **Create Products**: Create 3 products (Starter, Pro, Enterprise) in Stripe dashboard
4. **Create Prices**: Set up monthly prices for each product
5. **Copy Price IDs**: Add the price IDs to your `.env.local` file
6. **Set up Webhooks**: Add webhook endpoint `https://yourdomain.com/api/stripe/webhook`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 🧪 Testing Payments

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 📁 Project Structure

```
├── app/                           # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── stripe/               # Stripe integration
│   │   │   ├── create-checkout-session/
│   │   │   ├── webhook/
│   │   │   └── verify-session/
│   │   ├── subscription/         # Subscription management
│   │   └── profile/              # User profile
│   ├── auth/                     # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/                # Protected dashboard
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── navigation/               # Navigation components
│   │   ├── navbar.tsx            # Main navbar
│   │   ├── dashboard-navbar.tsx  # Dashboard navbar
│   │   └── conditional-navbar.tsx # Conditional navbar
│   ├── pricing/                  # Pricing components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions
│   ├── auth.ts                   # Better Auth configuration
│   ├── stripe.ts                 # Stripe configuration
│   ├── prisma.ts                 # Database client
│   ├── pricing.ts                # Pricing configuration
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
└── public/                       # Static assets
```

## 🎯 What's Included

| Feature | Technology | Description |
|---------|------------|-------------|
| **Auth** | Better Auth | Email/password + social login |
| **Payments** | Stripe | Subscriptions + webhooks |
| **UI** | shadcn/ui + Tailwind | Modern, responsive design |
| **Database** | Prisma + PostgreSQL | Type-safe database access |
| **Deployment** | Vercel Ready | One-click deployment |

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/saas-starter-kit)

1. **Fork** this repository
2. **Connect** to Vercel
3. **Add** environment variables
4. **Deploy** 🎉

## 🛠️ Customize

### Add Features
```bash
# New component
components/your-feature/

# New API route  
app/api/your-endpoint/

# Database changes
npx prisma db push
```

### Styling
- **Global**: `app/globals.css`
- **Components**: Tailwind classes
- **Theme**: `components.json`

### Database
- **Schema**: `prisma/schema.prisma`
- **Studio**: `npx prisma studio`
- **Generate**: `npx prisma generate`

## 📋 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | `postgresql://user:pass@host:port/db` |
| `DIRECT_URL` | Direct database connection | ✅ Yes | `postgresql://user:pass@host:port/db` |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth | ✅ Yes | `your-secret-key-here` |
| `BETTER_AUTH_URL` | Your app URL | ✅ Yes | `https://yourdomain.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ Yes | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ Yes | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ Yes | `whsec_...` |
| `STRIPE_STARTER_PRICE_ID` | Starter plan price ID | ✅ Yes | `price_...` |
| `STRIPE_PRO_PRICE_ID` | Pro plan price ID | ✅ Yes | `price_...` |
| `STRIPE_ENTERPRISE_PRICE_ID` | Enterprise plan price ID | ✅ Yes | `price_...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ Optional | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ Optional | `your-google-client-secret` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ❌ Optional | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ❌ Optional | `your-github-client-secret` |

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: [minar.svn@gmail.com](mailto:minar.svn@gmail.com)
- 🌐 **Portfolio**: [shovon.site](https://shovon.site)
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/saas-starter-kit/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Better Auth](https://www.better-auth.com/) - Authentication library
- [Stripe](https://stripe.com/) - Payment processing
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

Built with ❤️ by [Shovon](https://shovon.site) using Next.js, React, and modern web technologies.