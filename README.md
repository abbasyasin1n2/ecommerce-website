# ElectroHub - Electronics E-Commerce Platform

A modern, full-stack e-commerce web application for electronics built with Next.js 16 and React 19. Features a polished UI, complete shopping experience, and secure authentication.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## Live Demo

- **Frontend**: [https://electrohub-client.vercel.app](https://electrohub-client.vercel.app)
- **Backend API**: [https://electrohub-server.vercel.app](https://electrohub-server.vercel.app)

## Features

### Public Pages
- **Landing Page** - Hero section with bento grid layout, featured products, categories, deals, testimonials, and newsletter signup
- **Products Page** - Browse all products with search, category filters, and pagination
- **Product Details** - Full product information with image gallery, specifications, and customer reviews
- **Cart** - Add/remove items, update quantities, persistent cart state
- **Wishlist** - Save products for later

### Protected Pages (Login Required)
- **Dashboard** - User profile, order history, and account statistics
- **Add Product** - Create new product listings with image upload
- **Manage Products** - View, edit, and delete your products
- **Checkout** - Complete purchase with shipping details and payment options
- **Order Details** - Track order status and view order information

### Authentication
- Google OAuth login via NextAuth.js
- Email/Password authentication with Firebase
- Protected routes with automatic redirects
- Persistent sessions

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, shadcn/ui components |
| Authentication | NextAuth.js, Firebase Auth |
| State Management | React Context API, TanStack Query |
| UI Components | Radix UI primitives, Lucide icons |
| Animations | Framer Motion |
| Image Upload | Cloudinary |
| Notifications | Sonner toast |

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/auth/           # NextAuth API routes
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── add-product/    # Add new product
│   │   │   ├── manage-products/# Manage listings
│   │   │   └── orders/         # Order history
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── products/           # Product listing & details
│   │   └── wishlist/           # Saved items
│   ├── components/             # Reusable components
│   │   ├── layout/             # Layout components
│   │   ├── sections/           # Landing page sections
│   │   ├── skeletons/          # Loading states
│   │   └── ui/                 # shadcn/ui components
│   ├── context/                # React Context providers
│   └── lib/                    # Utility functions
├── public/                     # Static assets
└── package.json
```

## Routes Summary

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with hero, features, products |
| `/products` | Public | Browse all products with filters |
| `/products/[id]` | Public | Product details with reviews |
| `/cart` | Public | Shopping cart |
| `/wishlist` | Public | Saved products |
| `/login` | Public | Sign in page |
| `/register` | Public | Create account |
| `/checkout` | Protected | Complete purchase |
| `/dashboard` | Protected | User profile & orders |
| `/dashboard/add-product` | Protected | Create product listing |
| `/dashboard/manage-products` | Protected | Edit/delete products |
| `/dashboard/orders/[id]` | Protected | Order details |

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB Atlas account
- Firebase project
- Google Cloud Console project (for OAuth)
- Cloudinary account

### Environment Variables

Create a `.env.local` file in the client directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/abbasyasin1n2/ecommerce-website.git
   cd ecommerce-website/client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Remember to:
- Update `NEXTAUTH_URL` to your Vercel URL
- Add Vercel URL to Google OAuth authorized redirect URIs
- Add Vercel domain to Firebase authorized domains

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Abbas Yasin**

---

Built with ❤️ using Next.js and React
