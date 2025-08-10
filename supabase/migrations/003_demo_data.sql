-- Insert demo user (password: demo123456)
-- Note: This should be created through Supabase Auth, not directly in the database
-- The demo user creation is handled in the application code

-- Insert demo products
INSERT INTO products (id, model, description, specifications, release_date) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Model S', 'Premium Elektro-Limousine', '{"range": "652 km", "acceleration": "2.1s", "top_speed": "322 km/h"}', '2012-06-22'),
('b2c3d4e5-f678-90ab-cdef-123456789012', 'Model 3', 'Kompakte Elektro-Limousine', '{"range": "567 km", "acceleration": "3.3s", "top_speed": "261 km/h"}', '2017-07-28'),
('c3d4e5f6-7890-abcd-ef12-345678901234', 'Model X', 'Elektro-SUV', '{"range": "580 km", "acceleration": "2.6s", "top_speed": "262 km/h"}', '2015-09-29'),
('d4e5f678-90ab-cdef-1234-567890123456', 'Model Y', 'Kompakt-SUV', '{"range": "533 km", "acceleration": "3.7s", "top_speed": "241 km/h"}', '2020-03-13');

-- Insert demo machines
INSERT INTO machines (id, name, type, status, specifications, last_maintenance, next_maintenance, location) VALUES
('e5f67890-abcd-ef12-3456-78901234567a', 'CNC-Fräse Alpha', 'CNC', 'operational', '{"precision": "0.001mm", "max_speed": "20000 RPM"}', '2024-01-15', '2024-04-15', 'Halle A - Sektor 1'),
('f6789012-bcde-f123-4567-890123456789', 'Schweißroboter Beta', 'Welding', 'operational', '{"type": "MIG/MAG", "reach": "2.5m"}', '2024-01-20', '2024-04-20', 'Halle A - Sektor 2'),
('67890123-cdef-1234-5678-901234567890', 'Lackieranlage Gamma', 'Painting', 'maintenance', '{"capacity": "50 units/hour", "colors": "unlimited"}', '2024-02-01', '2024-05-01', 'Halle B - Sektor 1'),
('78901234-def1-2345-6789-012345678901', 'Montagestation Delta', 'Assembly', 'operational', '{"stations": 8, "capacity": "30 units/hour"}', '2024-01-25', '2024-04-25', 'Halle B - Sektor 2'),
('89012345-ef12-3456-7890-123456789012', 'Prüfstand Epsilon', 'Testing', 'idle', '{"tests": ["electrical", "mechanical", "software"]}', '2024-01-10', '2024-04-10', 'Halle C - Sektor 1');

-- Insert demo employees
INSERT INTO employees (id, name, employee_number, role, department, hire_date, phone, email) VALUES
('90123456-f123-4567-8901-234567890123', 'Max Mustermann', 'EMP001', 'admin', 'Management', '2020-01-15', '+49 170 1234567', 'max.mustermann@mes-system.com'),
('01234567-1234-5678-9012-345678901234', 'Anna Schmidt', 'EMP002', 'manager', 'Produktion', '2020-03-01', '+49 170 2345678', 'anna.schmidt@mes-system.com'),
('12345678-2345-6789-0123-456789012345', 'Peter Weber', 'EMP003', 'operator', 'Produktion', '2021-06-15', '+49 170 3456789', 'peter.weber@mes-system.com'),
('23456789-3456-7890-1234-567890123456', 'Maria Fischer', 'EMP004', 'operator', 'Qualitätskontrolle', '2021-09-01', '+49 170 4567890', 'maria.fischer@mes-system.com'),
('34567890-4567-8901-2345-678901234567', 'Thomas Meyer', 'EMP005', 'operator', 'Wartung', '2022-01-10', '+49 170 5678901', 'thomas.meyer@mes-system.com');

-- Insert demo materials
INSERT INTO materials (id, name, description, unit, stock_quantity, min_stock_level, max_stock_level, supplier, cost_per_unit) VALUES
('45678901-5678-9012-3456-789012345678', 'Aluminium-Legierung 7075', 'Hochfeste Aluminiumlegierung', 'kg', 5000, 1000, 10000, 'MetallTech GmbH', 8.50),
('56789012-6789-0123-4567-890123456789', 'Lithium-Ionen-Batteriezellen', '4680 Batteriezellen', 'Stück', 10000, 2000, 20000, 'BatteryPro AG', 45.00),
('67890123-7890-1234-5678-901234567890', 'Carbon-Faser', 'Hochleistungs-Kohlefaser', 'm²', 500, 100, 1000, 'CarbonTech Solutions', 120.00),
('78901234-8901-2345-6789-012345678901', 'Elektronik-Komponenten', 'Verschiedene Chips und Sensoren', 'Set', 200, 50, 500, 'ElectroSupply Ltd', 250.00),
('89012345-9012-3456-7890-123456789012', 'Spezial-Lack', 'Umweltfreundlicher Autolack', 'Liter', 300, 50, 600, 'ColorCoat Systems', 35.00);

