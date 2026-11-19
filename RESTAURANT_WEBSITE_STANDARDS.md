# My Restaurant Website Standards

A reusable specification for restaurant, takeaway, and food-ordering websites.
Read this together with `WEBSITE_BUILD_STANDARDS.md`; that document covers shared
branding, buttons, accessibility, responsive behavior, forms, demos, and handoff.

## How to use this document

Start a restaurant project with this instruction:

> Read `WEBSITE_BUILD_STANDARDS.md` and `RESTAURANT_WEBSITE_STANDARDS.md`. Use them
> as the starting brief and acceptance criteria. Build a presentable, functional
> customer journey and an owner-editable menu from the beginning. Keep demo and
> live behavior separate. Apply my current restaurant's actual branding, menu,
> prices, currency, and operating rules rather than copying another restaurant.

This is a reusable foundation, not a request to copy a particular restaurant's
name, Chinese styling, menu, Guyana-dollar prices, or database credentials.
For a brochure-only restaurant site, identify which ordering requirements are out
of scope rather than creating a nonfunctional checkout.

## 1. Establish the restaurant's real information

Use supplied information and existing project configuration first. Confirm only
what cannot be inferred and materially affects the project.

- Restaurant name, logo, banner, favicon, approved colors, and photography.
- Phone number, address, contact channels, hours, and service area.
- Menu categories, dish names, descriptions, prices, and availability.
- Portion sizes and variations: full/half box, small/large, toppings, or other options.
- Pickup, delivery, dine-in, reservation, and online-ordering scope.
- Currency, locale, time zone, tax treatment, and pricing units.
- Payment methods, the actual payment workflow, and any cancellation rules.
- Owner/staff needs: menu editing, orders, kitchen statuses, and notices.
- Whether this is a presentation demo or a production restaurant system.

Never invent an ambiguous menu price, delivery fee, ingredient list, allergen
claim, opening status, preparation time, service area, or payment capability.
A dish photo used for illustration should not be represented as a verified photo
of the restaurant's exact serving unless it is one.

## 2. Branding and page structure

Apply the general guide's visual standards. A useful ordering-site structure is:

- **Home:** prominent approved banner/branding, concise introduction, main menu CTA,
  selected dishes, ordering information, and contact details.
- **Menu:** categories, useful search/filtering, dish images, portion prices,
  availability, and clear add-to-order controls.
- **Cart:** selected portions, quantity editing, removal, food subtotal, and checkout.
- **Checkout:** customer contact, pickup/delivery, necessary address, allergies,
  notes, payment selection, and an explicit confirmation action.
- **Confirmation / Track:** order reference, tracking token, current status,
  recovery/history, and eligible cancellation.
- **Administration:** editable menu and settings, plus order management where scoped.
- **Kitchen view:** optional separate staff view if it improves the restaurant's workflow.

Use clear navigation. Include a favicon from the start. Preserve the important
content of supplied banner artwork on both mobile and desktop.
Do not label a restaurant “Open now” unless the actual operating state supports it.

### Multilingual presentation and future menu translation

Follow the general guide's translation-button preference from the beginning:

**Translation → Traducción → 翻译 → Tradução → Vertaling → Traduction → repeat**

- Change the label every **5 seconds**, using a gentle fade and a fixed button
  size. Support reduced motion, keyboard focus, and a stable accessible name.
- Keep it visible without crowding the restaurant header or mobile navigation.
- Clicking the placeholder shows **“Translations coming soon.”** It must not
  pretend to translate the menu or contact a translation service before one exists.
- When the backend is ready, replace the placeholder action with a language
  selector for English, Spanish, Chinese, Portuguese, Dutch, and French.
- Translate the interface as well as menu content: navigation, portions, checkout,
  delivery explanations, validation messages, tracking, history, and cancellation.
- Newly added or edited dishes must be covered by the eventual translation flow:
  create or refresh translations when the source content changes, store the
  results, and let the owner review and correct them. Do not translate on every
  visitor's page load or require source-code changes for each new dish.
- Until a translation is ready, fall back to the original text rather than hiding
  the dish or displaying a broken/empty label.
- Keep prices, quantities, order references, tracking tokens, and state codes
  unchanged; translate their human-readable labels where appropriate.
