-- Create the products table to store information about different car models
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,      -- Unique identifier for each product
    model VARCHAR(255) NOT NULL,        -- Model name of the product (e.g., Model S, Model 3)
    description TEXT,                   -- Description of the product
    release_date DATE                   -- Release date of the product
);

-- Create the components table to store individual parts used in products
CREATE TABLE components (
    component_id SERIAL PRIMARY KEY,    -- Unique identifier for each component
    name VARCHAR(255) NOT NULL,         -- Name of the component
    description TEXT NOT NULL,          -- Description of the component
    product_id INT NOT NULL REFERENCES products(product_id), -- Associated product
    machine_id INT NOT NULL REFERENCES machines(machine_id)  -- Machine used for production
);

-- Create the machines table to store information about the machines used in production
CREATE TABLE machines (
    machine_id SERIAL PRIMARY KEY,      -- Unique identifier for each machine
    name VARCHAR(255) NOT NULL,         -- Name of the machine
    type VARCHAR(50),                    -- Type of the machine (e.g., CNC, welding)
    status VARCHAR(50),                  -- Current status of the machine (e.g., operational, under maintenance)
    last_maintenance DATE                -- Date of the last maintenance performed
);

-- Create the employees table to store information about the workers
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,      -- Unique identifier for each employee
    name VARCHAR(255) NOT NULL,          -- Name of the employee
    role VARCHAR(50),                    -- Role of the employee (e.g., operator, supervisor)
    hire_date DATE                       -- Date when the employee was hired
);

-- Create the productions table to record production activities
CREATE TABLE productions (
    production_id SERIAL PRIMARY KEY,    -- Unique identifier for each production run
    product_id INT NOT NULL REFERENCES products(product_id),  -- Product being produced
    start_time TIMESTAMP NOT NULL,       -- Start time of the production
    end_time TIMESTAMP NOT NULL,         -- End time of the production
    quantity INT NOT NULL,               -- Quantity produced
    machine_id INT NOT NULL REFERENCES machines(machine_id),  -- Machine used for production
    employee_id INT NOT NULL REFERENCES employees(employee_id) -- Employee overseeing production
);

-- Create the quality_check table to track quality inspections
CREATE TABLE quality_checks (
    check_id SERIAL PRIMARY KEY,         -- Unique identifier for each quality check
    production_id INT NOT NULL REFERENCES productions(production_id),  -- Production associated with the quality check
    result VARCHAR(50),                  -- Result of the quality check (e.g., passed, failed)
    check_date TIMESTAMP NOT NULL,      -- Date of the quality check
    employee_id INT NOT NULL REFERENCES employees(employee_id),  -- Employee who performed the check
    method VARCHAR(50),                  -- Method used for the quality check
    comments TEXT                        -- Additional comments regarding the quality check
);

-- Create the materials table to track raw materials used in production
CREATE TABLE materials (
    material_id SERIAL PRIMARY KEY,      -- Unique identifier for each material
    name VARCHAR(255) NOT NULL,          -- Name of the material
    description TEXT,                    -- Description of the material
    stock_quantity INT                   -- Quantity of the material in stock
);

-- Create a table to track material consumption during productions
CREATE TABLE material_consumption (
    consumption_id SERIAL PRIMARY KEY,    -- Unique identifier for each consumption record
    production_id INT NOT NULL REFERENCES productions(production_id),  -- Production associated with the consumption
    material_id INT NOT NULL REFERENCES materials(material_id),        -- Material used
    quantity_used INT                     -- Quantity of material consumed
);

-- Create a table to track maintenance records for machines
CREATE TABLE maintenance_records (
    maintenance_id SERIAL PRIMARY KEY,    -- Unique identifier for each maintenance record
    machine_id INT NOT NULL REFERENCES machines(machine_id),  -- Machine that was maintained
    maintenance_date DATE NOT NULL,       -- Date of the maintenance
    description TEXT,                     -- Description of the maintenance performed
    performed_by INT NOT NULL REFERENCES employees(employee_id) -- Employee who performed the maintenance
);

-- Create a table to log error reports during production
CREATE TABLE error_reports (
    error_id SERIAL PRIMARY KEY,          -- Unique identifier for each error report
    production_id INT NOT NULL REFERENCES productions(production_id),  -- Associated