-- Insert demo components
INSERT INTO components (id, name, description, product_id, specifications) VALUES
('90123456-0123-4567-8901-234567890123', 'Batteriepack', 'Hauptbatteriepack', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"capacity": "100 kWh", "weight": "480 kg"}'),
('01234567-1234-5678-9012-345678901234', 'Elektromotor', 'Permanentmagnet-Synchronmotor', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"power": "450 kW", "torque": "930 Nm"}'),
('12345678-2345-6789-0123-456789012345', 'Autopilot-Computer', 'FSD Computer', 'b2c3d4e5-f678-90ab-cdef-123456789012', '{"version": "HW4.0", "processing_power": "144 TOPS"}'),
('23456789-3456-7890-1234-567890123456', 'Fahrwerk', 'Adaptives Luftfederungssystem', 'c3d4e5f6-7890-abcd-ef12-345678901234', '{"type": "air_suspension", "adjustable": true}');

-- Insert demo productions
INSERT INTO productions (id, production_number, product_id, machine_id, employee_id, status, planned_quantity, actual_quantity, start_time, end_time) VALUES
('34567890-4567-8901-2345-678901234567', 'PRD-2024-001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'e5f67890-abcd-ef12-3456-78901234567a', '12345678-2345-6789-0123-456789012345', 'completed', 10, 10, '2024-02-01 08:00:00+00', '2024-02-01 16:00:00+00'),
('45678901-5678-9012-3456-789012345678', 'PRD-2024-002', 'b2c3d4e5-f678-90ab-cdef-123456789012', 'f6789012-bcde-f123-4567-890123456789', '12345678-2345-6789-0123-456789012345', 'completed', 15, 14, '2024-02-02 08:00:00+00', '2024-02-02 16:00:00+00'),
('56789012-6789-0123-4567-890123456789', 'PRD-2024-003', 'c3d4e5f6-7890-abcd-ef12-345678901234', '78901234-def1-2345-6789-012345678901', '23456789-3456-7890-1234-567890123456', 'in_progress', 8, 5, '2024-02-03 08:00:00+00', NULL),
('67890123-7890-1234-5678-901234567890', 'PRD-2024-004', 'd4e5f678-90ab-cdef-1234-567890123456', 'e5f67890-abcd-ef12-3456-78901234567a', '12345678-2345-6789-0123-456789012345', 'planned', 20, 0, '2024-02-05 08:00:00+00', NULL);

-- Insert demo quality checks
INSERT INTO quality_checks (id, production_id, employee_id, result, check_date, method, measurements, comments) VALUES
('78901234-8901-2345-6789-012345678901', '34567890-4567-8901-2345-678901234567', '23456789-3456-7890-1234-567890123456', 'passed', '2024-02-01 15:30:00+00', 'Visual Inspection', '{"defects": 0, "tolerance": "within_spec"}', 'Alle Einheiten bestanden die Qualitätskontrolle'),
('89012345-9012-3456-7890-123456789012', '45678901-5678-9012-3456-789012345678', '23456789-3456-7890-1234-567890123456', 'failed', '2024-02-02 15:45:00+00', 'Functional Test', '{"defects": 1, "issue": "software_calibration"}', 'Eine Einheit benötigt Nachkalibrierung'),
('90123456-0123-4567-8901-234567890123', '56789012-6789-0123-4567-890123456789', '23456789-3456-7890-1234-567890123456', 'pending', '2024-02-03 14:00:00+00', 'Performance Test', NULL, 'Test läuft noch');

-- Insert demo material consumption
INSERT INTO material_consumption (id, production_id, material_id, quantity_used, unit_cost) VALUES
('01234567-1234-5678-9012-345678901234', '34567890-4567-8901-2345-678901234567', '45678901-5678-9012-3456-789012345678', 100.5, 8.50),
('12345678-2345-6789-0123-456789012345', '34567890-4567-8901-2345-678901234567', '56789012-6789-0123-4567-890123456789', 200, 45.00),
('23456789-3456-7890-1234-567890123456', '45678901-5678-9012-3456-789012345678', '67890123-7890-1234-5678-901234567890', 25.5, 120.00);

-- Insert demo maintenance records
INSERT INTO maintenance_records (id, machine_id, performed_by, maintenance_date, maintenance_type, description, cost, next_maintenance) VALUES
('34567890-4567-8901-2345-678901234567', 'e5f67890-abcd-ef12-3456-78901234567a', '34567890-4567-8901-2345-678901234567', '2024-01-15', 'Routine', 'Reguläre Wartung und Schmierung', 250.00, '2024-04-15'),
('45678901-5678-9012-3456-789012345678', 'f6789012-bcde-f123-4567-890123456789', '34567890-4567-8901-2345-678901234567', '2024-01-20', 'Routine', 'Schweißdüsen gereinigt und kalibriert', 180.00, '2024-04-20');

-- Insert demo error reports
INSERT INTO error_reports (id, production_id, machine_id, reported_by, error_code, description, severity, status) VALUES
('56789012-6789-0123-4567-890123456789', '45678901-5678-9012-3456-789012345678', 'f6789012-bcde-f123-4567-890123456789', '12345678-2345-6789-0123-456789012345', 'ERR-WLD-001', 'Schweißnaht-Qualität unterhalb der Toleranz', 'medium', 'resolved'),
('67890123-7890-1234-5678-901234567890', '56789012-6789-0123-4567-890123456789', '78901234-def1-2345-6789-012345678901', '23456789-3456-7890-1234-567890123456', 'ERR-ASM-003', 'Montagestation 3 - Sensorfehler', 'high', 'in_progress');