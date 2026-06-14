# Manual screenshots

These 45 shots can't be auto-navigated (logged-out pages, token-gated
links, the public storefront, the Stripe "active" state, or native-only mobile
screens). Capture them by hand and save to the listed path under `images/`.

## sign-in-page
- **Save to:** `images/using-zoop/getting-started/sign-in-page.png`
- **Shows:** Zoop sign-in page with email and password fields and a Continue with Google button
- **How:** This is the unauthenticated /login route (app.zoop.pro/login). Must be captured while logged out. The page renders the email/password form and the Google OAuth button side-by-side below a divider.

## onboarding-company-setup
- **Save to:** `images/using-zoop/getting-started/onboarding-company-setup.png`
- **Shows:** Zoop onboarding screen with a company name field and trade picker dropdown
- **How:** Lives at app.zoop.pro/onboarding. Only shown to authenticated users who have no tenant membership yet. Capture with a fresh test account that has signed up but not yet completed onboarding. Scroll to show both the Company name field and the trade picker (TradePicker component) and the Get started button.

## settings-card-payments-active
- **Save to:** `images/using-zoop/getting-started/settings-card-payments-active.png`
- **Shows:** Settings Card payments page showing a green Active badge and an Open Stripe dashboard button
- **How:** Route is /{tenant}/settings/payments (confirmed sub-route in codebase). The active state requires a fully onboarded Stripe Connect account linked to the tenant (charges_enabled=true, payouts_enabled=true). Use a Stripe test-mode account that has completed onboarding so the PaymentsClient renders the emerald Active badge and the Open Stripe dashboard button. Cannot be auto-navigated without a live Stripe Connect setup.

## customer-detail-overview
- **Save to:** `images/using-zoop/customers/customer-detail-overview.png`
- **Shows:** Customer detail page with the Overview, Contacts, Locations, Timeline, Billing, Notes, and Files tab bar, and the Overview tab content showing identity and contact cards.
- **How:** Replace [id] with the UUID of a real seeded customer in the david-company tenant. Navigate to /{tenant}/customers/{id} — the Overview tab is the default (no ?tab= param needed). Capture with the tab bar and both identity and contact card sections fully visible.

## edit-customer-sheet-behavior
- **Save to:** `images/using-zoop/customers/edit-customer-sheet-behavior.png`
- **Shows:** Edit customer slide-over sheet open and scrolled to the Behavior section, showing the VIP customer and Do not contact toggles.
- **How:** From a customer detail page, click the pencil/Edit button in the header to open the EditCustomerSheet (a right-side slide-over panel). Scroll the panel down to the Behavior section so both the 'VIP customer' and 'Do not contact' switches are visible. Capture just the sheet panel — the Behavior section is roughly mid-form, below Identity and Source.

## contacts-tab
- **Save to:** `images/using-zoop/customers/contacts-tab.png`
- **Shows:** Contacts tab on the customer detail page showing multiple contact cards, each with edit, delete, and promote-to-primary action buttons.
- **How:** Navigate to /{tenant}/customers/{id}?tab=contacts for a customer that has at least two contacts so the card list and all three per-card actions (edit, delete, promote-to-primary) are visible. Replace [id] with the appropriate seeded customer UUID.

## add-location-dialog
- **Save to:** `images/using-zoop/customers/add-location-dialog.png`
- **Shows:** Add location dialog open on the Locations tab, showing the type selector, address autocomplete field, and access, parking, and service notes fields.
- **How:** Navigate to /{tenant}/customers/{id}?tab=locations, then click the 'Add location' button to open the Dialog. The LocationForm renders inside a Dialog size='2xl'. Replace [id] with a real customer UUID. Scroll the dialog if needed to show the address autocomplete and the three notes fields.

## timeline-tab
- **Save to:** `images/using-zoop/customers/timeline-tab.png`
- **Shows:** Timeline tab on the customer detail page showing All, SMS, Email, Calls, and AI sessions filter chips above a list of communication entry cards.
- **How:** Navigate to /{tenant}/customers/{id}?tab=timeline for a customer that has recorded communications (SMS, email, or calls) so the filter chips and at least 2–3 timeline entry cards are visible. Replace [id] with an appropriate seeded customer UUID.

