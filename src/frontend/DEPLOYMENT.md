# Deployment Guide

This guide explains how to deploy your Cerebral Physique application to the Internet Computer and retrieve your live `.icp0.io` URL.

## Understanding URLs

- **Preview/Draft URLs** (e.g., `*.caffeine.xyz`): Temporary development links used during development. These are **not** your deployed site.
- **Deployed URLs** (e.g., `https://<canister-id>.icp0.io`): Your live site on the Internet Computer. This is the URL you'll use for custom domain setup and sharing.

## Deploying to Live

### Prerequisites
- Your application must be built and ready for deployment
- You must have access to the deployment environment

### Deployment Steps

1. **Build your application** (if not already built):
   ```bash
   npm run build
   ```

2. **Deploy to the Internet Computer**:
   The deployment process will upload your application to the Internet Computer network and assign it a canister ID.

3. **Retrieve your Live URL**:
   After deployment completes, your live URL will be in the format:
   ```
   https://<canister-id>.icp0.io
   ```

## Finding Your Live URL

The easiest way to find and copy your live `.icp0.io` URL is through the application itself:

1. **Navigate to the Domain Setup page** in your deployed application:
   - Go to `/domain-setup` in your browser
   - Or click "Domain Setup" in the navigation menu

2. **Copy your Live URL**:
   - The page displays your "Current Site URL" with your full `.icp0.io` address
   - Click the copy button next to the URL to copy it to your clipboard
   - You can also click the external link button to open your live site in a new tab

3. **Share your URL**:
   - Use this `.icp0.io` URL to share your live application
   - This URL is permanent and will remain the same across deployments

## Custom Domain Setup

Once you have your live `.icp0.io` URL, you can configure a custom domain (like `cerebralphysique.com`) to point to your application.

See the in-app Domain Setup page (`/domain-setup`) for detailed instructions on:
- Configuring DNS records with GoDaddy or Cloudflare
- Setting up apex domain and www subdomain
- Verifying your custom domain configuration

## Troubleshooting

### Can't find my canister ID
- Visit the `/domain-setup` page in your deployed application
- The canister ID is displayed in the "Your Deployed Site Information" section
- If the page shows an error, refresh and try again

### Preview URL vs Deployed URL
- Preview URLs (*.caffeine.xyz) are temporary and change between builds
- Deployed URLs (*.icp0.io) are permanent and tied to your canister
- Always use the `.icp0.io` URL for production and custom domain setup

### Deployment fails
- Check that all dependencies are installed
- Ensure your build completes without errors
- Verify you have proper permissions for deployment

## Next Steps

After deploying:
1. Test your live `.icp0.io` URL to ensure the application loads correctly
2. Set up your custom domain using the Domain Setup guide
3. Share your live URL with users

For more information about custom domains, visit the Domain Setup page in your application.
