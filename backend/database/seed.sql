-- =====================================================
-- FLEETHUB DATABASE SEED DATA
-- =====================================================

BEGIN;

-- Cleanup existing demo data if any (cascading order)
TRUNCATE TABLE 
    notifications,
    ai_driver_recommendations,
    driver_concerns,
    driver_coaching_goals,
    driver_daily_scores,
    trip_events,
    completed_trips,
    driver_schedule_stops,
    driver_schedules,
    delivery_tracking_steps,
    deliveries,
    delivery_requests,
    vehicle_assignments,
    vehicles,
    drivers,
    fleet_managers,
    clients,
    users
CASCADE;

-- =====================================================
-- 1. USERS (13 Total: 2 Managers, 5 Drivers, 6 Clients)
-- =====================================================

INSERT INTO users (id, email, password_hash, role, full_name, phone_number, avatar_url, created_at, updated_at) VALUES
-- Managers
('a0000000-0000-0000-0000-000000000001', 'amit.rao@fleethub.io', crypt('ManagerPass123!', gen_salt('bf')), 'manager', 'Amit Rao', '+91 98201 11223', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2026-01-01 08:00:00', '2026-01-01 08:00:00'),
('a0000000-0000-0000-0000-000000000002', 'sneha.iyer@fleethub.io', crypt('ManagerPass123!', gen_salt('bf')), 'manager', 'Sneha Iyer', '+91 98202 22334', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '2026-01-01 08:00:00', '2026-01-01 08:00:00'),

-- Drivers
('b0000000-0000-0000-0000-000000000001', 'rahul.sharma@fleethub.io', crypt('DriverPass123!', gen_salt('bf')), 'driver', 'Rahul Sharma', '+91 98765 43210', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
('b0000000-0000-0000-0000-000000000002', 'vikram.patil@fleethub.io', crypt('DriverPass123!', gen_salt('bf')), 'driver', 'Vikram Patil', '+91 98765 43211', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2026-01-11 09:00:00', '2026-01-11 09:00:00'),
('b0000000-0000-0000-0000-000000000003', 'aman.verma@fleethub.io', crypt('DriverPass123!', gen_salt('bf')), 'driver', 'Aman Verma', '+91 98765 43212', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2026-01-12 09:00:00', '2026-01-12 09:00:00'),
('b0000000-0000-0000-0000-000000000004', 'priya.nair@fleethub.io', crypt('DriverPass123!', gen_salt('bf')), 'driver', 'Priya Nair', '+91 98765 43213', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2026-01-13 09:00:00', '2026-01-13 09:00:00'),
('b0000000-0000-0000-0000-000000000005', 'imran.sheikh@fleethub.io', crypt('DriverPass123!', gen_salt('bf')), 'driver', 'Imran Sheikh', '+91 98765 43214', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '2026-01-14 09:00:00', '2026-01-14 09:00:00'),

-- Clients
('c0000000-0000-0000-0000-000000000001', 'contact@acmecorp.com', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Rajesh Mehta', '+91 22 6123 4501', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', '2026-01-05 10:00:00', '2026-01-05 10:00:00'),
('c0000000-0000-0000-0000-000000000002', 'logistics@nordretail.in', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Ananya Deshmukh', '+91 22 6123 4502', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', '2026-01-05 10:00:00', '2026-01-05 10:00:00'),
('c0000000-0000-0000-0000-000000000003', 'dispatch@healthmart.org', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Dr. Sunil Kulkarni', '+91 22 6123 4503', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150', '2026-01-06 10:00:00', '2026-01-06 10:00:00'),
('c0000000-0000-0000-0000-000000000004', 'supply@quickbuild.co', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Rohan Shinde', '+91 22 6123 4504', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '2026-01-06 10:00:00', '2026-01-06 10:00:00'),
('c0000000-0000-0000-0000-000000000005', 'orders@teasky.com', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Kabir Sen', '+91 22 6123 4505', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '2026-01-07 10:00:00', '2026-01-07 10:00:00'),
('c0000000-0000-0000-0000-000000000006', 'ops@pharmaflex.in', crypt('ClientPass123!', gen_salt('bf')), 'client', 'Meera Joshi', '+91 22 6123 4506', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '2026-01-07 10:00:00', '2026-01-07 10:00:00');


-- =====================================================
-- 2. CLIENTS (6 Clients)
-- =====================================================

INSERT INTO clients (id, user_id, client_code, company_name, billing_address, contact_person, contact_phone, industry, created_at) VALUES
('c1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'CLI-ACM-01', 'Acme Corp', 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093', 'Rajesh Mehta', '+91 22 6123 4501', 'Electronics & Technology', '2026-01-05 10:30:00'),
('c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'CLI-NRD-02', 'Nord Retail', 'Tower 3, Central Logistics Hub, Vashi, Navi Mumbai, Maharashtra 400703', 'Ananya Deshmukh', '+91 22 6123 4502', 'Retail & Apparel', '2026-01-05 10:30:00'),
('c1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'CLI-HLT-03', 'HealthMart', 'Building 7, Medipark Complex, Wagle Estate, Thane, Maharashtra 400604', 'Dr. Sunil Kulkarni', '+91 22 6123 4503', 'Pharmaceuticals & Healthcare', '2026-01-06 11:00:00'),
('c1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'CLI-QKB-04', 'QuickBuild', 'Survey 88, Pune Industrial Corridor, Chakan, Pune, Maharashtra 410501', 'Rohan Shinde', '+91 22 6123 4504', 'Construction & Hardware', '2026-01-06 11:00:00'),
('c1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'CLI-TSK-05', 'Tea Sky Ltd.', '14 Artisan Roastery Estate, Senapati Bapat Road, Pune, Maharashtra 411016', 'Kabir Sen', '+91 22 6123 4505', 'Food & Beverages', '2026-01-07 11:30:00'),
('c1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 'CLI-PHF-06', 'Pharmaflex', 'Biotech Zone, Ambad Industrial Estate, Nashik, Maharashtra 422010', 'Meera Joshi', '+91 22 6123 4506', 'Specialty Medical Supplies', '2026-01-07 11:30:00');


-- =====================================================
-- 3. FLEET MANAGERS (2 Managers)
-- =====================================================

INSERT INTO fleet_managers (id, user_id, employee_code, depot_location, shift_details, created_at) VALUES
('01000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'FL-MGR-004', 'Mumbai Central Logistics Hub, Kurla West', 'Morning Shift (07:00 - 16:00)', '2026-01-01 08:30:00'),
('01000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'FL-MGR-005', 'Pune Western Freight Depot, Hinjawadi', 'General Shift (09:00 - 18:00)', '2026-01-01 08:30:00');


-- =====================================================
-- 4. DRIVERS (5 Drivers)
-- =====================================================

INSERT INTO drivers (
    id, user_id, employee_code, reporting_manager_id, status, score, risk_level, safety_grade,
    license_number, license_expiry, contract_type, shift_window, assigned_depot,
    emergency_contact_name, emergency_contact_phone, address, total_trips_completed, rating,
    created_at, updated_at
) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'FL-EMP-0231', '01000000-0000-0000-0000-000000000001', 'on_trip', 96.00, 'low', 'A', 'MH-03-20180044192', '2028-11-30', 'Full-Time Permanent', '07:30 - 17:30', 'Mumbai Central Hub', 'Sunita Sharma', '+91 98765 99001', 'Flat 402, Sai Krupa CHS, Chembur, Mumbai 400071', 482, 4.92, '2026-01-10 10:00:00', '2026-05-10 10:00:00'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'FL-EMP-0232', '01000000-0000-0000-0000-000000000001', 'available', 91.00, 'low', 'A', 'MH-01-20190088211', '2029-03-15', 'Full-Time Permanent', '08:00 - 18:00', 'Mumbai Central Hub', 'Kavita Patil', '+91 98765 99002', '12/B Shanti Niwas, Dadar East, Mumbai 400014', 365, 4.78, '2026-01-11 10:00:00', '2026-05-10 10:00:00'),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'FL-EMP-0233', '01000000-0000-0000-0000-000000000002', 'on_trip', 87.00, 'medium', 'B', 'MH-12-20200055123', '2027-08-20', 'Contractual', '07:00 - 17:00', 'Pune Freight Depot', 'Ramesh Verma', '+91 98765 99003', 'Sector 4, Pradhikaran, Nigdi, Pune 411044', 219, 4.65, '2026-01-12 10:00:00', '2026-05-10 10:00:00'),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'FL-EMP-0234', '01000000-0000-0000-0000-000000000001', 'available', 94.00, 'low', 'A', 'MH-04-20170099418', '2028-05-10', 'Full-Time Permanent', '08:30 - 18:30', 'Mumbai Central Hub', 'Suresh Nair', '+91 98765 99004', 'Rowhouse 8, Hiranandani Estate, Thane West 400607', 410, 4.88, '2026-01-13 10:00:00', '2026-05-10 10:00:00'),
('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'FL-EMP-0235', '01000000-0000-0000-0000-000000000002', 'off_duty', 82.00, 'medium', 'B', 'MH-14-20210011883', '2027-01-25', 'Contractual', '09:00 - 19:00', 'Pune Freight Depot', 'Fatima Sheikh', '+91 98765 99005', 'Shop 3 Lane, Camp Area, Pune 411001', 184, 4.42, '2026-01-14 10:00:00', '2026-05-10 10:00:00');


-- =====================================================
-- 5. VEHICLES (5 Vehicles)
-- =====================================================

INSERT INTO vehicles (id, registration_number, make_model, vehicle_type, capacity_kg, fuel_type, status, telematics_device_id, created_at, updated_at) VALUES
('02000000-0000-0000-0000-000000000001', 'MH12 KJ 4410', 'Tata Ace Gold EV', 'Mini Truck', 750.00, 'Electric', 'active', 'TEL-OBD-8801', '2026-01-02 08:00:00', '2026-01-02 08:00:00'),
('02000000-0000-0000-0000-000000000002', 'MH01 BC 2290', 'Ashok Leyland Dost+', 'Light Commercial Vehicle', 1500.00, 'Diesel', 'active', 'TEL-OBD-8802', '2026-01-02 08:00:00', '2026-01-02 08:00:00'),
('02000000-0000-0000-0000-000000000003', 'MH15 AD 7781', 'Mahindra Bolero Maxi Truck Plus', 'Pickup Truck', 1200.00, 'Diesel', 'active', 'TEL-OBD-8803', '2026-01-03 08:00:00', '2026-01-03 08:00:00'),
('02000000-0000-0000-0000-000000000004', 'MH04 GH 1120', 'Tata Intra V30', 'Light Commercial Vehicle', 1300.00, 'Diesel', 'active', 'TEL-OBD-8804', '2026-01-03 08:00:00', '2026-01-03 08:00:00'),
('02000000-0000-0000-0000-000000000005', 'MH12 QP 6612', 'Eicher Pro 2049', 'Medium Commercial Vehicle', 2500.00, 'CNG', 'active', 'TEL-OBD-8805', '2026-01-04 08:00:00', '2026-01-04 08:00:00');


-- =====================================================
-- 6. VEHICLE ASSIGNMENTS (5 Active Assignments)
-- =====================================================

INSERT INTO vehicle_assignments (id, driver_id, vehicle_id, assigned_at, unassigned_at, assignment_notes, created_at) VALUES
('03000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '2026-01-15 07:00:00', NULL, 'Dedicated EV dispatch vehicle for Mumbai–Pune corridor', '2026-01-15 07:00:00'),
('03000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002', '2026-01-15 07:00:00', NULL, 'Heavy delivery routes across Thane and Mumbai MMR', '2026-01-15 07:00:00'),
('03000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003', '2026-01-15 07:00:00', NULL, 'Assigned for industrial hardware and Western Ghats routes', '2026-01-15 07:00:00'),
('03000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000004', '2026-01-15 07:00:00', NULL, 'Dedicated cold-chain and temperature sensitive pharma freight', '2026-01-15 07:00:00'),
('03000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000005', '2026-01-15 07:00:00', NULL, 'High volume retail FMCG cargo distributor', '2026-01-15 07:00:00');


-- =====================================================
-- 7. DELIVERY REQUESTS (6 Requests: REQ-10481 through REQ-10486)
-- =====================================================

INSERT INTO delivery_requests (
    id, request_code, client_id, pickup_address, drop_address,
    package_category, weight_kg, length_cm, width_cm, height_cm,
    handle_with_care, priority, date_mode, preferred_date, preferred_time_window,
    special_instructions, estimated_cost, estimated_transit_time, status, created_at, updated_at
) VALUES
('04000000-0000-0000-0000-000000000001', 'REQ-10481', 'c1000000-0000-0000-0000-000000000001', 'Techlink Warehouse, Andheri East, Mumbai, MH 400093', 'Adira Corporate Office, Shivaji Nagar, Pune, MH 411005', 'Electronics', 3.40, 35.00, 25.00, 15.00, TRUE, 'high', 'on', '2026-05-10', '08:00 - 12:00', 'Sensitive server electronics. Maintain dry condition and keep upright.', 2450.00, '3h 30m', 'converted', '2026-05-09 10:12:00', '2026-05-09 13:05:00'),
('04000000-0000-0000-0000-000000000002', 'REQ-10482', 'c1000000-0000-0000-0000-000000000002', 'Cold Hub, Wagle Estate, Thane, MH 400604', 'HealthMart Retail Store 4, Gangapur Road, Nashik, MH 422002', 'Medical Supplies', 6.00, 40.00, 30.00, 20.00, TRUE, 'high', 'before', '2026-05-10', '09:00 - 14:00', 'Temperature controlled payload (2°C - 8°C). Do not break cold chain seal.', 5100.00, '4h 15m', 'converted', '2026-05-09 10:45:00', '2026-05-09 13:10:00'),
('04000000-0000-0000-0000-000000000003', 'REQ-10483', 'c1000000-0000-0000-0000-000000000003', 'Nord DC, Sector 19, Vashi, Navi Mumbai, MH 400703', 'Nord Regional Outlet, Sitabuldi, Nagpur, MH 440012', 'Apparel', 18.00, 60.00, 45.00, 40.00, FALSE, 'normal', 'flexible', '2026-05-12', 'Anytime', 'Standard palletized retail boxes.', 9800.00, '12h 00m', 'approved', '2026-05-09 11:20:00', '2026-05-09 14:00:00'),
('04000000-0000-0000-0000-000000000004', 'REQ-10484', 'c1000000-0000-0000-0000-000000000004', 'Acme Manufacturing Plant 2, Kurla, Mumbai, MH 400070', 'Acme Depot, Chinchwad, Pune, MH 411019', 'Machinery Spares', 45.00, 80.00, 60.00, 50.00, FALSE, 'normal', 'on', '2026-05-08', '07:00 - 11:00', 'Requires heavy strap tie-downs inside vehicle cargo bay.', 3300.00, '3h 45m', 'converted', '2026-05-07 09:00:00', '2026-05-07 11:00:00'),
('04000000-0000-0000-0000-000000000005', 'REQ-10485', 'c1000000-0000-0000-0000-000000000005', 'QuickBuild Industrial Yard, Chakan, Pune, MH 410501', 'Highway Construction Site 14, Satara, MH 415001', 'Hardware', 120.00, 120.00, 80.00, 60.00, FALSE, 'low', 'on', '2026-05-10', '06:00 - 12:00', 'Unload at rear gate ramp next to Site Office B.', 14200.00, '2h 50m', 'converted', '2026-05-09 14:15:00', '2026-05-09 15:30:00'),
('04000000-0000-0000-0000-000000000006', 'REQ-10486', 'c1000000-0000-0000-0000-000000000006', 'Tea Sky Roastery Estate, SB Road, Pune, MH 411016', 'Artisan Cafe Row, Bandra West, Mumbai, MH 400050', 'Specialty Coffee Beans', 42.00, 50.00, 40.00, 40.00, TRUE, 'normal', 'before', '2026-05-11', '08:00 - 13:00', 'Moisture barrier packaging. Must be kept away from volatile substances.', 1750.00, '3h 15m', 'converted', '2026-05-09 15:45:00', '2026-05-09 16:30:00');


-- =====================================================
-- 8. DELIVERIES (6 Deliveries: DEL-2026-0816 through DEL-2026-0821)
-- =====================================================

INSERT INTO deliveries (
    id, delivery_code, request_id, client_id, manager_id, driver_id, vehicle_id,
    status, priority, pickup_location, drop_location,
    expected_delivery_time, actual_delivery_time, amount, payment_method, payment_status,
    has_concern, special_instructions, handling_requirements, delivery_notes, additional_details,
    driver_notes, manager_notes, pod_signature_url, created_at, updated_at
) VALUES
-- DEL-2026-0816: in_transit (Active trip)
('05000000-0000-0000-0000-000000000001', 'DEL-2026-0816', '04000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001',
 'in_transit', 'high', 'Techlink Warehouse, Andheri East, Mumbai, MH 400093', 'Adira Corporate Office, Shivaji Nagar, Pune, MH 411005',
 '2026-05-10 18:30:00', NULL, 2450.00, 'UPI', 'paid',
 FALSE, 'Sensitive server electronics.', 'Handle with care. Do not stack above 2 layers.', 'Package picked up on schedule at Mumbai Hub.', 'Assigned directly via AI dispatch optimization engine.',
 'Approaching Lonavala Ghat section. Traffic moving steadily.', 'Driver verified cargo safety latch prior to departure.', NULL, '2026-05-09 13:05:00', '2026-05-10 11:20:00'),

-- DEL-2026-0817: assigned (With active concern)
('05000000-0000-0000-0000-000000000002', 'DEL-2026-0817', '04000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', '01000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000004',
 'assigned', 'high', 'Cold Hub, Wagle Estate, Thane, MH 400604', 'HealthMart Retail Store 4, Gangapur Road, Nashik, MH 422002',
 '2026-05-10 16:00:00', NULL, 5100.00, 'Card', 'paid',
 TRUE, 'Cold chain required (2°C - 8°C).', 'Refrigerated container check mandatory.', 'Client flagged slight moisture on outer packaging carton at staging bay.', 'Temperature sensors active and calibrated.',
 'Waiting for secondary inspection at pickup dock.', 'Manager reviewing driver concern CON-9014.', NULL, '2026-05-09 13:10:00', '2026-05-10 09:15:00'),

-- DEL-2026-0818: unassigned (Pending dispatch)
('05000000-0000-0000-0000-000000000003', 'DEL-2026-0818', '04000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', '01000000-0000-0000-0000-000000000002', NULL, NULL,
 'unassigned', 'normal', 'Nord DC, Sector 19, Vashi, Navi Mumbai, MH 400703', 'Nord Regional Outlet, Sitabuldi, Nagpur, MH 440012',
 '2026-05-13 14:00:00', NULL, 9800.00, 'Cash', 'pending',
 FALSE, 'Standard palletized retail boxes.', 'General freight handling.', 'Awaiting vehicle allocation for long-haul interstate transit.', 'Scheduled for mid-week dispatch.',
 NULL, 'Needs a high-capacity vehicle (Eicher Pro or Dost+).', NULL, '2026-05-09 14:00:00', '2026-05-09 14:00:00'),

-- DEL-2026-0819: completed (Historical trip)
('05000000-0000-0000-0000-000000000004', 'DEL-2026-0819', '04000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', '01000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002',
 'completed', 'normal', 'Acme Manufacturing Plant 2, Kurla, Mumbai, MH 400070', 'Acme Depot, Chinchwad, Pune, MH 411019',
 '2026-05-08 14:30:00', '2026-05-08 14:12:00', 3300.00, 'UPI', 'paid',
 FALSE, 'Machinery spares with tie-downs.', 'Heavy cargo handling.', 'Delivered ahead of estimated arrival time. Recipient signed POD.', 'All seal numbers matched consignment invoice.',
 'Clean delivery, no delays on expressway.', 'Trip completed smoothly with top driving score.', 'https://storage.fleethub.io/pod/sig-DEL-2026-0819.png', '2026-05-07 11:00:00', '2026-05-08 14:12:00'),

-- DEL-2026-0820: paused (Obstacle at dock)
('05000000-0000-0000-0000-000000000005', 'DEL-2026-0820', '04000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', '01000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003',
 'paused', 'low', 'QuickBuild Industrial Yard, Chakan, Pune, MH 410501', 'Highway Construction Site 14, Satara, MH 415001',
 '2026-05-10 14:00:00', NULL, 14200.00, 'Cash', 'pending',
 TRUE, 'Unload at rear gate ramp next to Site Office B.', 'Heavy lift equipment required on-site.', 'Trip temporarily paused due to construction equipment blockage at loading dock.', 'Driver waiting at checkpoint gate.',
 'Forklift broke down on ramp B. Site team clearing path.', 'Informed client representative Rohan Shinde regarding 40 min delay.', NULL, '2026-05-09 15:30:00', '2026-05-10 10:15:00'),

-- DEL-2026-0821: cancelled (Client order cancelled)
('05000000-0000-0000-0000-000000000006', 'DEL-2026-0821', '04000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000005', '01000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000005',
 'cancelled', 'normal', 'Tea Sky Roastery Estate, SB Road, Pune, MH 411016', 'Artisan Cafe Row, Bandra West, Mumbai, MH 400050',
 '2026-05-11 12:00:00', NULL, 1750.00, 'Card', 'refunded',
 FALSE, 'Moisture barrier packaging.', 'Dry cargo handling.', 'Client requested cancellation due to store renovation rescheduling.', 'No cancellation penalty charged.',
 'Vehicle was recalled before departure.', 'Order voided and driver returned to available pool.', NULL, '2026-05-09 16:30:00', '2026-05-09 18:00:00');


-- =====================================================
-- 9. DELIVERY TRACKING STEPS (Stages for Deliveries)
-- =====================================================

-- Tracking for DEL-2026-0816 (in_transit)
INSERT INTO delivery_tracking_steps (id, delivery_id, stage_name, completed_at, is_completed, is_auto_detected, sequence, created_at) VALUES
('06000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 'requested',          '2026-05-09 10:12:00', TRUE,  FALSE, 1, '2026-05-09 10:12:00'),
('06000000-0000-0000-0000-000000000002', '05000000-0000-0000-0000-000000000001', 'assigned',           '2026-05-09 13:05:00', TRUE,  TRUE,  2, '2026-05-09 13:05:00'),
('06000000-0000-0000-0000-000000000003', '05000000-0000-0000-0000-000000000001', 'reached_pickup',     '2026-05-10 08:35:00', TRUE,  TRUE,  3, '2026-05-10 08:35:00'),
('06000000-0000-0000-0000-000000000004', '05000000-0000-0000-0000-000000000001', 'package_picked_up',  '2026-05-10 08:45:00', TRUE,  FALSE, 4, '2026-05-10 08:45:00'),
('06000000-0000-0000-0000-000000000005', '05000000-0000-0000-0000-000000000001', 'in_transit',         '2026-05-10 09:00:00', TRUE,  TRUE,  5, '2026-05-10 09:00:00'),
('06000000-0000-0000-0000-000000000006', '05000000-0000-0000-0000-000000000001', 'reached_destination', NULL,                  FALSE, FALSE, 6, '2026-05-09 13:05:00'),
('06000000-0000-0000-0000-000000000007', '05000000-0000-0000-0000-000000000001', 'delivered',           NULL,                  FALSE, FALSE, 7, '2026-05-09 13:05:00');

-- Tracking for DEL-2026-0819 (completed)
INSERT INTO delivery_tracking_steps (id, delivery_id, stage_name, completed_at, is_completed, is_auto_detected, sequence, created_at) VALUES
('06000000-0000-0000-0000-000000000008', '05000000-0000-0000-0000-000000000004', 'requested',          '2026-05-07 09:00:00', TRUE, FALSE, 1, '2026-05-07 09:00:00'),
('06000000-0000-0000-0000-000000000009', '05000000-0000-0000-0000-000000000004', 'assigned',           '2026-05-07 11:00:00', TRUE, TRUE,  2, '2026-05-07 11:00:00'),
('06000000-0000-0000-0000-000000000010', '05000000-0000-0000-0000-000000000004', 'reached_pickup',     '2026-05-08 07:45:00', TRUE, TRUE,  3, '2026-05-08 07:45:00'),
('06000000-0000-0000-0000-000000000011', '05000000-0000-0000-0000-000000000004', 'package_picked_up',  '2026-05-08 08:00:00', TRUE, FALSE, 4, '2026-05-08 08:00:00'),
('06000000-0000-0000-0000-000000000012', '05000000-0000-0000-0000-000000000004', 'in_transit',         '2026-05-08 08:15:00', TRUE, TRUE,  5, '2026-05-08 08:15:00'),
('06000000-0000-0000-0000-000000000013', '05000000-0000-0000-0000-000000000004', 'reached_destination', '2026-05-08 13:55:00', TRUE, TRUE,  6, '2026-05-08 13:55:00'),
('06000000-0000-0000-0000-000000000014', '05000000-0000-0000-0000-000000000004', 'delivered',           '2026-05-08 14:12:00', TRUE, FALSE, 7, '2026-05-08 14:12:00');

-- Tracking for DEL-2026-0817 (assigned)
INSERT INTO delivery_tracking_steps (id, delivery_id, stage_name, completed_at, is_completed, is_auto_detected, sequence, created_at) VALUES
('06000000-0000-0000-0000-000000000015', '05000000-0000-0000-0000-000000000002', 'requested',          '2026-05-09 10:45:00', TRUE,  FALSE, 1, '2026-05-09 10:45:00'),
('06000000-0000-0000-0000-000000000016', '05000000-0000-0000-0000-000000000002', 'assigned',           '2026-05-09 13:10:00', TRUE,  TRUE,  2, '2026-05-09 13:10:00'),
('06000000-0000-0000-0000-000000000017', '05000000-0000-0000-0000-000000000002', 'reached_pickup',     NULL,                  FALSE, FALSE, 3, '2026-05-09 13:10:00'),
('06000000-0000-0000-0000-000000000018', '05000000-0000-0000-0000-000000000002', 'package_picked_up',  NULL,                  FALSE, FALSE, 4, '2026-05-09 13:10:00'),
('06000000-0000-0000-0000-000000000019', '05000000-0000-0000-0000-000000000002', 'in_transit',         NULL,                  FALSE, FALSE, 5, '2026-05-09 13:10:00'),
('06000000-0000-0000-0000-000000000020', '05000000-0000-0000-0000-000000000002', 'reached_destination', NULL,                  FALSE, FALSE, 6, '2026-05-09 13:10:00'),
('06000000-0000-0000-0000-000000000021', '05000000-0000-0000-0000-000000000002', 'delivered',           NULL,                  FALSE, FALSE, 7, '2026-05-09 13:10:00');


-- =====================================================
-- 10. DRIVER SCHEDULES (5 Schedules for 2026-05-10)
-- =====================================================

INSERT INTO driver_schedules (id, driver_id, schedule_date, shift_start_time, shift_end_time, depot_location, created_at, updated_at) VALUES
('07000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '2026-05-10', '07:30:00', '18:00:00', 'Mumbai Central Logistics Hub', '2026-05-09 18:00:00', '2026-05-09 18:00:00'),
('07000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', '2026-05-10', '08:00:00', '17:30:00', 'Mumbai Central Logistics Hub', '2026-05-09 18:00:00', '2026-05-09 18:00:00'),
('07000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', '2026-05-10', '07:00:00', '16:30:00', 'Pune Western Freight Depot',   '2026-05-09 18:00:00', '2026-05-09 18:00:00'),
('07000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', '2026-05-10', '08:30:00', '18:30:00', 'Mumbai Central Logistics Hub', '2026-05-09 18:00:00', '2026-05-09 18:00:00'),
('07000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', '2026-05-10', '09:00:00', '19:00:00', 'Pune Western Freight Depot',   '2026-05-09 18:00:00', '2026-05-09 18:00:00');


-- =====================================================
-- 11. DRIVER SCHEDULE STOPS (Itinerary for Rahul Sharma's Shift)
-- =====================================================

INSERT INTO driver_schedule_stops (id, schedule_id, delivery_id, sequence, time_label, stop_title, stop_type, city, is_completed, completed_at, created_at) VALUES
('08000000-0000-0000-0000-000000000001', '07000000-0000-0000-0000-000000000001', NULL,                                   1, '07:30 AM', 'Shift start · Mumbai Central Hub', 'shift_start', 'Mumbai',   TRUE,  '2026-05-10 07:30:00', '2026-05-09 18:30:00'),
('08000000-0000-0000-0000-000000000002', '07000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 2, '08:45 AM', 'Pickup · Techlink Warehouse (DEL-2026-0816)', 'pickup', 'Mumbai',   TRUE,  '2026-05-10 08:45:00', '2026-05-09 18:30:00'),
('08000000-0000-0000-0000-000000000003', '07000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 3, '11:20 AM', 'Checkpoint · Expressway Khalapur Toll', 'checkpoint', 'Khalapur', TRUE,  '2026-05-10 11:20:00', '2026-05-09 18:30:00'),
('08000000-0000-0000-0000-000000000004', '07000000-0000-0000-0000-000000000001', NULL,                                   4, '01:00 PM', 'Mandatory Rest Break (45 min)',   'break',      'Lonavala', FALSE, NULL,                  '2026-05-09 18:30:00'),
('08000000-0000-0000-0000-000000000005', '07000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 5, '03:30 PM', 'Drop · Adira Corporate Office',         'drop',       'Pune',     FALSE, NULL,                  '2026-05-09 18:30:00'),
('08000000-0000-0000-0000-000000000006', '07000000-0000-0000-0000-000000000001', NULL,                                   6, '06:00 PM', 'Shift end · Pune Freight Depot Return', 'shift_end', 'Pune',     FALSE, NULL,                  '2026-05-09 18:30:00');


-- =====================================================
-- 12. COMPLETED TRIPS (Historical & Active Delivery Trip Records)
-- =====================================================

INSERT INTO completed_trips (
    id, trip_code, delivery_id, driver_id, vehicle_id,
    completion_date, start_time, end_time, duration_minutes, distance_km,
    driving_score, has_incident, incident_detail,
    ai_overall_summary, ai_braking_summary, ai_acceleration_summary, ai_route_efficiency_summary,
    created_at
) VALUES
('09000000-0000-0000-0000-000000000001', 'TRP-8421', '05000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003',
 '2026-05-09', '2026-05-09 08:30:00', '2026-05-09 10:44:00', 134, 38.40,
 82.00, TRUE, 'Gate obstacle at loading dock B caused 25 min idling and sudden stop maneuvering.',
 'Trip experienced minor delays and one telematics braking alert near dock approach.', 'Harsh deceleration event (-0.45g) recorded near toll queue bypass.', 'Moderate acceleration profiles maintained throughout city transit.', 'Selected highway route was 94% optimal despite construction slowdowns.',
 '2026-05-09 11:00:00'),

('09000000-0000-0000-0000-000000000002', 'TRP-8422', '05000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002',
 '2026-05-08', '2026-05-08 08:15:00', '2026-05-08 14:12:00', 357, 148.00,
 96.00, FALSE, NULL,
 'Exemplary highway trip with consistent speed control and zero aggressive telematics triggers.', 'Smooth progressive braking across all expressway toll interchanges.', 'Optimal acceleration curves maintained on incline gradients.', 'Route efficiency rated at 99.2% with optimal fuel burn.',
 '2026-05-08 14:30:00'),

('09000000-0000-0000-0000-000000000003', 'TRP-8423', '05000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000005',
 '2026-05-07', '2026-05-07 09:00:00', '2026-05-07 12:48:00', 228, 168.50,
 94.00, FALSE, NULL,
 'Highly efficient transit between Pune and Mumbai suburbs.', 'Regenerative and early deceleration observed on ghat descents.', 'Smooth throttle modulation throughout.', '100% adherence to recommended freight corridors.',
 '2026-05-07 13:00:00');


-- =====================================================
-- 13. TRIP EVENTS (Granular Telematics Telemetry)
-- =====================================================

INSERT INTO trip_events (id, trip_id, event_timestamp, event_type, location, severity, description, created_at) VALUES
-- Events for TRP-8421
('0a000000-0000-0000-0000-000000000001', '09000000-0000-0000-0000-000000000001', '2026-05-09 08:30:00', 'other',               'Chakan Industrial Hub, Gate 1',        'info',     'Trip started with complete safety walkaround inspection.',   '2026-05-09 08:30:00'),
('0a000000-0000-0000-0000-000000000002', '09000000-0000-0000-0000-000000000001', '2026-05-09 08:42:00', 'other',               'QuickBuild Staging Yard B',            'info',     'Vehicle reached designated loading bay.',                   '2026-05-09 08:42:00'),
('0a000000-0000-0000-0000-000000000003', '09000000-0000-0000-0000-000000000001', '2026-05-09 08:50:00', 'other',               'QuickBuild Loading Dock 3',            'info',     'Cargo securely loaded and verified against manifest.',       '2026-05-09 08:50:00'),
('0a000000-0000-0000-0000-000000000004', '09000000-0000-0000-0000-000000000001', '2026-05-09 09:22:00', 'speeding',            'NH-48 Pune Bypass Km 24',              'medium',   'Vehicle recorded at 92 km/h in an 80 km/h commercial zone.', '2026-05-09 09:22:00'),
('0a000000-0000-0000-0000-000000000005', '09000000-0000-0000-0000-000000000001', '2026-05-09 09:55:00', 'harsh_braking',       'Khed Shivapur Toll Plaza Approach',    'high',     'Deceleration rate -0.45g detected due to cut-in vehicle.',   '2026-05-09 09:55:00'),
('0a000000-0000-0000-0000-000000000006', '09000000-0000-0000-0000-000000000001', '2026-05-09 10:28:00', 'other',               'Site 14 Construction Access Road',     'medium',   'Driver reported loading dock access blocked by excavator.',  '2026-05-09 10:28:00'),
('0a000000-0000-0000-0000-000000000007', '09000000-0000-0000-0000-000000000001', '2026-05-09 10:40:00', 'other',               'Site 14 Unloading Staging Zone',       'info',     'Obstacle cleared; vehicle positioned for discharge.',        '2026-05-09 10:40:00'),
('0a000000-0000-0000-0000-000000000008', '09000000-0000-0000-0000-000000000001', '2026-05-09 10:44:00', 'other',               'Site 14 Satara Receiver Office',       'info',     'Consignment delivered and trip successfully completed.',     '2026-05-09 10:44:00'),

-- Events for TRP-8422
('0a000000-0000-0000-0000-000000000009', '09000000-0000-0000-0000-000000000002', '2026-05-08 08:15:00', 'other',               'Acme Kurla Manufacturing Plant',       'info',     'Trip started with departure telematics handshake OK.',       '2026-05-08 08:15:00'),
('0a000000-0000-0000-0000-000000000010', '09000000-0000-0000-0000-000000000002', '2026-05-08 10:15:00', 'sharp_cornering',     'Khandala Ghat Curve 12',               'low',      'Lateral g-force 0.32g recorded during wet corner turn.',     '2026-05-08 10:15:00'),
('0a000000-0000-0000-0000-000000000011', '09000000-0000-0000-0000-000000000002', '2026-05-08 11:30:00', 'other',               'Urse Toll Plaza Rest Stop',            'info',     'Driver took scheduled 20 minute fatigue rest break.',        '2026-05-08 11:30:00'),
('0a000000-0000-0000-0000-000000000012', '09000000-0000-0000-0000-000000000002', '2026-05-08 13:55:00', 'other',               'Acme Chinchwad Depot Entry',           'info',     'Arrival scan completed at destination gate.',                '2026-05-08 13:55:00'),
('0a000000-0000-0000-0000-000000000013', '09000000-0000-0000-0000-000000000002', '2026-05-08 14:12:00', 'other',               'Acme Chinchwad Receiving Bay 1',       'info',     'POD digital signature recorded; trip finalized.',            '2026-05-08 14:12:00');


-- =====================================================
-- 14. DRIVER DAILY SCORES (Performance Trend Across Drivers)
-- =====================================================

INSERT INTO driver_daily_scores (id, driver_id, score_date, overall_score, risk_level, safety_grade, smooth_driving_score, harsh_braking_score, speeding_score, rapid_acceleration_score, cornering_score, night_drive_score, deliveries_completed, created_at) VALUES
-- Rahul Sharma (Top Performer)
('0b000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '2026-05-08', 97.00, 'low', 'A', 98.00, 96.00, 99.00, 95.00, 97.00, 94.00, 3, '2026-05-08 20:00:00'),
('0b000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '2026-05-09', 95.50, 'low', 'A', 96.00, 94.00, 98.00, 96.00, 95.00, 92.00, 2, '2026-05-09 20:00:00'),
('0b000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '2026-05-10', 96.00, 'low', 'A', 97.00, 95.00, 99.00, 97.00, 96.00, 95.00, 2, '2026-05-10 20:00:00'),

-- Vikram Patil (Solid Performer)
('0b000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', '2026-05-08', 96.00, 'low', 'A', 95.00, 97.00, 98.00, 94.00, 96.00, 91.00, 1, '2026-05-08 20:00:00'),
('0b000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', '2026-05-09', 90.00, 'low', 'A', 89.00, 91.00, 93.00, 90.00, 89.00, 88.00, 2, '2026-05-09 20:00:00'),
('0b000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', '2026-05-10', 91.00, 'low', 'A', 92.00, 90.00, 94.00, 91.00, 90.00, 89.00, 2, '2026-05-10 20:00:00'),

-- Aman Verma (Moderate Risk)
('0b000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000003', '2026-05-08', 88.00, 'medium', 'B', 86.00, 84.00, 90.00, 88.00, 89.00, 82.00, 2, '2026-05-08 20:00:00'),
('0b000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000003', '2026-05-09', 82.00, 'medium', 'B', 80.00, 78.00, 85.00, 83.00, 84.00, 79.00, 1, '2026-05-09 20:00:00'),
('0b000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000003', '2026-05-10', 87.00, 'medium', 'B', 85.00, 83.00, 89.00, 87.00, 88.00, 84.00, 1, '2026-05-10 20:00:00'),

-- Priya Nair (Consistent High Scorer)
('0b000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000004', '2026-05-08', 93.00, 'low', 'A', 94.00, 93.00, 95.00, 92.00, 94.00, 90.00, 2, '2026-05-08 20:00:00'),
('0b000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000004', '2026-05-09', 94.50, 'low', 'A', 95.00, 94.00, 96.00, 93.00, 95.00, 91.00, 2, '2026-05-09 20:00:00'),
('0b000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000004', '2026-05-10', 94.00, 'low', 'A', 94.00, 94.00, 95.00, 93.00, 94.00, 92.00, 1, '2026-05-10 20:00:00'),

-- Imran Sheikh (Coaching Candidate)
('0b000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000005', '2026-05-08', 84.00, 'medium', 'B', 82.00, 79.00, 86.00, 84.00, 85.00, 80.00, 1, '2026-05-08 20:00:00'),
('0b000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000005', '2026-05-09', 80.00, 'medium', 'B', 79.00, 76.00, 82.00, 80.00, 81.00, 78.00, 1, '2026-05-09 20:00:00'),
('0b000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000005', '2026-05-10', 82.00, 'medium', 'B', 81.00, 78.00, 84.00, 82.00, 83.00, 81.00, 0, '2026-05-10 20:00:00');


-- =====================================================
-- 15. DRIVER COACHING GOALS
-- =====================================================

INSERT INTO driver_coaching_goals (id, driver_id, goal_title, target_metric, timeframe, progress_percent, practical_tip, is_active, created_at, updated_at) VALUES
('0c000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Reduce Harsh Braking Frequency', '< 3 events per 500 km', 'Next 14 Days', 72.00, 'Anticipate expressway toll slowdowns 100 meters earlier by easing off the throttle.', TRUE, '2026-05-01 09:00:00', '2026-05-10 09:00:00'),
('0c000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Speed Boundary Compliance in Semi-Urban Zones', '100% adherence to 60 km/h limits', 'Next 30 Days', 58.50, 'Use in-cab telemetry chime alerts to monitor arterial highway speed transitions.', TRUE, '2026-05-01 09:00:00', '2026-05-10 09:00:00'),
('0c000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000005', 'Smooth Cornering on Ghat Incline Sections', 'Lateral g-force < 0.25g', 'Next 21 Days', 45.00, 'Decelerate completely before entering sharp hairpin bends rather than trail-braking in turn.', TRUE, '2026-05-01 09:00:00', '2026-05-10 09:00:00');


-- =====================================================
-- 16. DRIVER CONCERNS (Telematics Context & Overrides)
-- =====================================================

INSERT INTO driver_concerns (
    id, concern_code, driver_id, delivery_id, trip_id, category,
    system_event_type, system_event_timestamp, system_event_location, system_event_details,
    context_reason, driver_description, status, manager_review_notes, reviewed_by_manager_id,
    submitted_at, reviewed_at
) VALUES
('0d000000-0000-0000-0000-000000000001', 'CON-9012', 'd0000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', '09000000-0000-0000-0000-000000000001',
 'incorrect_system_detection', 'harsh_braking', '2026-05-09 09:55:00', 'Khed Toll Plaza Approach, Pune', 'Deceleration -0.45g detected by OBD tracker',
 'traffic_cut_in', 'Car in adjacent lane suddenly cut across three toll queues without signaling. Emergency brake was necessary to avoid front collision.',
 'pending_review', NULL, NULL, '2026-05-09 10:15:00', NULL),

('0d000000-0000-0000-0000-000000000002', 'CON-9013', 'd0000000-0000-0000-0000-000000000003', '05000000-0000-0000-0000-000000000005', '09000000-0000-0000-0000-000000000001',
 'pickup_issue', 'excessive_idling', '2026-05-09 08:45:00', 'QuickBuild Staging Yard B', 'Engine idle duration exceeded 20 minutes',
 'dock_obstruction', 'Loading Dock B ramp was completely obstructed by a malfunctioning forklift. Had to wait for yard operator to tow equipment clear.',
 'reviewed_verified', 'Reviewed CCTV and security log from QuickBuild gate. Idle delay verified as facility fault; safety rating penalty waived.',
 '01000000-0000-0000-0000-000000000002', '2026-05-09 11:30:00', '2026-05-09 14:00:00'),

('0d000000-0000-0000-0000-000000000003', 'CON-9014', 'd0000000-0000-0000-0000-000000000004', '05000000-0000-0000-0000-000000000002', NULL,
 'package_issue', NULL, NULL, 'Cold Hub Staging Dock 4, Thane', NULL,
 'packaging_integrity', 'Outer packaging showed moisture condensation upon transfer from staging bay. Requested secondary cold insulation tarp before departure.',
 'pending_review', NULL, NULL, '2026-05-10 09:15:00', NULL);


-- =====================================================
-- 17. AI DRIVER RECOMMENDATIONS (Smart Dispatch Matching for REQ-10481)
-- =====================================================

INSERT INTO ai_driver_recommendations (id, request_id, driver_id, match_score, suitability_reasons, is_best_match, created_at) VALUES
('0e000000-0000-0000-0000-000000000001', '04000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 96.00, '["Top safety score (96/100)", "Currently located within 4.2 km of pickup depot", "Extensive experience on Mumbai-Pune expressway corridor", "Electric vehicle capacity perfectly matched for 3.4kg fragile electronics"]'::jsonb, TRUE, '2026-05-09 10:15:00'),
('0e000000-0000-0000-0000-000000000002', '04000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 91.00, '["High on-time delivery rate (98.4%)", "Available immediately at Central Hub", "Vehicle capacity is larger than necessary"]'::jsonb, FALSE, '2026-05-09 10:15:00'),
('0e000000-0000-0000-0000-000000000003', '04000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 87.00, '["Certified in specialized cargo handling", "Currently completing unloading near Chakan", "Will require 35 min repositioning window"]'::jsonb, FALSE, '2026-05-09 10:15:00');


-- =====================================================
-- 18. NOTIFICATIONS (System Feed for Managers, Drivers, Clients)
-- =====================================================

INSERT INTO notifications (id, user_id, title, body, is_read, created_at) VALUES
-- For Fleet Manager Amit Rao
('0f000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Driver assigned', 'Rahul Sharma accepted and confirmed dispatch for delivery DEL-2026-0816.', TRUE, '2026-05-10 08:32:00'),
('0f000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Delay predicted', 'Heavy traffic detected near Khalapur Toll. Expected ETA revised by +15 min for DEL-2026-0816.', FALSE, '2026-05-10 11:15:00'),
('0f000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Concern raised', 'Priya Nair raised packaging concern CON-9014 for HealthMart shipment DEL-2026-0817.', FALSE, '2026-05-10 09:16:00'),
('0f000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Report ready', 'Weekly Fleet Telematics & Driving Safety Intelligence report is ready for export.', FALSE, '2026-05-10 07:00:00'),

-- For Driver Rahul Sharma
('0f000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'New route optimized', 'AI Dispatch has updated your route to avoid construction delays at Lonavala bypass.', TRUE, '2026-05-10 09:05:00'),

-- For Client Acme Corp (Rajesh Mehta)
('0f000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Shipment in transit', 'Your shipment DEL-2026-0816 is on its way to Adira Corporate Office, Pune.', FALSE, '2026-05-10 09:00:00');

COMMIT;

-- =====================================================
-- ROW COUNT VERIFICATION QUERY (All 18 Tables)
-- =====================================================

SELECT 'users' AS table_name, count(*) AS row_count FROM users
UNION ALL
SELECT 'clients', count(*) FROM clients
UNION ALL
SELECT 'fleet_managers', count(*) FROM fleet_managers
UNION ALL
SELECT 'drivers', count(*) FROM drivers
UNION ALL
SELECT 'vehicles', count(*) FROM vehicles
UNION ALL
SELECT 'vehicle_assignments', count(*) FROM vehicle_assignments
UNION ALL
SELECT 'delivery_requests', count(*) FROM delivery_requests
UNION ALL
SELECT 'deliveries', count(*) FROM deliveries
UNION ALL
SELECT 'delivery_tracking_steps', count(*) FROM delivery_tracking_steps
UNION ALL
SELECT 'driver_schedules', count(*) FROM driver_schedules
UNION ALL
SELECT 'driver_schedule_stops', count(*) FROM driver_schedule_stops
UNION ALL
SELECT 'completed_trips', count(*) FROM completed_trips
UNION ALL
SELECT 'trip_events', count(*) FROM trip_events
UNION ALL
SELECT 'driver_daily_scores', count(*) FROM driver_daily_scores
UNION ALL
SELECT 'driver_coaching_goals', count(*) FROM driver_coaching_goals
UNION ALL
SELECT 'driver_concerns', count(*) FROM driver_concerns
UNION ALL
SELECT 'ai_driver_recommendations', count(*) FROM ai_driver_recommendations
UNION ALL
SELECT 'notifications', count(*) FROM notifications
ORDER BY table_name;