## find-duplicates-dialog
- **Save to:** `images/using-zoop/customers/find-duplicates-dialog.png`
- **Shows:** Find duplicates dialog listing candidate customer records with High, Medium, and Low confidence badges and a 'Merge into this customer' button on each.
- **How:** Open a customer detail page (Overview tab), locate the Manage card, and click 'Find Duplicates'. The FindDuplicatesDialog opens only after the API returns candidates. This requires a tenant with seeded near-duplicate customers so the candidates list is non-empty. Cannot be auto-navigated — the dialog is triggered by an async button action and depends on the API returning results.

## job-detail-overview
- **Save to:** `images/using-zoop/jobs/job-detail-overview.png`
- **Shows:** Job detail page showing the title and status badge in the header, Customer, Schedule, and Assigned techs overview cards, the line-items table with a subtotal row, and the photos and notes panels below
- **How:** Use a one-time (non-recurring) scheduled job that has a customer, at least one assigned tech, two or more line items, and at least one structured note so all sections render. Replace [id] with the real job ID from the seeded data.

## job-edit-mode-modal
- **Save to:** `images/using-zoop/jobs/job-edit-mode-modal.png`
- **Shows:** Apply changes to dialog with three radio options: Just this occurrence, This and future occurrences, and All occurrences
- **How:** This modal only opens when the user clicks Edit on a job that belongs to a recurring series (series_id is set). Navigate to a recurring job detail page, then click the Edit button to trigger the EditModeModal dialog, then capture the open dialog. Cannot be auto-navigated because it requires a seeded recurring series and a button-click interaction.

## series-detail-overview
- **Save to:** `images/using-zoop/recurring-jobs/series-detail-overview.png`
- **Shows:** Series detail page showing the recurrence rule summary, customer link, line items, and the upcoming and past instance lists.
- **How:** Requires a seeded recurring job series with at least one upcoming and one past/completed instance. Navigate to /{tenant}/jobs/series/<id> for a series that has both upcoming and past visits populated. Capture the full page so the recurrence summary pill, the Upcoming section, and the Past section are all visible.

## series-detail-instance-lists
- **Save to:** `images/using-zoop/recurring-jobs/series-detail-instance-lists.png`
- **Shows:** Series detail page scrolled to the Upcoming and Past instance lists, each row showing job title, scheduled date, and status badge.
- **How:** Requires a seeded series with populated upcoming and past visits (same series used for series-detail-overview). Navigate to /{tenant}/jobs/series/<id> and scroll down past the line items divider so both the Upcoming and Past sections are in frame.

## edit-scope-modal
- **Save to:** `images/using-zoop/recurring-jobs/edit-scope-modal.png`
- **Shows:** Apply changes to dialog open on a recurring job detail page, with three radio options: Just this occurrence, This and future occurrences, and All occurrences.
- **How:** The scope picker is an in-page dialog (EditModeModal) that only appears when clicking Edit on a job that belongs to a series (job.series_id is set). Requires a seeded recurring job instance. Navigate to /{tenant}/jobs/<recurring-job-id>, click the plain Edit button in the top-right of the job card, then capture the dialog before clicking Continue.

## quotes-line-items-catalog
- **Save to:** `images/using-zoop/quotes/quotes-line-items-catalog.png`
- **Shows:** Quote editor line items table with a pricebook catalog item selected and its unit price auto-populated.
- **How:** Requires an existing draft quote with at least one line item linked to a catalog item (catalog_item_id set and unit_price populated). Open the quote detail page, scroll to the line items table. Cannot be auto-navigated because the right data state must be pre-seeded.

## quotes-sections-expanded
- **Save to:** `images/using-zoop/quotes/quotes-sections-expanded.png`
- **Shows:** Quote editor showing two named sections, each expanded with its own line items table and a date range badge in the section header.
- **How:** Requires a draft quote with two sections, each having at least one line item and start/end dates set (so the date badge is visible). Open the quote detail page and scroll to the Sections area. Pre-seed the data before capture.

