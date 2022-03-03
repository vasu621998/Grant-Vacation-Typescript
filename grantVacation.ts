type Index<T> = Record<string, T>;

interface AddressBook {
    emp_id: string;
    first: string;
    last: string;
    email: string;
}
 interface Payroll {
    emp_id: string;
    vacationDays: number;
}
interface Employee {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
}
interface EmailApi {
    sendEmail(email: string, subject: string, body: string): void;
}
function yearsSince(startDate: Date, endDate: Date): number {
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    return Math.trunc((endDate.getTime() - startDate.getTime()) / millisecondsPerYear);
}
/**
 * We haved decided to grant bonus vacation to every employee, 1 day per year of experience
 * we need to email them a notice.
 */

function calculateVacation(payrollInfo: Payroll, empInfo: Employee) {
    const today = new Date();
    const yearsEmployed = empInfo === undefined ? 0 : yearsSince(empInfo.startDate, today);
    const newVacationBalance = yearsEmployed + payrollInfo.vacationDays;
    // return all the relevant values from this promise as a single array to use.
    return [empInfo.name, yearsEmployed, newVacationBalance];
}

function sendEmail(
  emailApi: EmailApi,
  payrollInfo: Payroll,
  addresses: Index<AddressBook>,
  employees: Index<Employee>
) {
    const startTime = Date.now();
    const addressInfo = addresses[payrollInfo.emp_id];
    if (addressInfo === undefined) {
      return;
    }

    const [empInfoName, yearsEmployed, newVacationBalance] = calculateVacation(payrollInfo, employees[payrollInfo.emp_id]);
    emailApi.sendEmail(
      addressInfo.email,
      "Good news!",
      `Dear ${empInfoName}\n` +
      `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`
    );
    
    const msElapsed = Date.now() - startTime;
    console.log(`function took ${msElapsed} ms to complete.`);
}

function grantVacation(
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: Index<AddressBook>,
    employees: Index<Employee>) {

    payroll.forEach(payrollInfo => {
        sendEmail(emailApi, payrollInfo, addresses, employees);
    });
}

// for the testing part I'll implement sendEmail as printing:
class myEmailApi implements EmailApi {
    sendEmail(email: string, subject: string, body: string): void {
        console.log('********************');
        console.log(`To ${email}, Subject: ${subject}, body: ${body}`);
        console.log('********************');
    }
}

let myPayroll: Payroll[] = [
    { emp_id: "1", vacationDays: 1 },
    { emp_id: "2", vacationDays: 2 },
    { emp_id: "3", vacationDays: 3 },
    { emp_id: "4", vacationDays: 4 },
    { emp_id: "5", vacationDays: 5 },
    { emp_id: "6", vacationDays: 6 }
];

let myAdress: AddressBook[] = [
    { emp_id: "1", first: "emp", last: "number 1", email: "emp1@gmail.com" },
    { emp_id: "2", first: "emp", last: "number 2", email: "emp2@gmail.com" },
    { emp_id: "3", first: "emp", last: "number 3", email: "emp3@gmail.com" },
    { emp_id: "4", first: "emp", last: "number 4", email: "emp4@gmail.com" },
    { emp_id: "5", first: "emp", last: "number 5", email: "emp5@gmail.com" },
    { emp_id: "6", first: "emp", last: "number 6", email: "emp6@gmail.com" },
];

let myEmployees: Employee[] = [
    { id: "1", name: "emp number 1", startDate: new Date("2020-01-01"), endDate: new Date("2025-01-01") },
    { id: "2", name: "emp number 2", startDate: new Date("2019-01-01"), endDate: new Date("2025-01-01") },
    { id: "3", name: "emp number 3", startDate: new Date("2018-01-01"), endDate: new Date("2025-01-01") },
    { id: "4", name: "emp number 4", startDate: new Date("2017-01-01"), endDate: new Date("2025-01-01") },
    { id: "5", name: "emp number 5", startDate: new Date("2016-01-01"), endDate: new Date("2025-01-01") },
    { id: "6", name: "emp number 6", startDate: new Date("2015-01-01"), endDate: new Date("2025-01-01") },
];

const addressByEmpId = Object.fromEntries(myAdress.map(({ emp_id, ...rest }) => [emp_id, { emp_id, ...rest }]));
const employeesById = Object.fromEntries(myEmployees.map(({ id, ...rest }) => [id, { id, ...rest }]));

grantVacation(new myEmailApi(), myPayroll, addressByEmpId, employeesById);
