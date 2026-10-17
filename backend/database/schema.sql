CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- =====================================================
-- FLEETHUB DATABASE SCHEMA
-- Batch 1: Users and Profile Tables
-- =====================================================


-- =====================================================
-- 1. USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('client', 'driver', 'manager')),

    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 2. CLIENTS
-- =====================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,
    client_code VARCHAR(50) NOT NULL UNIQUE,

    company_name VARCHAR(150) NOT NULL,
    billing_address TEXT,
    contact_person VARCHAR(150),
    contact_phone VARCHAR(20),
    industry VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_clients_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================================
-- 3. FLEET MANAGERS
-- =====================================================

CREATE TABLE fleet_managers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,
    employee_code VARCHAR(50) NOT NULL UNIQUE,

    depot_location TEXT,
    shift_details VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fleet_managers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================================
-- 4. DRIVERS
-- =====================================================

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,
    employee_code VARCHAR(50) NOT NULL UNIQUE,

    reporting_manager_id UUID,

    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (status IN ('available', 'on_trip', 'off_duty')),

    score NUMERIC(5,2)
        CHECK (score BETWEEN 0 AND 100),

    risk_level VARCHAR(20)
        CHECK (risk_level IN ('low', 'medium', 'high')),

    safety_grade CHAR(1)
        CHECK (safety_grade IN ('A', 'B', 'C')),

    license_number VARCHAR(100) UNIQUE,
    license_expiry DATE,

    contract_type VARCHAR(50),
    shift_window VARCHAR(100),
    assigned_depot TEXT,

    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),

    address TEXT,

    total_trips_completed INTEGER NOT NULL DEFAULT 0
        CHECK (total_trips_completed >= 0),

    rating NUMERIC(3,2)
        CHECK (rating BETWEEN 0 AND 5),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_drivers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_drivers_manager
        FOREIGN KEY (reporting_manager_id)
        REFERENCES fleet_managers(id)
        ON DELETE SET NULL
);

-- =====================================================
-- Batch 2: Vehicles and Vehicle Assignments
-- =====================================================


-- =====================================================
-- 5. VEHICLES
-- =====================================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    registration_number VARCHAR(50) NOT NULL UNIQUE,

    make_model VARCHAR(150) NOT NULL,

    vehicle_type VARCHAR(50) NOT NULL,

    capacity_kg NUMERIC(10,2)
        CHECK (capacity_kg > 0),

    fuel_type VARCHAR(50),

    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'in_service',
                'maintenance',
                'decommissioned'
            )
        ),

    telematics_device_id VARCHAR(100) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 6. VEHICLE ASSIGNMENTS
-- =====================================================

CREATE TABLE vehicle_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driver_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP,

    assignment_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicle_assignments_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_vehicle_assignments_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_assignment_time
        CHECK (
            unassigned_at IS NULL
            OR unassigned_at > assigned_at
        )
);


-- =====================================================
-- ACTIVE ASSIGNMENT CONSTRAINTS
-- =====================================================

-- A vehicle can have only one active driver at a time

CREATE UNIQUE INDEX unique_active_vehicle_assignment
ON vehicle_assignments(vehicle_id)
WHERE unassigned_at IS NULL;


-- A driver can have only one active vehicle at a time

CREATE UNIQUE INDEX unique_active_driver_assignment
ON vehicle_assignments(driver_id)
WHERE unassigned_at IS NULL;

-- =====================================================
-- Batch 3: Delivery Requests and Deliveries
-- =====================================================


-- =====================================================
-- 7. DELIVERY REQUESTS
-- Created by clients before a delivery is approved/assigned
-- =====================================================