## quotes-tool-inputs-chip
- **Save to:** `images/using-zoop/quotes/quotes-tool-inputs-chip.png`
- **Shows:** Quote editor Tool inputs panel showing a lawn measurement chip labelled with square footage and property address.
- **How:** Requires a quote with a saved lawn measurement attached (a quote_tool_inputs row with kind='lawn' and populated data). Open the quote detail page and scroll to the Tool inputs panel. Pre-seed the measurement before capture.

## quotes-share-dialog-url
- **Save to:** `images/using-zoop/quotes/quotes-share-dialog-url.png`
- **Shows:** Share with customer dialog open on a quote, showing the generated share URL in a read-only field and the Copy button beside it.
- **How:** The generated URL is only shown immediately after clicking 'Issue new link' in the ShareQuoteDialog — it is never re-displayed on reopen. To capture: open an existing quote, click 'Share with customer' in the header, then click 'Issue new link', and screenshot before closing the dialog.

## quotes-accepted-sidebar
- **Save to:** `images/using-zoop/quotes/quotes-accepted-sidebar.png`
- **Shows:** Accepted quote detail page showing the 'What would you like to do next?' sidebar panel with Create job and Create invoice buttons.
- **How:** Requires a quote in 'accepted' status with at least one line item (so the buttons are enabled, not greyed out). The sidebar only renders when quote.status === 'accepted'. Open the quote detail page — no extra UI actions are needed, the sidebar is visible immediately.

## job-detail-create-invoice-action
- **Save to:** `images/using-zoop/invoices/job-detail-create-invoice-action.png`
- **Shows:** Job detail page with the Create invoice action visible in the Connections sidebar.
- **How:** The job detail page (job-detail-client.tsx) does not expose a standalone 'Create invoice' button in its action bar. Invoice creation from a job is triggered via the API (from_job_id). The Connections sidebar shows existing associated invoices only after at least one has been created. Capture requires: (1) a real job in the app with an associated invoice already created, or (2) a seeded data state where the sidebar renders. Navigate to a specific job ID that has a linked invoice, then capture the Connections sidebar showing the invoice entry.

## quote-detail-create-invoice-action
- **Save to:** `images/using-zoop/invoices/quote-detail-create-invoice-action.png`
- **Shows:** Quote detail page for an accepted quote, with the 'Create invoice' button visible in the right sidebar.
- **How:** The 'Create invoice' button (quote-detail-client.tsx line 639-647) only renders in the sidebar when quote.status === 'accepted'. Navigate to a specific accepted quote's detail page. The sidebar card reads 'What would you like to do next?' and contains both 'Create job' and 'Create invoice' outline buttons. Capture the full page or at least the sidebar section so both buttons are visible alongside the accepted status badge.

## autopay-status-on
- **Save to:** `images/using-zoop/recurring-billing/autopay-status-on.png`
- **Shows:** Auto-pay status card showing "Auto-pay is on" with card brand and last four digits.
- **How:** Requires a plan that has active auto-pay consent (consent record with a non-null processor_mandate_id and auto_charge_enabled=true). Navigate to /{tenant}/plans/{id} for a plan in that state. The "Auto-pay is on" panel with the ShieldCheck icon and card brand/last4 will be visible in the right column of the summary grid.

## pricebook-category-tree
- **Save to:** `images/using-zoop/pricebook/category-tree.png`
- **Shows:** Category tree on the Categories page showing a two-level hierarchy with the drag handle icon visible on a hovered row.
- **How:** Requires seeded category data with at least one parent and one child category. Navigate to /{tenant}/pricebook/categories, hover over a category row to reveal its drag handle, then capture. The drag handle appears on CSS :hover and cannot be triggered programmatically in a static screenshot tool.

## pricebook-csv-import-map
- **Save to:** `images/using-zoop/pricebook/csv-import-map.png`
- **Shows:** CSV import wizard at the Map Headers step, with each CSV column mapped to a Zoop field and a three-row data preview table below.
- **How:** Navigate to /{tenant}/pricebook/items/import. The wizard opens at the Upload step; you must drag or browse a sample CSV file and let it parse before the Map step appears. Capture after the wizard advances to Step 2: Map Headers with the column-mapping dropdowns and preview table visible.

