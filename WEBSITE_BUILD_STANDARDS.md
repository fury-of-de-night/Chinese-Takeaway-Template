# My Website Build Standards

A reusable brief for any AI, developer, or designer building a website for me.
Use this as a starting specification and as acceptance criteria before handoff.

## How to use this document

Start a project with this instruction:

> Read `WEBSITE_BUILD_STANDARDS.md` and apply it throughout this project. Identify
> which requirements apply, implement them from the beginning, and verify them
> before saying the website is ready. Tell me what works, what is demo-only, and
> what still needs configuration. Follow my current project instructions where
> they differ from this guide.

For restaurants, also read `RESTAURANT_WEBSITE_STANDARDS.md`.
These are my preferences, not a requirement to reuse a particular framework,
hosting service, database, brand, or layout. Do not add restaurant features to an
unrelated website. Do not turn optional integrations into blockers for a demo.

## 1. The outcome I want

- A polished, useful website that I can confidently present to the people I am
  building it for, even when the first version is a clearly identified demo.
- Working journeys rather than attractive screens connected to dead buttons.
- A design adapted to the actual business, with its real branding and content.
- Sensible defaults and steady progress without repeatedly asking me to approve
  routine, reversible implementation decisions.
- Honest explanations of what is implemented and what is still incomplete.
- Reusable foundations so the same interaction and accessibility problems do not
  have to be fixed separately on every project.

## 2. Establish the scope before building

Determine the business, audience, main user goal, required pages, and intended
presentation or production workflow. Inspect existing code and instructions first.

Record or infer, where possible:

- Business name, logo, banner, colors, contact details, and supplied images.
- The primary action visitors should take and the steps needed to complete it.
- Which content the owner must be able to edit without changing source code.
- Whether this is a static informational site, interactive demo, or live service.
- Currency, locale, time zone, and any project-specific operating rules.
- Hosting constraints, backend requirements, and which integrations already exist.

Ask only for information that prevents useful progress or would materially change
an important decision. Continue independent work while waiting. Keep unknown
business details explicit; do not invent prices, testimonials, opening hours,
addresses, availability, or claims that something is live.

## 3. Branding and presentation

- Use the exact assets I supply when available. Check the repository before
  asking me to upload something again.
- Place a supplied banner prominently where it makes sense, usually near the top
  of the homepage. Preserve important text, logos, and the full composition.
- Avoid cropping readable banner artwork just to fill a fixed-height container.
- Use the brand consistently in navigation, page titles, footer, and metadata.
- Include a favicon from the start. Derive it from an approved logo or a simple,
  recognizable brand mark; do not leave the framework's default favicon.
- Use intentional typography, spacing, alignment, and a restrained color system.
- Give content a clear reading order. Avoid clutter, arbitrary decoration, and
  repeated competing calls to action.
- Use meaningful image descriptions. Decorative images should not add unnecessary
  screen-reader noise. Missing images must not leave broken-image placeholders.
- Make the design feel appropriate to the business; do not automatically copy
  this restaurant project's warm palette or Chinese seal into unrelated projects.

### Multilingual translation placeholder

Unless I request otherwise, include a visible translation placeholder while real
multilingual support is being prepared. Use one button whose label changes every
**5 seconds**, continuously looping through these six languages in this order:

| Language | Button label |
| --- | --- |
| English | Translation |
| Spanish | Traducción |
| Simplified Chinese | 翻译 |
| Portuguese | Tradução |
| Dutch | Vertaling |
| French | Traduction |

- Keep the button's dimensions fixed so changing labels never shift nearby content.
- Use a gentle text fade between labels; respect reduced-motion settings by
  disabling the fade while preserving the five-second label cycle.
- Give the button a stable accessible name. Do not announce every automatic label
  change to screen readers. Mark each visible label with its correct language.
- Apply the shared button standards, including 44px targets and visible focus.
- Place it prominently without crowding navigation or causing mobile overflow.
- Until actual translations are connected, clicking it shows **“Translations
  coming soon.”** Do not imply that the website's content has been translated.
- Once multilingual support is implemented, the same control should open a real
  language selector instead of the placeholder message.
- The planned languages are English, Spanish, Chinese, Portuguese, Dutch, and
  French. Confirm regional variants when implementing real translations.
- Store and remember the visitor's selected language when real selection exists.
  The rotating placeholder itself does not change the website language.


## 4. Button design: implement this from the beginning

Use a shared button component or shared styles across the website.

