-- DCL
-- Data Control Language
-- Works on granting and revoking privileges on Databases

-- GRANT
-- Gives privileges to users or Roles
GRANT SELECT ON products TO bhushan;
GRANT INSERT, UPDATE ON products TO  sales_team;

-- Revoke
-- Takes away privileges or roles
REVOKE SELECT ON products FROM bhushan;
REVOKE INSERT, UPDATE ON products FROM sales_team;