- Do not invent ingredients or safety claims during translation. Allergy-related
  text needs careful review, and staff-only information must remain private.
- Keep translation-service credentials server-side. A static demo can show the
  rotating placeholder without needing a translation API key or live backend.


## 3. Transcribe the actual menu accurately

- Use the restaurant's menu rather than leaving generic sample dishes in place.
- Keep categories meaningful and correctly group each dish.
- Preserve the distinction between dish price, portion price, and paid add-ons.
- Store money in integer minor units; format it consistently for customers.
- Make a full-box price and half-box price explicit when both exist.
- If no half-box price is supplied, do not guess one or silently halve the full price.
- If a dish has no price, show “Price to confirm” and prevent ordering that portion.
- Mark uncertain handwritten prices as provisional and do not let them become
  authoritative order prices until the owner confirms them.
- Do not interpret missing or unknown prices as free items.
- Do not invent verified allergen declarations from a dish name or a stock photo.

When the owner confirms a provisional price, allow them to update the price and
clear its confirmation flag in the editor.

## 4. Portion selection and cart correctness

- Customers must explicitly know which portion they are adding.
- Different portions of the same dish remain separate cart lines.
- A cart line retains the selected portion name, unit price, options, and quantity.
- Adding another of the same dish/portion updates the appropriate line.
- Quantity increases, decreases, removal, and clear-cart actions must work.
- Enforce reasonable quantity limits and reject invalid quantities.
- Show the cart's shopping icon with a small count badge or subscript.
- The cart count is the sum of quantities, not just the number of distinct lines.
- Update the count immediately, after reload, across relevant tabs, and after checkout.
- Clear the cart only after successful order creation, not after a failed request.
- Keep prices and controls in separate layout cells so long amounts never overlap
  quantity buttons or remove buttons. Test multi-digit quantities and long names.
- For live orders, calculate authoritative totals server-side from current menu
  data. Do not trust client-submitted prices, availability, fees, or totals.
- If a saved cart becomes stale after a price or availability change, explain the
  change and let the customer review the correct order before confirmation.

## 5. Delivery pricing: my preferred starting behavior

Unless I explicitly request a different policy for the new restaurant:

- **Do not assign a preset delivery charge.**
- Explain that the transport provider will call the customer and quote delivery.
- Delivery is paid separately and is not included in the food total.
- Use labels such as **Food total**, **Quoted separately**, or **Quoted by transport**.
- Do not label an unknown delivery price as zero, free delivery, or a final all-in total.
- Pickup can clearly say that there is no delivery charge.
- Collect a delivery address only when delivery is selected.
- If delivery is disabled, make that state clear and prevent delivery selection.
- Use consistent wording on the homepage, cart, checkout, confirmation, and admin.

Suggested wording:

> The transport provider will call you and quote the delivery price. Delivery is
> paid separately and is not included in the food total.

If a future restaurant needs a fixed fee, zone pricing, or an integrated courier,
implement that restaurant's confirmed policy consistently in the UI and backend.
Do not change only the displayed amount while the server still charges an old fee.

## 6. Checkout and order creation

- Collect a customer name and a usable phone number.
- Present pickup and delivery clearly; show only genuinely supported choices.
- Require the address when delivery is chosen and omit unnecessary address data
  for pickup orders.
- Provide structured allergy selections and a free-text field where appropriate.
- Provide an optional kitchen-notes field.
- Offer only payment methods the restaurant actually supports. A payment-method
  selector is not evidence that online payment has been implemented.
- Show the selected portions, quantities, and correct food total before confirmation.
- Use an explicit action such as **Place order** or **Place demo order**.
- Disable repeat submission while the request is in progress and prevent duplicate
  live order creation on retries with an appropriate server-side strategy.
- Keep the form and cart intact when order creation fails.
- Create live order records, item snapshots, and tracking credentials atomically.
- Preserve a snapshot of ordered items/prices so later menu edits do not rewrite
  an existing order's receipt.

A demo checkout must actually create a local order that appears in tracking and
demo administration; it must not show a fake success message without saving it.

## 7. Tracking tokens and confirmation

