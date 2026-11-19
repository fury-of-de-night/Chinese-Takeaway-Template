# M&N Chinese Food Restaurant demo

Run `python3 -m http.server 3000 --bind 0.0.0.0` from this directory and open the site on port 3000. The demo is static and requires Python only for local serving. There is no build or dependency installation.

Browse the sample menu, pick a portion, and use fictional contact details at checkout. Track orders through the confirmation token or **Track order → History**. Use **Demo admin** in the footer to edit dishes and photos, advance statuses, or reset the local demo. The cart, menu edits, and last 50 demo orders are saved in the current browser for this site. People using the same browser profile can open Demo admin, so use fictional details. Clearing site data or choosing **Reset demo** removes those records. Menu prices are shown in GYD and stored in integer cents.

The name and Dennis Street location come from the supplied Maps link. The brand mark, menu, prices and illustrative photos are presentation material. Obtain approval and replace them with the restaurant's actual branding, menu, portion prices, photos, hours, contact information, and confirmed fulfilment and payment policies before going live.

## Hosting

For an authorized Vercel demo deployment, import this repository as an **Other** project with no build command and serve its root. No environment variables are needed. Verify the deployed menu, bundled assets, Maps link, checkout, and browser-local history over HTTPS.

For an approved live rollout, use Vercel for the site and server endpoints and Supabase for persistent data, staff auth and photo storage. Implement server-calculated prices, atomic order creation, hashed tracking credentials, pending-only cancellation, staff authorization and restrictive database/storage policies before accepting real orders. Use deployment environment variables for credentials and keep any service-role key server-side.
