PRD — Mileage-Based Refuel Readiness PWA
1. Product Overview
Build a mobile-first web app (PWA) for tracking estimated refuel readiness for vehicles with non-functioning fuel gauges using:
	•	odometer readings
	•	distance since last confirmed full refuel
	•	fixed technical parameters per vehicle type, managed by admin
V1 supports only one vehicle type:
	•	האמר צבאי
Vehicle type selection should be from a closed dropdown, not free text.
The app should help users know when a vehicle is approaching refuel need based on mileage since last full refuel.
The app must not pretend to know the actual fuel level. It must always present outputs as estimated.
The entire user-facing interface must be in Hebrew with full RTL layout.

2. Problem Statement
Some vehicles do not have working fuel gauges, making it difficult to know when they need refueling.
Today, users rely on memory, rough estimates, or ad hoc tracking. This can lead to:
	•	late refueling and operational risk
	•	early refueling and inefficiency
	•	lack of visibility across the fleet
	•	no reliable tracking history
The product should replace guesswork with a simple mileage-based readiness workflow.

3. Product Goals
Enable field users and fleet admins to:
	•	record odometer readings quickly from mobile
	•	track distance traveled since the last full refuel
	•	estimate fuel readiness based on fixed vehicle-type parameters
	•	identify which vehicles are approaching refuel thresholds
	•	share the same fleet state across all users via centralized persistence

4. V1 Scope
Included in V1
	•	mobile-first PWA / responsive web app
	•	Hebrew RTL user interface
	•	closed dropdown list of vehicle types
	•	only one vehicle type in V1: האמר צבאי
	•	admin-managed technical parameters for vehicle type
	•	admin-managed vehicle creation
	•	vehicle list with current estimated fuel readiness
	•	odometer update flow via:
	◦	camera scan
	◦	manual entry fallback
	•	OCR suggestion with mandatory user confirmation/edit before save
	•	mark full refuel
	•	estimate fuel band and estimated remaining range
	•	color-coded operational status
	•	basic admin and field user roles
	•	centralized database-backed persistence
	•	code structure that allows the persistence layer to be replaced later
Out of Scope for V1
	•	native iOS/Android app
	•	App Store / Google Play publishing
	•	partial refuel handling
	•	AI / LLM / web research for vehicle specs
	•	free text vehicle type matching
	•	push notifications / SMS / WhatsApp alerts
	•	complex offline sync
	•	GPS / telematics integrations
	•	advanced permissions hierarchy
	•	route-aware / terrain-aware fuel prediction
	•	dynamic learning model for real-world fuel consumption

5. Users and Roles
Field User
Can:
	•	log in
	•	view vehicle list
	•	search/select vehicles
	•	update odometer reading
	•	mark full refuel
Cannot:
	•	create vehicles
	•	edit technical vehicle type parameters
	•	edit thresholds
Admin
Can do everything a field user can, plus:
	•	create and edit vehicles
	•	manage vehicle types
	•	define technical parameters for each vehicle type
	•	view fleet-wide status

6. Product Principles
	1	mobile first
	2	camera first, manual fallback
	3	minimal typing
	4	fast update flow
	5	no false precision
	6	always present fuel data as estimated
	7	admin controls technical assumptions
	8	simple enough for real field use
	9	centralized shared data, not local-only storage

7. Core Product Concept
Each vehicle belongs to a predefined vehicle type.
Each vehicle type has fixed technical parameters managed by admin:
	•	fuel tank capacity
	•	estimated km per liter
	•	fuel band thresholds
	•	operational alert thresholds
Each vehicle inherits these values from its assigned vehicle type.
The system estimates current fuel readiness by comparing:
	•	current confirmed odometer
	•	last full refuel odometer
	•	technical assumptions from the vehicle type
V1 has only one vehicle type, but the implementation should support more types later.

8. Data and Persistence Requirements
This is critical.
Centralized shared data
All core data must be stored in a centralized database, not only in local browser storage.
This includes:
	•	users
	•	vehicle types
	•	vehicles
	•	odometer readings
	•	refuel events
Updates by one user should be visible to other users after refresh.Simple refresh or polling is fine for V1. Realtime sync is not required.
Persistence architecture requirement
Structure the code so the persistence layer can be swapped later.
For example:
	•	V1 can use SQLite / Prisma or another simple DB approach
	•	later, I may want to connect the app to another database through MCP or another external integration layer
