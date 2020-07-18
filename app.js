// jshint esversion:8
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const questions = require("./questions");


let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'management_db',
  port: 3306
});

connection.connect(err => {
  if (err) {
    return console.error('error: ' + err.message);
  }
  startPrompt();
});

// function which prompts the user for what action they should take

function startPrompt() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "End"
      ]
    })
    .then(function ({
      task
    }) {
      switch (task) {
        case "View All Employees":
          viewAllEmployee();
          break;
        case "View All Employees by Department":
          viewEmployeeByDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employees":
          removeEmployees();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "End":
          connection.end();
          break;
      }
    });
}

// ───────────────────────viewAllEmployees────────────────────────────────────────────────────────

function viewAllEmployee() {
  const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary FROM employee inner join role ON (employee.role_id = role.id) inner join department on role.department_id = department.id`;

  connection.query(sqlQuery, (err, res) => {
    if (err) throw err;
    // console.log(res);
    console.table(res); // takes in array of objects with same properties
    startPrompt();
  });
}

// ─────────────────────View Employees By Department───────────────────────────────────────────────────────────
function viewEmployeeByDepartment() {
  console.log("Viewing employees by department\n");

  let sqlQuery =
    `SELECT d.id, d.name, r.salary AS budget
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name`;

  connection.query(sqlQuery, function (err, res) {
    if (err) throw err;
    const departmentChoices = res.map(data => ({
      value: data.id,
      name: data.name
    }));
    console.table(res);
    console.log("Department view succeed!\n");
    promptDepartment(departmentChoices);
  });

}
// ──────────────────────────────────Prompt Department Choices──────────────────────────────────────────────

function promptDepartment(departmentChoices) {

  inquirer
    .prompt([{
      type: "list",
      name: "departmentId",
      message: "Which department would you choose?",
      choices: departmentChoices
    }])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  WHERE d.id = ?`;

      connection.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;


        console.table("response ", res);
        console.log(res.affectedRows + "Employees are viewed!\n");

        Prompt();
      });
    });
}

// ────────────────────────────────Add Employee────────────────────────────────────────────────


function addEmployee() {
  console.log("Inserting an employee!");

  let query =
    `SELECT r.id, r.title, r.salary 
      FROM role r`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({
      id,
      title,
      salary
    }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
  });
}

function promptInsert(roleChoices) {

  inquirer
    .prompt([{
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      let query = `INSERT INTO employee SET ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(query, {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          startPrompt();
        });
    });
}

// ───────────────────────────────Remove Employees─────────────────────────────────────────────────


function removeEmployees() {
  console.log("Deleting an employee");

  var query =
    `SELECT employee.id, employee.first_name, employee.last_name
      FROM employee`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({
      id,
      first_name,
      last_name
    }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
}



function promptDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([{
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: deleteEmployeeChoices
    }])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(query, {
        id: answer.employeeId
      }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        startPrompt();
      });
    });
}

// ──────────────────────────────Update Employee Roles──────────────────────────────────────────────────

function updateEmployeeRole() {

  employeeArray();

}
// ─────────────────────────────────────Update Array───────────────────────────────────────────
function employeeArray() {
  console.log("Updating an employee");
  let query =
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
  FROM employee 
  JOIN role 
	ON employee.role_id = role.id
  JOIN department 
  ON department.id = role.department_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("employeeArray To Update!\n");

    roleArray(employeeChoices);
  });

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({
      id,
      first_name,
      last_name
    }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("employeeArray To Update!\n");

    roleArray(employeeChoices);
  });
}


// ───────────────────────────────Update Role─────────────────────────────────────────────────
function updateEmployeeRole() {
  employeeArray();

}

function employeeArray() {
  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({
      id,
      first_name,
      last_name
    }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("employeeArray To Update!\n");

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Updating an role");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`;
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({
      id,
      title,
      salary
    }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`
    }));

    console.table(res);
    console.log("roleArray to Update!\n");

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([{
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(query,
        [answer.roleId,
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          startPrompt();
        });
      // console.log(query.sql);
    });
}



// ──────────────────────────Add Roles──────────────────────────────────────────────────────

function addRole() {

  let query =
    `
SELECT department.id, department.name, role.salary 
    FROM employee 
    JOIN role 
    ON employee.role_id = role.id
    JOIN department 
    ON department.id = role.department_id
    GROUP BY department.id, department.name`;

  connection.query(query, function (err, res) {
    if (err) throw err;


    const departmentChoices = res.map(({
      id,
      name
    }) => ({
      value: id,
      name: `
  $ {
    id
  }
  $ {
    name
  }
  `
    }));

    console.table(res);
    console.log("Department array!");

    promptAddRole(departmentChoices);
  });
}
// ────────────────────────────────────────────────────────────────────────────────
function promptAddRole(departmentChoices) {

  inquirer
    .prompt([{
        type: "input",
        name: "roleTitle",
        message: "Role title?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then(function (answer) {

      let query = `
  INSERT INTO role SET ? `;

      connection.query(query, {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Role Inserted!");

          startPrompt();
        });
    });
}
// ──────────────────────────────────END──────────────────────────────────────────────