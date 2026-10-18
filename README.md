# SURPLIX — storefront starter

A React + Vite storefront prototype for GitHub Pages. **Demo only:** sample products/prices and imagery, no real stock or payments.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a GitHub repository named `surplix-store` and upload these files to its root (or use Git).
2. Open **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow builds and deploys the site. For a project repository, it automatically sets the Vite base path to `/surplix-store/` (based on repository name). For a custom domain later, configure Vite base `/` and GitHub Pages domain settings.
4. Push to `main` and check the Actions tab.

## Before accepting payments

- Replace demo items with verified, owned inventory, product photography, accurate prices and stock per size.
- Validate SURPLIX business name and trademark availability before public launch.
- Integrate Supabase with row-level security and a secure serverless backend for Stripe Checkout and verified payment webhooks. Never put Stripe secret keys in frontend code.
- Implement server-side price/stock validation, atomic inventory reservations, and order status updates.
- Add legal policies, taxes, shipping rates, returns, contact details, privacy and accessibility checks.
- Review product photo rights and supplier authenticity documentation.


## Version 2 updates
- Click product image or title for a detailed preview with size selection and add-to-bag.
- Shopping bag now supports explicit remove-item action as well as quantity controls.
- No checkout, backend, or actual stock is connected. All products are samples.