## customer-timeline-mixed-messages
- **Save to:** `images/using-zoop/communications/customer-timeline-mixed-messages.png`
- **Shows:** Customer timeline tab showing a mix of inbound and outbound SMS and email entries with delivery status badges.
- **How:** Requires a customer record seeded with several inbound and outbound SMS and email communications. Navigate to /{tenant}/customers/<seeded-customer-id>?tab=timeline and confirm the timeline shows at least one inbound SMS, one outbound SMS, and one email entry (any direction) before capturing. The filter chips must be visible at the top and the entries list must be populated.

## customer-timeline-filter-chips
- **Save to:** `images/using-zoop/communications/customer-timeline-filter-chips.png`
- **Shows:** Customer Timeline tab with All, SMS, Email, Calls, and AI sessions filter chips across the top.
- **How:** Navigate to /{tenant}/customers/<any-customer-id>?tab=timeline. The five filter chips (All, SMS, Email, Calls, AI sessions) render regardless of whether there is data. Capture with the default 'All' chip selected (dark/filled). Use a customer with at least some timeline entries so the list is not empty beneath the chips.

## customer-timeline-failed-delivery
- **Save to:** `images/using-zoop/communications/customer-timeline-failed-delivery.png`
- **Shows:** Customer timeline entry with a red 'failed' status badge and a delivery failure reason visible.
- **How:** Requires a customer whose timeline contains at least one outbound SMS or email communication with status 'failed' and a failure reason stored. Trigger a known-bad send via the API (e.g. to an invalid number) or locate an existing failed entry via the Supabase dashboard, then navigate to /{tenant}/customers/<that-customer-id>?tab=timeline and scroll to the failed entry before capturing. The red 'failed' badge and reason text must both be visible in the card.

## notes-version-history-panel
- **Save to:** `images/using-zoop/notes/notes-version-history-panel.png`
- **Shows:** Version history side panel open on the right, listing v1, v2, v3 entries each with the author name, relative timestamp, and a Restore button.
- **How:** The VersionHistoryPanel component exists at src/components/notes/version-history-panel.tsx but has no UI entry point wired in the notes feed, note card, or composer as of the current codebase (confirmed by the TODO(verify) callout immediately below this one in the doc). To capture: open the panel programmatically (e.g. via browser console or a temporary dev trigger) against a note that has been edited at least twice so multiple version rows (v1, v2, etc.) are visible. Capture the panel in its open/slid-in state with the version list populated.

## team-pending-invites
- **Save to:** `images/using-zoop/team/team-pending-invites.png`
- **Shows:** Pending invites table showing email, role, expiry, and the resend and revoke icon buttons
- **How:** The pending-invites section (aria-labelledby='pending-invites-heading') is hidden entirely when there are no pending invitations — it only renders when invitations.length > 0 (see team-page.tsx line 363). Seed the tenant with at least one outstanding invite before navigating to /{tenant}/settings/team, then crop to the 'Pending invites' section so both the ArrowPathIcon (resend) and NoSymbolIcon (revoke) action buttons are visible in the last column.

## crews-table
- **Save to:** `images/using-zoop/team/crews-table.png`
- **Shows:** Crews page with the crew table showing name, member count, and manage/rename/archive icons
- **How:** The crews table only renders when visibleCrews.length > 0 (see crews-page.tsx line 381); an empty tenant shows an empty-state card instead. Seed at least one active crew, then navigate to /{tenant}/settings/team/crews. Capture the table section so the Name, Members columns and the three icon buttons (UserGroupIcon manage, PencilIcon rename, NoSymbolIcon archive) are all visible in an active row.

## job-assignee-picker-with-crew
- **Save to:** `images/using-zoop/team/job-assignee-picker-with-crew.png`
- **Shows:** Assigned techs combobox open with a Crews section above individual team members in the dropdown
- **How:** The MemberPicker dropdown (component at src/components/jobs/member-picker.tsx) renders a 'Crews' section above individual member rows only when active crews exist and the job is an instance edit (not a series-level edit). Navigate to /{tenant}/jobs/[id]/edit for a real job instance, click the 'Assigned techs' combobox to open the dropdown, then capture it while the dropdown is open showing at least one crew name row and at least one individual member row. Requires seeded crews and team members.

