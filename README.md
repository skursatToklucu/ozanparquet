# Sample Parquet - Corporate Website

A fast, responsive, SEO-friendly corporate website for a parquet/flooring company with a full-featured admin panel, inspired by professional industry standards while maintaining completely original branding and content.

## Features

### Public Pages
- **Home**: Hero carousel, category grid, featured products, testimonials, blog preview
- **Products**: Filterable product catalog with category, color, thickness, surface, and stock filters
- **Product Detail**: Image gallery, specifications, related products
- **About**: Company story, values, timeline, certifications
- **Services**: Professional installation, refinishing, maintenance services
- **Gallery**: Project photos with category filtering and lightbox
- **Blog**: Articles with tags and search functionality
- **Blog Detail**: Full article view with related posts
- **FAQ**: Accordion-style Q&A organized by category
- **Contact**: Contact form with submission to database
- **Get Quote**: Multi-step quote request form

### Admin Panel (NEW!)
- **Dashboard**: Statistics overview with quick access to all sections
- **Products Management**: Full CRUD operations for products with image upload, specifications, and filtering
- **Categories Management**: Create, edit, and organize product categories
- **Authentication**: Secure login with Supabase Auth
- **Role-Based Access**: Admin and super_admin roles
- **Responsive Design**: Mobile-friendly admin interface

### Technical Features
- **Database**: Supabase with complete schema for products, categories, blog, gallery, testimonials, FAQ, and form submissions
- **SEO**: Meta tags, Open Graph, structured data, sitemap.xml, robots.txt
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Performance**: Lazy loading, optimized images, efficient bundling
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Security**: Row Level Security (RLS) policies on all database tables

### Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (database + auth-ready)
- Lucide React (icons)

## Database Schema

The application uses 9 main tables:
- `admin_users`: Admin user accounts with role-based access
- `categories`: Product categories
- `products`: Product catalog with specifications
- `blog_posts`: Blog articles with tags
- `gallery_items`: Project photos
- `testimonials`: Customer reviews
- `faq_items`: Frequently asked questions
- `contact_submissions`: Contact form submissions
- `quote_requests`: Quote request form submissions

All tables have appropriate RLS policies:
- **Public users**: Read access to published content, write access to contact/quote forms
- **Admin users**: Full CRUD access to all content tables

## Sample Data

The database is pre-populated with:
- 6 product categories (Laminat, Masif, Mühendislik, Vinil, Süpürgelik, Deck)
- 6 sample products with Turkish descriptions
- 3 blog posts about parquet selection and maintenance
- 6 customer testimonials
- 10 FAQ items
- 6 gallery project photos

## Development

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:5173`
- Public site: `http://localhost:5173/`
- Admin panel: `http://localhost:5173/admin/login`

## Admin Panel Setup

**IMPORTANT**: Before accessing the admin panel, you need to create an admin user. See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed instructions.

Quick setup:
1. Create a user in Supabase Authentication
2. Add the user to `admin_users` table with SQL
3. Login at `/admin/login`

## Production Build

```bash
npm run build
```

Build output is optimized for performance with:
- CSS: ~30 KB (5.4 KB gzipped)
- JS: ~398 KB (105 KB gzipped)

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Design Philosophy

The design uses a professional neutral color palette with amber accents, avoiding purple/indigo tones. Focus on:
- Clean, sophisticated visual presentation
- High-quality Pexels stock photos
- Ample white space and clear hierarchy
- Smooth transitions and hover effects
- Mobile-responsive breakpoints

## Legal Notice

This is a sample/template website. All branding ("Sample Parquet"), copy, and images are placeholders. The design is inspired by industry standards but completely original. No proprietary content, brand assets, or logos were copied from any source.