CREATE TABLE delivery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    request_code VARCHAR(50) NOT NULL UNIQUE,

    client_id UUID NOT NULL,

    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,

    package_category VARCHAR(100),
    weight_kg NUMERIC(10,2)
        CHECK (weight_kg > 0),

    length_cm NUMERIC(10,2)
        CHECK (length_cm > 0),

    width_cm NUMERIC(10,2)
        CHECK (width_cm > 0),

    height_cm NUMERIC(10,2)
        CHECK (height_cm > 0),

    handle_with_care BOOLEAN NOT NULL DEFAULT FALSE,

    priority VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('urgent', 'high', 'normal', 'low')),

    date_mode VARCHAR(20) NOT NULL DEFAULT 'flexible'
        CHECK (date_mode IN ('on', 'before', 'flexible')),

    preferred_date DATE,
    preferred_time_window VARCHAR(100),

    special_instructions TEXT,

    estimated_cost NUMERIC(12,2)
        CHECK (estimated_cost >= 0),

    estimated_transit_time VARCHAR(100),

    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'under_review',
                'approved',
                'rejected',
                'converted',
                'cancelled'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_requests_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT
);


-- =====================================================
-- 8. DELIVERIES
-- The actual operational delivery
-- =====================================================

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_code VARCHAR(50) NOT NULL UNIQUE,

    request_id UUID NOT NULL UNIQUE,

    client_id UUID NOT NULL,
    manager_id UUID,
    driver_id UUID,
    vehicle_id UUID,

    status VARCHAR(30) NOT NULL DEFAULT 'unassigned'
        CHECK (
            status IN (
                'unassigned',
                'assigned',
                'reached_pickup',
                'package_picked_up',
                'in_transit',
                'reached_destination',
                'completed',
                'paused',
                'cancelled'
            )
        ),

    priority VARCHAR(20)
        CHECK (priority IN ('urgent', 'high', 'normal', 'low')),

    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,

    expected_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,

    amount NUMERIC(12,2)
        CHECK (amount >= 0),

    payment_method VARCHAR(50),

    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (
            payment_status IN (
                'pending',
                'paid',
                'failed',
                'refunded'
            )
        ),

    has_concern BOOLEAN NOT NULL DEFAULT FALSE,

    special_instructions TEXT,
    handling_requirements TEXT,
    delivery_notes TEXT,
    additional_details TEXT,

    driver_notes TEXT,
    manager_notes TEXT,

    pod_signature_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveries_request
        FOREIGN KEY (request_id)
        REFERENCES delivery_requests(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deliveries_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deliveries_manager
        FOREIGN KEY (manager_id)
        REFERENCES fleet_managers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_deliveries_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_deliveries_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE SET NULL
);


-- =====================================================
-- 9. DELIVERY TRACKING STEPS
-- Tracks delivery lifecycle and progress
-- =====================================================

CREATE TABLE delivery_tracking_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_id UUID NOT NULL,

    stage_name VARCHAR(50) NOT NULL
        CHECK (
            stage_name IN (
                'requested',
                'assigned',
                'reached_pickup',
                'package_picked_up',
                'in_transit',
                'reached_destination',
                'delivered'
            )
        ),

    completed_at TIMESTAMP,

    is_completed BOOLEAN NOT NULL DEFAULT FALSE,

    is_auto_detected BOOLEAN NOT NULL DEFAULT FALSE,

    sequence INTEGER NOT NULL
        CHECK (sequence > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tracking_steps_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_delivery_stage
        UNIQUE (delivery_id, stage_name),

    CONSTRAINT unique_delivery_sequence
        UNIQUE (delivery_id, sequence)
);

-- =====================================================
-- Batch 4: Driver Schedules and Schedule Stops
-- =====================================================


-- =====================================================
-- 10. DRIVER SCHEDULES
-- =====================================================

CREATE TABLE driver_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driver_id UUID NOT NULL,

    schedule_date DATE NOT NULL,

    shift_start_time TIME,
    shift_end_time TIME,

    depot_location TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_driver_schedules_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE CASCADE,

    -- One schedule per driver per day
    CONSTRAINT unique_driver_schedule
        UNIQUE (driver_id, schedule_date),

    -- If both times exist, shift must end after it starts
    CONSTRAINT chk_shift_time
        CHECK (
            shift_end_time IS NULL
            OR shift_start_time IS NULL
            OR shift_end_time > shift_start_time
        )
);