## storefront-published-page
- **Save to:** `images/using-zoop/storefront/storefront-published-page.png`
- **Shows:** Published storefront page showing hero, services grid, booking widget, service area map, and contact and hours panel.
- **How:** This is the public-facing page at https://app.zoop.pro/{tenant} (the (storefront) route group). It requires the tenant to be published (published_at not null) and ideally has seeded data: logo, tagline, trade types, service area, and business hours. Load the page while not authenticated to capture the true public view. Scroll and capture the full page.

## customer-portal-home
- **Save to:** `images/using-zoop/customer-portal/portal-home.png`
- **Shows:** Customer portal home showing business logo, outstanding quotes, past invoices, saved payment methods, and auto-pay sections.
- **How:** The portal lives at /{tenant}/account/[token] (src/app/[tenantId]/(storefront)/account/[token]/page.tsx). The token is a one-way hash that cannot be reconstructed — capture by generating a real portal link for a seeded test customer (owner role required), then opening the link in a browser. Ensure the customer has at least one outstanding quote, one past invoice, one saved card, and one active auto-pay consent so all four sections are visible. Scroll to show the full page or stitch sections.

## invoice-pay-block
- **Save to:** `images/using-zoop/customer-portal/invoice-pay-block.png`
- **Shows:** Invoice page pay block with Pay now button and collapsed Or pay offline disclosure section.
- **How:** The invoice page lives at /{tenant}/invoice/[token] (src/app/[tenantId]/(storefront)/invoice/[token]/page.tsx). Access requires a real invoice token. To show both the Pay now button and the Or pay offline disclosure, the test tenant must have Stripe connected AND payment instructions configured in settings. Open the invoice link for an unpaid invoice, then expand the Or pay offline disclosure before capturing. Crop to the pay block area below the line-items table.

## customer-portal-access-section
- **Save to:** `images/using-zoop/customer-portal/portal-access-section.png`
- **Shows:** Portal access card on the customer detail page showing an Active badge, created and last seen timestamps, and Generate and Revoke buttons.
- **How:** Navigate to a customer detail page as an owner-role user who has already generated a portal token for that customer (so the Active badge and both timestamps are populated). The PortalAccessSection component is rendered inside the customer detail page at src/app/[tenantId]/(management)/customers/[id]/page.tsx. Scroll to the Portal access card and crop to it. If automating, use a seeded customer with has_active_token=true and a non-null last_used_at so all metadata rows render.

## portal-auto-pay-section
- **Save to:** `images/using-zoop/customer-portal/portal-auto-pay-section.png`
- **Shows:** Auto-pay section on the customer portal listing an active consent row with plan name, card details, granted date, and a Turn off button.
- **How:** The auto-pay section is part of the customer portal at /{tenant}/account/[token] (src/app/[tenantId]/(storefront)/account/[token]/auto-pay-section.tsx). Access requires a real portal token. Ensure the test customer has at least one active auto-pay consent with a plan name and linked card so the consent row is visible. Scroll to the Auto-pay section and crop to it. If the customer has a zooper-attested consent, include that row to show the badge.

## mobile-app-store-listing
- **Save to:** `images/using-zoop/mobile/app-store-listing.png`
- **Shows:** Zoop app listing on the App Store and Google Play, showing the app icon and name
- **How:** Requires capturing the App Store (iOS) and/or Google Play (Android) store listing pages for the Zoop app. These are public storefronts, not reachable via app.zoop.pro. A human must screenshot the store listing or the app icon on a physical device home screen.