- Give each order a private, unpredictable tracking token and a separate order reference.
- For live orders, generate tokens securely on the server, store a hash for lookup,
  and return the raw token only through the intended customer confirmation flow.
- Do not treat a guessable order ID as permission to view or cancel an order.
- Show the order status and a useful confirmation immediately after checkout.
- Attempt to copy the tracking token automatically once order creation succeeds.
- If clipboard access is blocked, keep checkout successful and offer **Copy token**
  plus selectable token text. Only say “Copied” after actual success.
- Make the token easy to recover without exposing staff-only customer information.
- Public tracking must not reveal phone numbers, delivery addresses, allergy notes,
  kitchen notes, credentials, or other customers' orders.
- Clearly distinguish a local demo order from an order sent to the real restaurant.

## 8. Browser order history and recovery

Include **Track → History** from the beginning for ordering sites.

- Save the token and minimal reference information in the customer's browser.
- Store only what recovery needs: reference, token, creation time, and demo/live marker.
- Keep demo and live history separate and avoid duplicate entries for the same order.
- Let customers reopen tracking and copy a saved token.
- Preserve history after reload and after successful cancellation.
- Make clear that browser-local history does not sync between devices and is removed
  when that site's browser data is cleared.
- Handle empty history, unavailable storage, missing orders, invalid tokens, and
  older local demo records gracefully.
- Use a bounded retention policy rather than allowing unlimited local entries.
- Do not assume a customer is signed in unless account-based recovery is implemented.

An account-based or cross-device order history is an additional product feature;
do not imply browser storage already provides it.

## 9. Customer cancellation

My starting policy is online cancellation **only while the order is pending**.
Adjust this only when the restaurant explicitly requires a different policy.

- Offer **Cancel order** immediately on the checkout confirmation, visibly enough
  that the customer does not have to search far down the page for it.
- Also offer cancellation inside the relevant history entry.
- Ask for confirmation with clear actions such as **Confirm cancel** and **Keep order**.
- The first click must not immediately cancel the order.
- Once preparation starts, close online cancellation and direct the customer to
  contact the restaurant instead. Ready and completed orders are also ineligible.
- Keep cancelled orders in customer history and staff/demo administration.
- Synchronize the visible cancellation state with tracking and staff order views.
- Re-check the current status when the customer confirms; a stale screen must not
  override a kitchen transition to preparing.
- For live orders, authorize by the non-revoked tracking credential and update only
  its associated pending order. Do not accept a customer-supplied target order ID
  or arbitrary replacement status as authority.
- Make repeated cancellation safe and return clear, non-sensitive errors.
- Never claim a refund was issued unless an actual refund integration succeeded.

Demo cancellation follows the same status rules, but only updates local demo data.

## 10. Owner menu editing, including photos

Do not build an owner dashboard that can only add dishes but cannot edit existing ones.

Support, where applicable:

- Dish name, description, category, and availability.
- Full-box and half-box prices or the restaurant's own portion model.
- Explicit confirmation flags for provisional prices.
- Dish images through an HTTPS URL or an image upload.
- Image preview, replacement, and removal for both new and existing dishes.
- Supported formats, size limits, useful upload errors, and saving disabled while
  an upload is in progress.
- Confirmed removal of a dish and an appropriate demo-reset action.

Opening Add/Edit must scroll the form into view below the sticky header and focus
its first useful field, even when the dish was near the bottom of a long menu.
Saving should update the actual public menu and featured dishes, with persistence
appropriate to demo or live mode. Image URLs must not disappear on reload.

Live image uploads require authenticated server/storage handling. Do not leave the
owner to manually edit database records just to change the photos shown on the menu.
A browser-local photo in a demo is not automatically published for every visitor.

## 11. Demo administration and demo orders

A presentation should demonstrate both the customer and owner journeys.

- Provide an explicitly labeled demo administration area.
- If requested, use an easy public demo code to unlock local presentation controls.
  Do not reuse a live password or database key for this purpose.
- Let me edit the demo menu and images without connecting to Supabase or another
  live database.
- Include a **Demo orders** view for orders actually placed in that browser.
- Show order reference, status, time, customer/contact details, fulfillment,
  ordered portions, quantities, food total, allergy alerts, and kitchen notes.
