import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runSQLCode } from '../runner/sql-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SQL_DIR = path.resolve(__dirname, '../../../problems/sql');

const SQL_VARIATIONS: Record<string, string[]> = {
  'combine-two-tables': [
    `
      CREATE TABLE Person (personId INT, lastName VARCHAR(255), firstName VARCHAR(255));
      CREATE TABLE Address (addressId INT, personId INT, city VARCHAR(255), state VARCHAR(255));
      INSERT INTO Person VALUES (1, 'Smith', 'John'), (2, 'Doe', 'Jane'), (3, 'Brown', 'Charlie');
      INSERT INTO Address VALUES (1, 1, 'Chicago', 'Illinois'), (2, 2, 'Houston', 'Texas');
    `,
    `
      CREATE TABLE Person (personId INT, lastName VARCHAR(255), firstName VARCHAR(255));
      CREATE TABLE Address (addressId INT, personId INT, city VARCHAR(255), state VARCHAR(255));
      INSERT INTO Person VALUES (1, 'Solo', 'Han');
    `,
    `
      CREATE TABLE Person (personId INT, lastName VARCHAR(255), firstName VARCHAR(255));
      CREATE TABLE Address (addressId INT, personId INT, city VARCHAR(255), state VARCHAR(255));
      INSERT INTO Person VALUES (1, 'A', 'B');
      INSERT INTO Address VALUES (1, 1, 'City1', 'State1'), (2, 1, 'City2', 'State2');
    `,
    `
      CREATE TABLE Person (personId INT, lastName VARCHAR(255), firstName VARCHAR(255));
      CREATE TABLE Address (addressId INT, personId INT, city VARCHAR(255), state VARCHAR(255));
      INSERT INTO Person VALUES (10, 'Taylor', 'Bob'), (20, 'Clark', 'Alice');
      INSERT INTO Address VALUES (1, 20, 'Miami', 'Florida');
    `
  ],
  'customers-who-never-order': [
    `
      CREATE TABLE Customers (id INT, name VARCHAR(255));
      CREATE TABLE Orders (id INT, customerId INT);
      INSERT INTO Customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
      INSERT INTO Orders VALUES (1, 1), (2, 2), (3, 3);
    `,
    `
      CREATE TABLE Customers (id INT, name VARCHAR(255));
      CREATE TABLE Orders (id INT, customerId INT);
      INSERT INTO Customers VALUES (1, 'Solo');
    `,
    `
      CREATE TABLE Customers (id INT, name VARCHAR(255));
      CREATE TABLE Orders (id INT, customerId INT);
      INSERT INTO Customers VALUES (1, 'Dan'), (2, 'Eva');
      INSERT INTO Orders VALUES (1, 1);
    `,
    `
      CREATE TABLE Customers (id INT, name VARCHAR(255));
      CREATE TABLE Orders (id INT, customerId INT);
      INSERT INTO Customers VALUES (10, 'A'), (20, 'B'), (30, 'C'), (40, 'D');
      INSERT INTO Orders VALUES (1, 20), (2, 40);
    `
  ],
  'department-highest-salary': [
    `
      CREATE TABLE Department (id INT, name VARCHAR(255));
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, departmentId INT);
      INSERT INTO Department VALUES (1, 'Engineering');
      INSERT INTO Employee VALUES (1, 'Alice', 100000, 1), (2, 'Bob', 120000, 1), (3, 'Charlie', 120000, 1);
    `,
    `
      CREATE TABLE Department (id INT, name VARCHAR(255));
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, departmentId INT);
      INSERT INTO Department VALUES (1, 'HR'), (2, 'Finance');
      INSERT INTO Employee VALUES (1, 'Dan', 50000, 1), (2, 'Eva', 60000, 2);
    `,
    `
      CREATE TABLE Department (id INT, name VARCHAR(255));
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, departmentId INT);
      INSERT INTO Department VALUES (1, 'Marketing');
      INSERT INTO Employee VALUES (1, 'Leo', 85000, 1);
    `,
    `
      CREATE TABLE Department (id INT, name VARCHAR(255));
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, departmentId INT);
      INSERT INTO Department VALUES (1, 'Sales'), (2, 'Support');
      INSERT INTO Employee VALUES (1, 'X', 40000, 1), (2, 'Y', 50000, 1), (3, 'Z', 30000, 2), (4, 'W', 30000, 2);
    `
  ],
  'duplicate-emails': [
    `
      CREATE TABLE Person (id INT, email VARCHAR(255));
      INSERT INTO Person VALUES (1, 'x@y.com'), (2, 'x@y.com'), (3, 'x@y.com');
    `,
    `
      CREATE TABLE Person (id INT, email VARCHAR(255));
      INSERT INTO Person VALUES (1, 'unique@mail.com'), (2, 'unique2@mail.com');
    `,
    `
      CREATE TABLE Person (id INT, email VARCHAR(255));
      INSERT INTO Person VALUES (1, 'a@a.com'), (2, 'b@b.com'), (3, 'a@a.com'), (4, 'c@c.com'), (5, 'b@b.com');
    `,
    `
      CREATE TABLE Person (id INT, email VARCHAR(255));
      INSERT INTO Person VALUES (1, 'test@test.com');
    `
  ],
  'employees-earning-more-than-their-managers': [
    `
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, managerId INT);
      INSERT INTO Employee VALUES (1, 'Alice', 100000, 2), (2, 'Bob', 80000, NULL);
    `,
    `
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, managerId INT);
      INSERT INTO Employee VALUES (1, 'Dan', 50000, 2), (2, 'Eva', 60000, NULL);
    `,
    `
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, managerId INT);
      INSERT INTO Employee VALUES (1, 'Boss', 200000, NULL), (2, 'Worker1', 150000, 1), (3, 'Worker2', 250000, 1);
    `,
    `
      CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, managerId INT);
      INSERT INTO Employee VALUES (1, 'Solo', 90000, NULL);
    `
  ],
  'second-highest-salary': [
    `
      CREATE TABLE Employee (id INT, salary INT);
      INSERT INTO Employee VALUES (1, 500), (2, 500), (3, 400), (4, 300);
    `,
    `
      CREATE TABLE Employee (id INT, salary INT);
      INSERT INTO Employee VALUES (1, 1000), (2, 2000);
    `,
    `
      CREATE TABLE Employee (id INT, salary INT);
      INSERT INTO Employee VALUES (1, 100), (2, 100), (3, 100);
    `
  ]
};

export async function expandSqlTestCases() {
  const files = fs.readdirSync(SQL_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(SQL_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const variations = SQL_VARIATIONS[data.slug];
    if (!variations || !data.reference_solution.sql) continue;

    for (const ddl of variations) {
      if (data.test_cases.length >= 5) break;

      try {
        const sqlRes = await runSQLCode({
          code: data.reference_solution.sql,
          test_cases: [{ schema_ddl: ddl, expected_output: [], hidden: false }]
        });

        const actual = sqlRes.results[0]?.actual_output;
        if (actual) {
          data.test_cases.push({
            schema_ddl: ddl,
            expected_output: actual,
            hidden: true
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ [SQL Expanded] ${data.title} -> ${data.test_cases.length} test cases`);
  }
}

expandSqlTestCases();