### Hierarchy

| Level | Use | Appearance | Examples |
| --- | --- | --- | --- |
| Primary | Main action in the current task or section | Solid, high-contrast fill | Save changes, Book appointment, Place order |
| Secondary | Supporting or alternative action | Outlined or subtle surface | View details, Edit item, Keep order |
| Tertiary | Lower-priority action | Plain text with a clear interactive treatment | Reset filters, Cancel editing |
| Destructive | An action that removes or cancels something | Clearly differentiated danger treatment, proportional to its importance | Remove item, Confirm cancellation |

Do not style every action as primary. A destructive confirmation can be a solid
button; the initial destructive trigger can be secondary or tertiary.

### Signifiers and labels

- Make every button recognizably clickable with deliberate padding, shape, and
  a visible surface, border, or text-action treatment.
- Prefer concise, action-oriented labels of one to three words when possible.
- Replace vague labels such as Submit or OK with the actual result: Save dish,
  Send enquiry, Confirm booking, or Publish changes.
- Longer labels are acceptable when needed for clarity, such as an order total.
- Icon-only actions need an accessible name describing the action and target.
  A cart minus button should describe which item's quantity it decreases.
- Use a button for an action and a link for navigation. Style navigation that
  acts as a call to action consistently with the button hierarchy.
- Specify `type="button"` for non-submit buttons inside forms.

### States and accessibility

- Minimum touch target: **44 × 44 CSS pixels**, including icon-only controls.
- Text-to-background contrast: target **at least 4.5:1**, including hover states.
  Keep disabled controls readable while visibly muted.
- Hover: subtle color change or lift; do not make content jump around.
- Active: a slight press-down effect or another clear pressed state.
- Focus-visible: an obvious keyboard outline with enough offset to be seen.
- Disabled: clearly muted, not-allowed cursor, and genuinely non-interactive.
- Loading: show an action-specific label and prevent accidental duplicate submits.
- Honor reduced-motion preferences. Do not rely on motion or color alone to
  communicate state. Give adjacent controls enough separation to avoid misclicks.

## 5. Responsive layout and numerical content

- Design for phones, tablets, and desktop, including intermediate widths.
- Test representative widths such as 320, 390, 713, 768, 1024, and 1440 pixels.
- No overlapping text, prices, badges, controls, dialogs, or sticky headers.
- Do not hide a layout problem by clipping essential content or shrinking touch
  targets. Fix the layout itself.
- Let prices and counts use the width their text requires. Do not force a long
  formatted amount into a narrow fixed-width box.
- Give quantities, amounts, and remove controls separate grid cells or otherwise
  guarantee they cannot collide.
- Wrap or stack content when the available space is insufficient. Test long
  names, large prices, multi-digit quantities, and both empty and full states.
- Use appropriate number formatting and tabular figures for prices and totals.
- Sticky headers must not obscure headings, anchors, or automatically opened forms.

## 6. Forms, editors, and feedback

- Use visible labels, appropriate input types, helpful examples, and clear units.
- Validate required fields and explain errors near the relevant input.
- Preserve entered data when validation or a request fails.
- Prevent duplicate submissions while saving and clearly report success or failure.
- Do not display success until the underlying operation has succeeded.
- When Edit or Add opens a form elsewhere on the page, **scroll it into view and
  focus its first useful field**. Account for the sticky header.
- Support reopening the same editor, saving, cancelling, and returning to the list.
- Make confirmation prompts clear about the affected item and outcome. Include
  an obvious way to keep the current state without making the change.
- Display loading, empty, error, success, and disabled states intentionally.
- Announce useful status messages accessibly without repeatedly interrupting users.

## 7. Owner-editable content and images

When an owner dashboard is in scope, identify editable content at the start:
text, prices, availability, categories, images, notices, and relevant settings.

For editable images:

- Support image URLs and file uploads where appropriate, with a preview.
- Let the owner replace or remove the image, not only add one when creating an item.
- Validate supported types and size limits, and explain those limits in the UI.
- Disable saving while a required upload is still in progress.
- Apply the image to the actual public content after saving, not just the editor.
- Preserve image changes after reload according to the selected storage mode.
- Handle failed uploads, invalid URLs, missing files, and full browser storage.
- Keep demo images browser-local; persist live images through authenticated storage.

## 8. Demo mode and production mode

A demo should be useful enough to present the real journey without requiring
production credentials. It must be clearly identified as a demo.

