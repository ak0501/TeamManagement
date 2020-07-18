DROP DATABASE IF EXISTS management_db;
CREATE DATABASE management_db;
USE management_db;
-- ───────────────────────────────Department TABLE ─────────────────────────────────────────────────
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);
-- ───────────────────────────────────Role TABLE ─────────────────────────────────────────────
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL UNIQUE,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- ───────────────────────────────Employee TABLE ─────────────────────────────────────────────────
CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
-- ───────────Insert columns into department table────────────────────────────────────────────────────────────
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Design");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Assembly");
-- ────────────────────────────────────────────────────────────────────────────────
-- Fill columns with row values
-- ────────────────────────────────────────────────────────────────────────────────
INSERT INTO role (title, salary, department_id)
VALUES ("Sales manager", 85000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales assistance", 45000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("principal Engineer", 95000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Design Engineer", 78500, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("purchasing", 45000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("controls Manager", 10500, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("controls Engineer", 85000, 4);
-- ────────────────────────────────────────────────────────────────────────────────
-- Fill columns with row values//
-- ────────────────────────────────────────────────────────────────────────────────
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bender", "America", 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hermes", "France", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leela", "China", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Farnsworth", "Egypt", 4, 1);
-- ────────────────────────────────────────────────────────────────────────────────
SELECT *
FROM department;
-- ────────────────────────────────────────────────────────────────────────────────
SELECT *
FROM role;
-- ────────────────────────────────────────────────────────────────────────────────
SELECT * 
FROM employee;
-- ────────────────────────────────────────────────────────────────────────────────
SELECT employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  department.name as department,
  role.salary,
  CONCAT(e.first_name, " ", e.last_name) as manager
FROM employee
  inner join role ON (employee.role_id = role.id)
  inner join department on role.department_id = department.id
  left join employee as e on employee.manager_id = e.id;
-- ────────────────────────────────────────────────────────────────────────────────
SELECT *
from employee
  left join employee as e on employee.manager_id = e.id;
SELECT e.id,
  CONCAT(e.first_name, " ", e.last_name) as manager
FROM employee
  inner join employee as e on employee.manager_id = e.id
GROUP BY manager;
select *
from employee;