Therefore:
	•	data access should be centralized
	•	business logic should not be tightly coupled to the storage implementation
	•	UI components should not directly contain database logic
	•	do not rely on localStorage as the main source of truth

9. Functional Requirements
9.1 Authentication
Implement simple login with:
	•	username/email
	•	password
Support role-based access:
	•	field user
	•	admin

9.2 Vehicle Types
Use a closed dropdown list of vehicle types.
V1 list:
	•	האמר צבאי
Vehicle type parameters should be managed by admin only.
Fields:
	•	name
	•	fuel_tank_capacity_liters
	•	estimated_km_per_liter
	•	fuel band thresholds
	•	action thresholds
No AI, no automatic research, no free-text normalization.

9.3 Vehicles
Each vehicle should include:
	•	vehicle_number
	•	vehicle_type_id
	•	optional nickname
	•	optional notes
	•	last_full_refuel_odometer
	•	latest_confirmed_odometer
	•	calculated status fields
Rules:
	•	vehicles are created by admin
	•	field users select from existing vehicles
	•	vehicle technical parameters are inherited from the assigned vehicle type

9.4 Vehicle List Screen
The home screen should show a list of all vehicles.
For each vehicle, show:
	•	מספר רכב
	•	סוג רכב
	•	ק״מ אחרון
	•	ק״מ מאז תדלוק מלא אחרון
	•	סטטוס דלק משוער
	•	טווח נסיעה משוער שנותר
	•	סטטוס פעולה
	•	עודכן לאחרונה
The list should support:
	•	search by vehicle number
	•	tap into vehicle details
	•	admin CTA for adding a vehicle

9.5 Vehicle Details Screen
The vehicle details screen should show:
	•	vehicle number
	•	vehicle type
	•	latest odometer
	•	last full refuel odometer
	•	distance since full refuel
	•	estimated fuel band
	•	estimated remaining range
	•	operational alert status
	•	recent update history
Actions:
	•	סריקת ק״מ
	•	הזן ידנית
	•	סומן תדלוק מלא

9.6 Odometer Update Flow
Primary flow: camera-based scan
	1	user opens a vehicle
	2	user taps סריקת ק״מ
	3	camera opens
	4	user captures odometer image
	5	OCR extracts suggested mileage
	6	user sees editable suggested value
	7	user confirms or corrects the value
	8	system saves confirmed reading
	9	system recalculates vehicle status
Fallback flow: manual entry
	1	user opens vehicle
	2	user taps הזן ידנית
	3	user enters odometer value
	4	system validates and saves
	5	system recalculates vehicle status
OCR requirement
OCR must not auto-save values without user confirmation.
If OCR integration is not fully ready at first, it is acceptable to implement the flow with a mock OCR response or placeholder service, as long as the architecture remains ready for real OCR integration later.

9.7 Full Refuel Flow
	1	user opens vehicle
	2	user taps סומן תדלוק מלא
	3	user confirms the action
	4	system records a full refuel event
	5	the current confirmed odometer becomes the new last_full_refuel_odometer
	6	status calculations reset accordingly
V1 supports only full refuel.

9.8 Admin Vehicle Management
Admin should be able to:
	•	create a new vehicle
	•	edit an existing vehicle
	•	assign vehicle type
	•	optionally add nickname / notes
	•	initialize baseline odometer and last full refuel odometer if needed

9.9 Admin Vehicle Type Management
Admin should be able to manage the technical profile of the vehicle type:
	•	name
	•	fuel tank capacity
	•	estimated km/l
	•	fuel band thresholds
	•	operational thresholds
In V1 this can be a simple admin settings screen.

10. Business Logic
10.1 Core Formula
Distance since last full refuel
distance_since_refuel = latest_confirmed_odometer - last_full_refuel_odometer
If no full refuel baseline exists, the app should clearly show that a baseline is missing.
Estimated full range
estimated_full_range_km = fuel_tank_capacity_liters * estimated_km_per_liter
Estimated remaining range
estimated_remaining_range = estimated_full_range_km - distance_since_refuel
Minimum displayed value should not go below zero.
Estimated remaining percentage
estimated_remaining_percentage = max(0, estimated_remaining_range / estimated_full_range_km)