- Allow presentation status changes such as pending → preparing → ready → completed,
  with cancelled as a separate state.
- Reflect customer cancellation and staff status changes in the relevant views.
- Clearly explain that orders and edits remain on the same browser/device.
- Demo flows must not silently make live API calls, send real orders, charge money,
  upload to production storage, or bypass real staff authorization.

## 12. Live staff access and sensitive data

- Separate public customer operations from staff administration.
- Use proper authentication and authorization for live staff access. A public
  demo code must never be accepted as a live credential.
- Keep database service-role keys and other privileged credentials server-side.
- Do not ask staff to enter a service-role key into the admin login screen.
- If a custom server admin key is used for an early version, keep it separate from
  database credentials; do not print it or expose a prefix in the interface.
- Show allergy information prominently to authorized staff. Do not expose it in
  public tracking, history summaries, notifications, or diagnostic logs.
- Do not infer verified allergen information from a menu name or placeholder image.
- Validate state changes on the server and handle customer/staff concurrency safely.
- Apply database permissions and production migrations only with appropriate authorization.

## 13. Deployment and reuse as a starter

- Use the framework's normal development command and document how to run it.
- Provide a suitable production/server deployment when live ordering is required.
- GitHub Pages can host the static presentation, not the server-side restaurant API.
- A static demo export must exclude server routes, secrets, and environment files.
- Test menu images, banners, favicon, navigation, tracking links, direct reloads,
  and confirmation paths under the actual hosted subdirectory.
- Keep restaurant-specific data separate from shared ordering/UI logic where practical.
- Document which business details, menu data, images, pricing policies, and
  integrations must be replaced for the next restaurant.
- Keep setup, demo access, reset behavior, storage scope, and deployment instructions
  available in Markdown alongside the project.
- Do not copy another restaurant's credentials, production identifiers, private
  customer records, or local demo orders into a new client's project.

## 14. Restaurant acceptance checklist

Before calling the ordering website presentation-ready:

- [ ] Correct brand, banner, favicon, and supplied restaurant content are used.
- [ ] The translation placeholder cycles through all six labels every five seconds
      without layout shifts and shows the coming-soon message when clicked.
- [ ] If real translation is enabled, new/edited dishes enter the translation
      workflow and untranslated content has a readable source-language fallback.
- [ ] All supplied dishes and portion prices are transcribed accurately.
- [ ] Missing and provisional prices cannot become accidental free/guessed orders.
- [ ] Search/categories and add-to-order controls work.
- [ ] Different portions remain distinct cart lines with correct unit prices.
- [ ] Quantity changes, removal, clearing, and the live cart count work.
- [ ] Long names, large totals, and quantity/remove controls never overlap.
- [ ] Delivery wording and arithmetic follow the confirmed transport policy.
- [ ] Pickup/delivery fields and checkout validation work.
- [ ] Successful checkout creates a real demo record or a real backend record,
      as appropriate, and then clears the cart.
- [ ] Failed checkout preserves the customer's work and does not create duplicates.
- [ ] Tracking token copy success and blocked-clipboard fallback both work.
- [ ] History survives reload and lets the customer reopen tracking.
- [ ] Public tracking does not expose staff-only personal or allergy information.
- [ ] Cancellation works from confirmation and history, requires confirmation,
      and is blocked after preparation starts, including with a stale screen.
- [ ] Cancelled orders remain visible in history and administration.
- [ ] The owner can edit existing dishes and their images, not just add new dishes.
- [ ] Opening an editor scrolls and focuses it correctly.
- [ ] Saved edits appear on the public menu and persist in the intended mode.
- [ ] Demo orders appear in demo admin and relevant status changes are reflected.
- [ ] Demo actions make no production writes or unauthorized backend requests.
- [ ] Button hierarchy, 44px targets, contrast, keyboard states, and reduced motion work.
- [ ] The build passes and the core journeys were exercised in a browser.
- [ ] Hosting assets and links work at the deployed path.

For production readiness, additionally verify live authorization, database writes,
image storage, real order totals, concurrent status changes, recovery, and any actual
payment/notification integrations. Mocked tests or a polished static demo alone do
not establish that those live services work.