## mobile-login-tenant-picker
- **Save to:** `images/using-zoop/mobile/login-tenant-picker.png`
- **Shows:** Zoop mobile login screen showing email and social sign-in options, followed by the business picker for multi-tenant accounts
- **How:** LoginScreen and TenantPicker are native-only Capacitor screens rendered in mobile/src/ui/LoginScreen.tsx and mobile/src/ui/TenantPicker.tsx. They are not served at any app.zoop.pro route. Capture on a physical device or simulator: open the app signed out (or sign out), screenshot the LoginScreen, then sign in with a multi-tenant account to get the TenantPicker. Combine or use two shots.

## mobile-today-screen
- **Save to:** `images/using-zoop/mobile/today-screen.png`
- **Shows:** Today tab in the Zoop mobile app showing today's jobs sorted by start time with colour-coded status badges
- **How:** TodayScreen is a native-only Capacitor screen in mobile/src/ui/TodayScreen.tsx. Not accessible via app.zoop.pro. Capture on device or simulator with a test account that has at least two or three jobs scheduled for today so the list is visible. Ensure status badges (Scheduled, Done, etc.) are visible.

## mobile-jobs-screen
- **Save to:** `images/using-zoop/mobile/jobs-screen.png`
- **Shows:** Jobs tab in the Zoop mobile app with All, Scheduled, Unscheduled, Done, and Cancelled filter chips shown above the job list
- **How:** JobsScreen is a native-only Capacitor screen in mobile/src/ui/JobsScreen.tsx. Not accessible via app.zoop.pro. Capture on device or simulator. Ensure the status chips (All, Scheduled, Unscheduled, Done, Cancelled) are visible without any chip active, or with one chip tapped to show filter in use.

## mobile-customers-screen
- **Save to:** `images/using-zoop/mobile/customers-screen.png`
- **Shows:** Customers tab in the Zoop mobile app showing a customer row with the Active badge indicating a currently scheduled job
- **How:** CustomersScreen is a native-only Capacitor screen in mobile/src/ui/CustomersScreen.tsx. Not accessible via app.zoop.pro. Requires an owner or office-manager account. Capture on device or simulator with a test customer who has at least one scheduled job so the Active badge appears on their row.

## mobile-invoices-screen
- **Save to:** `images/using-zoop/mobile/invoices-screen.png`
- **Shows:** Invoices tab in the Zoop mobile app showing outstanding balance and paid-this-month summary cards above the invoice list
- **How:** InvoicesScreen is a native-only Capacitor screen in mobile/src/ui/InvoicesScreen.tsx. Not accessible via app.zoop.pro. Capture on device or simulator with a test account that has an outstanding invoice balance and at least one payment collected this month so both summary cards render at the top.

## mobile-quotes-screen
- **Save to:** `images/using-zoop/mobile/quotes-screen.png`
- **Shows:** Quotes tab in the Zoop mobile app showing the accepted-quotes banner indicating quotes ready to convert to invoices
- **How:** QuotesScreen is a native-only Capacitor screen in mobile/src/ui/QuotesScreen.tsx. Not accessible via app.zoop.pro. Capture on device or simulator with a test account that has at least one quote in Accepted status so the banner appears at the top of the screen.

## mobile-note-composer-recording
- **Save to:** `images/using-zoop/mobile/note-composer-recording.png`
- **Shows:** Zoop mobile note composer with a voice recording in progress, showing the elapsed-time timer on the Stop button
- **How:** NoteComposer is a native-only Capacitor screen in mobile/src/ui/NoteComposer.tsx, opened via the + button above the tab bar. Not accessible via app.zoop.pro. Capture on a physical device (microphone permission required): tap +, tap Record note, speak briefly, then screenshot while recording is active so the elapsed-time timer is visible on the Stop button.

## missed-jobs-needs-rescheduling-tray
- **Save to:** `images/using-zoop/ai-features/missed-jobs-needs-rescheduling-tray.png`
- **Shows:** Needs rescheduling tray above the dispatch board listing a missed job row with the customer name, original scheduled date, and the Reschedule button.
- **How:** The MissedJobsTray component only renders when there are jobs in the `scheduled` state whose scheduled date has already passed. Seed at least one such job in the david-company tenant (set its scheduled date to a past date and leave it in `scheduled` status), then navigate to /{tenant}/route/dispatch. The tray appears above the dispatch board — capture it with the board visible below for context.
