DROP DATABASE IF EXISTS messenger;
DROP USER IF EXISTS moderator;
CREATE USER moderator WITH PASSWORD 'moderator';
CREATE DATABASE messenger OWNER moderator;
ALTER USER moderator WITH PASSWORD '<new_password>'