-- =====================================================
-- 11. DRIVER SCHEDULE STOPS
-- =====================================================

CREATE TABLE driver_schedule_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    schedule_id UUID NOT NULL,

    delivery_id UUID,

    sequence INTEGER NOT NULL
        CHECK (sequence > 0),

    time_label VARCHAR(100),

    stop_title VARCHAR(150) NOT NULL,

    stop_type VARCHAR(30) NOT NULL
        CHECK (
            stop_type IN (
                'shift_start',
                'pickup',
                'checkpoint',
                'break',
                'drop',
                'shift_end'
            )
        ),

    city VARCHAR(100),

    is_completed BOOLEAN NOT NULL DEFAULT FALSE,

    completed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_schedule_stops_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES driver_schedules(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_schedule_stops_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE SET NULL,

    -- Stops cannot have the same position in one schedule
    CONSTRAINT unique_schedule_stop_sequence
        UNIQUE (schedule_id, sequence)
);

-- =====================================================
-- Batch 5: Trips and Driver Intelligence
-- =====================================================


-- =====================================================
-- 12. COMPLETED TRIPS
-- =====================================================

CREATE TABLE completed_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    trip_code VARCHAR(50) NOT NULL UNIQUE,

    delivery_id UUID NOT NULL UNIQUE,
    driver_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,

    completion_date DATE NOT NULL,

    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    duration_minutes INTEGER
        CHECK (duration_minutes >= 0),

    distance_km NUMERIC(10,2)
        CHECK (distance_km >= 0),

    driving_score NUMERIC(5,2)
        CHECK (driving_score BETWEEN 0 AND 100),

    has_incident BOOLEAN NOT NULL DEFAULT FALSE,
    incident_detail TEXT,

    ai_overall_summary TEXT,
    ai_braking_summary TEXT,
    ai_acceleration_summary TEXT,
    ai_route_efficiency_summary TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_completed_trips_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_completed_trips_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_completed_trips_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_trip_time
        CHECK (end_time > start_time)
);


-- =====================================================
-- 13. TRIP EVENTS
-- =====================================================

