CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE auth.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  parent_role UUID REFERENCES auth.roles(id) ON DELETE SET NULL
);

CREATE TABLE auth.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE auth.role_permissions (
  role_id UUID REFERENCES auth.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES auth.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE auth.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES auth.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);


-- Seed roles
INSERT INTO auth.roles (name) VALUES
('admin'),
('editor'),
('viewer');

-- Seed permissions
INSERT INTO auth.permissions (entity, action, description) VALUES
('user', 'create', 'Permission to create a user'),
('user', 'read', 'Permission to read user data'),
('user', 'update', 'Permission to update user data'),
('user', 'delete', 'Permission to delete a user'),
('role', 'assign', 'Permission to assign roles'),
('role', 'revoke', 'Permission to revoke roles');

-- Seed role_permissions
INSERT INTO auth.role_permissions (role_id, permission_id) VALUES
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'create')),
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'read')),
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'update')),
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'delete')),
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'role' AND action = 'assign')),
((SELECT id FROM auth.roles WHERE name = 'admin'), (SELECT id FROM auth.permissions WHERE entity = 'role' AND action = 'revoke')),

((SELECT id FROM auth.roles WHERE name = 'editor'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'read')),
((SELECT id FROM auth.roles WHERE name = 'editor'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'update')),

((SELECT id FROM auth.roles WHERE name = 'viewer'), (SELECT id FROM auth.permissions WHERE entity = 'user' AND action = 'read'));

-- Seed users
INSERT INTO auth.users (name, email, password_hash) VALUES
('Alice', 'alice@example.com', 'alice@example.com'),
('Bob', 'bob@example.com', 'bob@example.com'),
('Charlie', 'charlie@example.com', 'charlie@example.com');

-- Seed user_roles
INSERT INTO auth.user_roles (user_id, role_id) VALUES
((SELECT id FROM auth.users WHERE email = 'alice@example.com'), (SELECT id FROM auth.roles WHERE name = 'admin')),
((SELECT id FROM auth.users WHERE email = 'bob@example.com'), (SELECT id FROM auth.roles WHERE name = 'editor')),
((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), (SELECT id FROM auth.roles WHERE name = 'viewer'));