# Custom Domain Setup Guide

This guide will help you connect **cerebralphysique.com** to your Internet Computer deployment.

## Important: Finding Your Canister ID

**Do not use hardcoded values from this document.** Your canister ID and deployed URL are unique to your deployment.

### How to Find Your Canister ID:

1. **Open the in-app Domain Setup page**: Navigate to `/domain-setup` in your application
2. **View "Your Deployed Site Information"**: The page will display your live canister ID and deployed URL
3. **Use those values**: Copy the canister ID and deployed URL shown on that page for all DNS configuration steps below

### Understanding Your URLs:

- **Preview/Draft URLs** (like `*.caffeine.xyz`): These are temporary development links and are **not** your deployed site
- **Deployed URLs** (ending in `.icp0.io`): These represent your live site on the Internet Computer
- **Custom Domain** (like `cerebralphysique.com`): This is what you're setting up with this guide

## Prerequisites

- Access to your domain registrar (GoDaddy or Cloudflare)
- Ability to manage DNS settings
- Your canister ID (from the in-app `/domain-setup` page)

## Configuration Options

You have two main options for configuring your custom domain:

### Option A: GoDaddy DNS (www-only)

This is the simpler option but only `www.cerebralphysique.com` will work directly. You'll need to set up forwarding for the apex domain.

#### DNS Records to Add:

1. **CNAME Record**:
   - Name: `www`
   - Value: `icp1.io`
   - TTL: 600 (or default)

2. **TXT Record**:
   - Name: `_canister-id.www`
   - Value: `[YOUR_CANISTER_ID]` (get this from `/domain-setup` page)
   - TTL: 600 (or default)

#### Apex Domain Forwarding:

To make `cerebralphysique.com` (without www) work:

1. Log in to GoDaddy
2. Go to Domain Settings → Forwarding
3. Add forwarding:
   - Forward from: `cerebralphysique.com` (or @ - root domain)
   - Forward to: `https://www.cerebralphysique.com`
   - Redirect type: Permanent (301)
   - Forward settings: Forward only (recommended)

### Option B: Cloudflare DNS (apex + www)

This option allows both `cerebralphysique.com` and `www.cerebralphysique.com` to work, but requires using Cloudflare nameservers.

#### DNS Records to Add:

1. **CNAME Record (Apex)**:
   - Name: `@`
   - Target: `icp1.io`
   - Proxy status: DNS only (gray cloud)

2. **CNAME Record (www)**:
   - Name: `www`
   - Target: `icp1.io`
   - Proxy status: DNS only (gray cloud)

3. **TXT Record (Apex)**:
   - Name: `_canister-id`
   - Content: `[YOUR_CANISTER_ID]` (get this from `/domain-setup` page)

4. **TXT Record (www)**:
   - Name: `_canister-id.www`
   - Content: `[YOUR_CANISTER_ID]` (get this from `/domain-setup` page)

## Verification

After configuring DNS:

1. **Wait for propagation**: DNS changes can take 24-48 hours to fully propagate
2. **Check DNS propagation**: Use [dnschecker.org](https://dnschecker.org) to verify your records
3. **Test your domain**: Visit your custom domain in a browser
4. **SSL certificate**: The Internet Computer will automatically provision an SSL certificate (this can take 24-48 hours after DNS propagation)

## Troubleshooting

### Domain not working after 48 hours?

- Double-check your DNS records match exactly
- Verify your canister ID is correct (check the `/domain-setup` page)
- Use a DNS checker tool to verify propagation

### SSL/HTTPS certificate issues?

- SSL certificates are automatically provisioned by the Internet Computer
- This can take 24-48 hours after DNS propagation
- Be patient and check back later

### Getting a "canister not found" error?

- Verify your TXT record contains the correct canister ID
- Even a single character difference will cause this error
- Copy the canister ID directly from the `/domain-setup` page

## Additional Resources

- [Internet Computer Custom Domain Documentation](https://internetcomputer.org/docs/current/developer-docs/production/custom-domain/)
- [DNS Checker Tool](https://dnschecker.org)
- In-app Domain Setup Guide: Navigate to `/domain-setup` in your application

## Support

If you continue to experience issues, please contact support with:
- Your domain name
- Your canister ID (from `/domain-setup` page)
- Screenshots of your DNS configuration
- Any error messages you're seeing
