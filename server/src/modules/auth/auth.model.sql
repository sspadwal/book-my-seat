CREATE TABLE myapp.users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(50) NOT NULL,
    
    email VARCHAR(100) UNIQUE NOT NULL,
    
    password TEXT NOT NULL,
    
    role VARCHAR(20) DEFAULT 'customer'
        CHECK (role IN ('customer', 'seller', 'admin')),
    
    is_verified BOOLEAN DEFAULT FALSE,
    
    verification_token TEXT,
    
    refresh_token TEXT,
    
    reset_password_token TEXT,
    
    reset_password_expires TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);