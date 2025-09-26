-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','admin','super_admin')),
  name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- payment_requests
CREATE TYPE payment_status AS ENUM ('pending','admin_approved','admin_rejected','approved','rejected');

CREATE TABLE payment_requests (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(12,2) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- approval_audits
CREATE TABLE approval_audits (
  id SERIAL PRIMARY KEY,
  payment_request_id INTEGER REFERENCES payment_requests(id),
  actor_user_id INTEGER REFERENCES users(id),
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);
