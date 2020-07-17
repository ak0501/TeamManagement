DROP DATABASE IF EXISTS mgt_db;
CREATE DATABASE mgt_db;
USE mgt_db;
CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30) NOT NULL
);
CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title NVARCHAR (30) NOT NULL,
    salary VARCHAR (30) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);
CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES department(id) ON DELETE CASCADE
);
-- adding relationship between tables primary key and foreign key
-- role.department_id = department.id (Both should match)
-- employee.department_id = employee.id (Both should match)
insert into department (name)
values('Sales');
insert into department (name)
values ('Assembly');
insert into department (name)
values ('Engineering');
insert into role (title, salary, department_id)
values ("eng.Manager", 95000, 1);
insert into role (title, salary, department_id)
values ("Designer", 75000, 1);
insert into role (title, salary, department_id)
values ("Machine Builder", 55000, 2);
insert into role (title, salary, department_id)
values ("Controls Tech", 55000, 2);
insert into role (title, salary, department_id)
values ("sales_Manager", 85000, 3);
insert into role (title, salary, department_id)
values ("sales_reps", 65000, 3);
insert into role (title, salary, department_id)
values ("Purchasing_coordinator", 75000, 4);
insert into role (title, salary, department_id)
values ("invoice_assistant", 4500, 4);
insert into employee (first_name, last_name, role_id, manager_id)
values ("Bender", "Rodri", 3, 1);
insert into employee (first_name, last_name, role_id, manager_id)
values ("Hermes", "kanobi", 3, 2);
insert into employee (first_name, last_name, role_id, manager_id)
values ("Fry", "zabba", 2, 3);
insert into employee (first_name, last_name, role_id, manager_id)
values ("zoidberg", "wakanda", 1, 4);
select *
from department;
SELECT employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name as department,
    role.salary
FROM employee
    inner join role ON (employee.role_id = role.id)
    inner join department on role.department_id = department.id
    left join employee as e on employee.manager_id = e.id;