10.2 Estimated Fuel Band
Map the remaining percentage into user-friendly fuel bands.
Example thresholds:
	•	75%–100% → מלא / כמעט מלא
	•	50%–75% → כ־3/4 מיכל
	•	25%–50% → כ־חצי מיכל
	•	10%–25% → כ־רבע מיכל
	•	below 10% → רזרבה
These thresholds should be configurable by admin at the vehicle type level.

10.3 Operational Action Status
In addition to the estimated fuel band, show an action-oriented status.
Example thresholds:
	•	above 35% remaining → תקין
	•	20%–35% remaining → להיערך לתדלוק
	•	10%–20% remaining → לתדלק בקרוב
	•	below 10% remaining → לתדלק עכשיו
These thresholds should also be configurable by admin.

10.4 Important UX Rule
All user-facing copy must make it clear that this is an estimate.
Examples:
	•	סטטוס דלק משוער
	•	טווח נסיעה משוער
	•	מבוסס על ק״מ מאז תדלוק מלא אחרון
Do not present this as a real measured fuel level.

11. Validation Rules
11.1 Odometer Reading Validation
	•	confirmed mileage must be numeric
	•	mileage cannot be lower than the latest confirmed odometer
	•	if lower value is entered, show validation error
Suggested Hebrew error copy:
	•	יש להזין מספר ק״מ תקין
	•	לא ניתן להזין ק״מ נמוך מהקריאה האחרונה
11.2 Refuel Validation
	•	full refuel cannot be marked if there is no current confirmed odometer
	•	if attempted, show error
Suggested Hebrew error copy:
	•	לא ניתן לסמן תדלוק לפני הזנת ק״מ עדכני

12. Data Model
User
Fields:
	•	id
	•	name
	•	email_or_username
	•	password_hash
	•	role
	•	created_at
	•	updated_at
VehicleType
Fields:
	•	id
	•	name
	•	fuel_tank_capacity_liters
	•	estimated_km_per_liter
	•	fuel_band_threshold_75
	•	fuel_band_threshold_50
	•	fuel_band_threshold_25
	•	fuel_band_threshold_10
	•	action_threshold_plan_refuel
	•	action_threshold_refuel_soon
	•	action_threshold_refuel_now
	•	created_at
	•	updated_at
Optional:
	•	is_active
Vehicle
Fields:
	•	id
	•	vehicle_number
	•	vehicle_type_id
	•	nickname
	•	notes
	•	last_full_refuel_odometer
	•	latest_confirmed_odometer
	•	created_at
	•	updated_at
OdometerReading
Fields:
	•	id
	•	vehicle_id
	•	user_id
	•	input_method (scan / manual)
	•	ocr_value
	•	confirmed_value
	•	image_url or file reference
	•	created_at
RefuelEvent
Fields:
	•	id
	•	vehicle_id
	•	user_id
	•	event_type (full_refuel)
	•	odometer_at_refuel
	•	created_at

13. Derived Fields / Computed Values
These may be calculated in backend responses or frontend logic:
	•	distance_since_refuel
	•	estimated_full_range
	•	estimated_remaining_range
	•	estimated_remaining_percentage
	•	estimated_fuel_band
	•	action_status

14. Required Screens
14.1 Login Screen
Hebrew RTL login screen.
Fields:
	•	שם משתמש / אימייל
	•	סיסמה
Button:
	•	התחברות

14.2 Vehicle List Screen
Main screen after login.
Content:
	•	search bar
	•	vehicle cards or rows
	•	color-coded statuses
	•	admin CTA for adding vehicle

14.3 Vehicle Details Screen
Content:
	•	vehicle summary
	•	latest status
	•	latest odometer
	•	distance since refuel
	•	estimated remaining range
	•	action buttons
	•	recent update history
Actions:
	•	סריקת ק״מ
	•	הזן ידנית
	•	סומן תדלוק מלא

14.4 Scan Screen
Content:
	•	camera capture
	•	OCR processing state
	•	editable extracted mileage field
	•	confirm button
	•	retry button
	•	switch to manual entry

14.5 Manual Entry Screen or Modal
Content:
	•	numeric input for odometer
	•	save button
	•	cancel button

14.6 Admin Vehicle Management Screen
Content:
	•	vehicle list
	•	add/edit vehicle form
Fields:
	•	מספר רכב
	•	סוג רכב
	•	כינוי
	•	הערות