- Make the important demo interactions work: editing content, selecting options,
  submitting a demo transaction, and reviewing the result where relevant.
- A public demo access code may unlock local presentation tools if requested.
  It is a convenience gate, not secure authentication.
- A demo code must never grant database access, become a live API credential,
  or bypass production authorization.
- Demo mode must not silently fall through to production writes or payments.
- State that local demo changes belong to that browser/device and do not sync.
- Demonstrate how to reset demo data without accidentally resetting a live system.
- Keep real admin keys, service-role keys, and backend credentials on the server.
- Do not ask an owner to paste a database service-role key into a browser login.
- Use actual authentication and authorization for live administration.

## 9. Persistence, recovery, and synchronization

If a user creates something they may need later, plan its recovery flow from the
start: confirmations, references, receipts, bookings, orders, or saved enquiries.

- Provide a useful confirmation and explain how to return to it.
- Where appropriate, offer a browser-saved History or Recent activity view.
- Keep stored data minimal and distinguish demo from live entries.
- Clearly state the scope: same browser, signed-in account, or cross-device.
- Handle reloads, returning visits, back navigation, empty history, and storage errors.
- Synchronize visible counts and relevant state within the page and between tabs.
- If automatically copying a reference is appropriate, attempt it after success.
  Browser rejection must not turn a successful transaction into an apparent failure.
- Provide a manual Copy action and selectable text as fallbacks. Only claim
  something was copied when the clipboard operation actually succeeded.

## 10. Security and data correctness

- Validate permissions and important business rules on the server for live actions.
- Never trust a disabled client button as the only enforcement of a rule.
- Validate inputs, quantities, prices, state transitions, and ownership as relevant.
- Keep privileged infrastructure credentials and passwords out of client bundles,
  URLs, saved documentation, and public output. Customer recovery tokens belong
  only in their intended private confirmation/recovery flows.
- Return only the data a visitor is entitled to see; owner-only details must not
  accidentally appear in public tracking or confirmation responses.
- Make repeat submissions and retries safe where possible. Use conditional or
  transactional updates for actions that can race with another user or staff member.
- Do not apply remote database migrations, change production permissions, delete
  live data, or introduce paid services unless that action is authorized.
- Do not treat a demo access code as a production security mechanism.

## 11. Hosting and sharing

I need to be able to see and share the result, not just be told to run a command.

- Explain how to run the project locally, including its normal development command.
- Prepare the intended hosting workflow and publish when authorized.
- A static host such as GitHub Pages does not run server APIs or a database backend.
  Use a clearly separated static demo export or choose suitable server hosting.
- Test deployment-specific paths: navigation, public images, favicon, assets,
  direct links, and page reloads under a project subdirectory.
- Never deploy secrets or local environment files in a public static artifact.
- Distinguish code pushed, build passed, deployment running, and public site verified.
- Do not claim a URL is live simply because its address can be predicted.
- If settings or access block publication, prepare everything possible first and
  give me the exact remaining action and the relevant settings link.

## 12. Quality checks before calling it ready

Use checks appropriate to the scope; do not substitute a dummy passing test for
a real journey. Do not claim live integrations were tested when only mocks ran.

- Build and relevant type checks pass, or remaining failures are explained.
- The main visitor journey works from start through confirmation and recovery.
- Every visible action works or has an honest, useful unavailable state.
- Owner edits appear on the public site and survive reload in the intended mode.
- Layout holds at small, intermediate, and large widths with realistic edge cases.
- Button targets, contrast, focus, hover, active, disabled, and loading states work.
- Keyboard navigation and reduced-motion behavior are usable.
- Empty, invalid, failed, repeated, and cancelled operations behave sensibly.
- Counts, totals, and statuses remain consistent across the relevant views.
- Demo flows do not call live APIs or mutate production data.
- The translation placeholder cycles through all six labels every five seconds,
  stays the same size, and gives an honest coming-soon response until enabled.
- Deployment assets and direct page links work at the actual hosted path.
- No secrets or private customer details are accidentally exposed.

## 13. Handoff I expect

Keep the final explanation concise and practical:

1. What changed and how I use it.
2. What was actually verified.
3. The website link, if publication was authorized and completed.
4. Anything still demo-only, untested, or requiring external configuration.
5. Any precise next action I need to take.

Save reusable setup and operating instructions in the repository. Prefer finishing
an authorized task over repeatedly asking whether to continue. Respect existing
work and avoid unrelated rewrites or feature expansion.