CREATE TABLE trip_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    trip_id UUID NOT NULL,

    event_timestamp TIMESTAMP NOT NULL,

    event_type VARCHAR(50) NOT NULL
        CHECK (
            event_type IN (
                'harsh_braking',
                'speeding',
                'rapid_acceleration',
                'sharp_cornering',
                'collision',
                'other'
            )
        ),

    location TEXT,

    severity VARCHAR(20) NOT NULL DEFAULT 'info'
        CHECK (
            severity IN (
                'info',
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_events_trip
        FOREIGN KEY (trip_id)
        REFERENCES completed_trips(id)
        ON DELETE CASCADE
);


-- =====================================================
-- 14. DRIVER DAILY SCORES
-- =====================================================

CREATE TABLE driver_daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driver_id UUID NOT NULL,

    score_date DATE NOT NULL,

    overall_score NUMERIC(5,2) NOT NULL
        CHECK (overall_score BETWEEN 0 AND 100),

    risk_level VARCHAR(20) NOT NULL
        CHECK (risk_level IN ('low', 'medium', 'high')),

    safety_grade CHAR(1) NOT NULL
        CHECK (safety_grade IN ('A', 'B', 'C')),

    smooth_driving_score NUMERIC(5,2)
        CHECK (smooth_driving_score BETWEEN 0 AND 100),

    harsh_braking_score NUMERIC(5,2)
        CHECK (harsh_braking_score BETWEEN 0 AND 100),

    speeding_score NUMERIC(5,2)
        CHECK (speeding_score BETWEEN 0 AND 100),

    rapid_acceleration_score NUMERIC(5,2)
        CHECK (rapid_acceleration_score BETWEEN 0 AND 100),

    cornering_score NUMERIC(5,2)
        CHECK (cornering_score BETWEEN 0 AND 100),

    night_drive_score NUMERIC(5,2)
        CHECK (night_drive_score BETWEEN 0 AND 100),

    deliveries_completed INTEGER NOT NULL DEFAULT 0
        CHECK (deliveries_completed >= 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_driver_daily_score
        UNIQUE (driver_id, score_date),

    CONSTRAINT fk_driver_daily_scores_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE CASCADE
);


-- =====================================================
-- 15. DRIVER COACHING GOALS
-- =====================================================

CREATE TABLE driver_coaching_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driver_id UUID NOT NULL,

    goal_title VARCHAR(200) NOT NULL,

    target_metric VARCHAR(100),

    timeframe VARCHAR(100),

    progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0
        CHECK (progress_percent BETWEEN 0 AND 100),

    practical_tip TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_driver_coaching_goals_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Batch 6: Concerns, AI Recommendations and Notifications
-- =====================================================


-- =====================================================
-- 16. DRIVER CONCERNS
-- =====================================================

CREATE TABLE driver_concerns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    concern_code VARCHAR(50) NOT NULL UNIQUE,

    driver_id UUID NOT NULL,

    delivery_id UUID,
    trip_id UUID,

    category VARCHAR(50) NOT NULL
        CHECK (
            category IN (
                'package_issue',
                'pickup_issue',
                'delivery_issue',
                'incorrect_system_detection',
                'other'
            )
        ),

    system_event_type VARCHAR(50),

    system_event_timestamp TIMESTAMP,

    system_event_location TEXT,

    system_event_details TEXT,

    context_reason VARCHAR(50),

    driver_description TEXT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'pending_review'
        CHECK (
            status IN (
                'pending_review',
                'reviewed_verified',
                'dismissed'
            )
        ),

    manager_review_notes TEXT,

    reviewed_by_manager_id UUID,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,

    CONSTRAINT fk_driver_concerns_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_driver_concerns_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_driver_concerns_trip
        FOREIGN KEY (trip_id)
        REFERENCES completed_trips(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_driver_concerns_manager
        FOREIGN KEY (reviewed_by_manager_id)
        REFERENCES fleet_managers(id)
        ON DELETE SET NULL
);


-- =====================================================
-- 17. AI DRIVER RECOMMENDATIONS
-- =====================================================

CREATE TABLE ai_driver_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    request_id UUID NOT NULL,

    driver_id UUID NOT NULL,

    match_score NUMERIC(5,2) NOT NULL
        CHECK (match_score BETWEEN 0 AND 100),

    suitability_reasons JSONB,

    is_best_match BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_recommendations_request
        FOREIGN KEY (request_id)
        REFERENCES delivery_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ai_recommendations_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_ai_recommendation
        UNIQUE (request_id, driver_id)
);


-- =====================================================
-- 18. NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,

    body TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =====================================================
-- FINAL PERFORMANCE INDEXES
-- =====================================================

-- Faster lookup of deliveries by assigned driver
CREATE INDEX idx_deliveries_driver_id
ON deliveries(driver_id);


-- Faster lookup of deliveries by assigned vehicle
CREATE INDEX idx_deliveries_vehicle_id
ON deliveries(vehicle_id);


-- Faster lookup of a client's delivery requests
CREATE INDEX idx_delivery_requests_client_id
ON delivery_requests(client_id);


-- Faster lookup of trip events
CREATE INDEX idx_trip_events_trip_id
ON trip_events(trip_id);


-- Faster lookup of a driver's trips
CREATE INDEX idx_completed_trips_driver_id
ON completed_trips(driver_id);


-- Faster lookup of notifications
CREATE INDEX idx_notifications_user_id
ON notifications(user_id);


-- Faster lookup of unread notifications
CREATE INDEX idx_notifications_unread
ON notifications(user_id)
WHERE is_read = FALSE;