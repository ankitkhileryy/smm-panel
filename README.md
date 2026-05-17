# SMM Panel

A full-featured Social Media Marketing (SMM) panel built with **Next.js 16**, **MongoDB**, and **Tailwind CSS**. Supports order management, payment gateways, affiliate system, admin dashboard, and more.

## Features

- 🛒 **Order Management** — Place, track, and sync orders with SMM providers
- 💳 **Payment Gateways** — Razorpay & PhonePe integration + manual payments
- 👤 **User Dashboard** — Order history, add funds, support tickets
- 🔐 **Authentication** — JWT-based auth with OTP verification & password reset
- 🛠️ **Admin Panel** — Manage users, orders, tickets, and site settings
- 🤝 **Affiliate System** — Referral tracking and commission management
- 📱 **Mass Order** — Bulk order placement
- 📧 **Email Notifications** — Powered by Resend
- 🌐 **API v2** — Public API for resellers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js + JWT |
| Styling | Tailwind CSS v4 |
| Payments | Razorpay, PhonePe |
| Email | Resend + Nodemailer |
| Deployment | AWS EC2 + PM2 + Nginx |

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB Atlas account (or local MongoDB)
- Razorpay / PhonePe account for payments
- Resend account for emails

### Installation

```bash
# Clone the repo
git clone https://github.com/ankitkhileryy/smm-panel.git
cd smm-panel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for all required variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key

SMM_PROVIDER_URL=https://your-smm-provider.com/api/v2
SMM_PROVIDER_KEY=your_provider_api_key

RESEND_API_KEY=your_resend_api_key

PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_API_URL=https://api.phonepe.com/apis/hermes

NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes (auth, orders, payments, admin...)
│   ├── dashboard/    # User & admin dashboard pages
│   ├── login/        # Auth pages
│   └── ...
├── components/       # Reusable UI components
├── lib/              # Utilities (auth, db, mail, etc.)
└── models/           # Mongoose models
```

## API

The panel exposes a public reseller API at `/api/v2`. Refer to the in-app API docs at `/api-docs`.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