14.7 Admin Vehicle Type Settings Screen
Content:
	•	manage technical assumptions for האמר צבאי
	•	editable numeric fields for:
	◦	fuel tank capacity
	◦	km per liter
	◦	fuel and action thresholds

15. Hebrew UI Requirements
The entire user-facing application must be in Hebrew.
Requirements:
	•	full RTL layout
	•	Hebrew labels, buttons, statuses, and validation messages
	•	numbers may remain standard numeric formatting
	•	design should feel natural on Hebrew mobile screens
Suggested key labels:
	•	מספר רכב
	•	סוג רכב
	•	ק״מ אחרון
	•	ק״מ מאז תדלוק
	•	סטטוס דלק משוער
	•	טווח נסיעה משוער
	•	סטטוס פעולה
	•	סריקת ק״מ
	•	הזן ידנית
	•	סומן תדלוק מלא
	•	עודכן לאחרונה
Suggested status labels:
Fuel band:
	•	מלא / כמעט מלא
	•	כ־3/4 מיכל
	•	כ־חצי מיכל
	•	כ־רבע מיכל
	•	רזרבה
Action status:
	•	תקין
	•	להיערך לתדלוק
	•	לתדלק בקרוב
	•	לתדלק עכשיו

16. UX Requirements
	•	mobile-first responsive design
	•	large tap targets
	•	minimal typing
	•	high readability outdoors
	•	fast scan-confirm-save flow
	•	avoid clutter
	•	show the most important information first
	•	status should be understandable in under 2 seconds
Performance goal:A field user should be able to update a vehicle in under 20 seconds in normal conditions.

17. Edge Cases
The system should handle the following gracefully:
	1	OCR returns wrong value
	◦	user can correct before saving
	2	camera use fails
	◦	user can switch to manual entry
	3	user enters odometer lower than previous
	◦	show validation error
	4	vehicle has never been refueled in the system
	◦	show missing baseline state clearly
	◦	prevent accurate estimation until baseline exists
	5	vehicle has no odometer reading yet
	◦	show onboarding / empty state
	6	estimated remaining range becomes negative
	◦	display zero and urgent status
	7	admin changes vehicle type parameters
	◦	future calculations should use the updated parameters
	◦	raw historical events should remain unchanged
Recommended V1 approach:
	•	use current vehicle type settings for current status display
	•	keep raw historical events unchanged

18. Empty States
Examples of useful empty states:
No vehicles yet
	•	אין עדיין רכבים במערכת
No odometer updates yet
	•	עדיין לא הוזן ק״מ לרכב זה
No full refuel baseline
	•	יש לסמן תדלוק מלא ראשון כדי להתחיל לחשב סטטוס דלק משוער

19. Success Metrics
V1 success should be measured by:
	•	percentage of vehicles with a recent odometer reading
	•	percentage of vehicles with a valid full-refuel baseline
	•	average time to update odometer reading
	•	percentage of OCR readings accepted without correction
	•	percentage of vehicles with a visible estimated status
	•	number of vehicles reaching reserve state without prior warning action

20. Technical Direction
Prefer a practical architecture such as:
	•	Next.js
	•	TypeScript
	•	Tailwind CSS
	•	Prisma
	•	SQLite for local prototype
	•	clean separation between UI, business logic, and data access
However, choose the simplest practical stack that satisfies all requirements above.
Important:
	•	do not make the app local-only
	•	do not hardcode all data in frontend state
	•	do not couple business logic tightly to the DB implementation
	•	structure data access so the persistence layer can later be replaced with another external DB connection

21. Recommended Build Order
Phase 1
	•	auth
	•	Hebrew RTL shell
	•	vehicle types backend
	•	admin vehicle creation
	•	vehicle list screen
Phase 2
	•	manual odometer entry
	•	status calculation
	•	full refuel action
Phase 3
	•	camera capture
	•	OCR suggestion flow
	•	reading history
Phase 4
	•	polish
	•	validation improvements
	•	admin settings for thresholds
	•	PWA installability improvements

22. Non-Goals
The product is not trying to:
	•	replace a real fuel sensor
	•	provide exact fuel level
	•	predict fuel usage based on driving conditions
	•	integrate with external military systems in V1
	•	manage maintenance or repairs in V1

23. Final Product Definition
A Hebrew, mobile-first PWA that helps users track estimated refuel readiness for military Humvees without working fuel gauges by using odometer readings and the distance since the last confirmed full refuel.
