// types/index.ts
export interface Role { roleId: number; name: string; }
export interface Employee {
  employeeId: number;
  fullName: string;
  email?: string;
  designation?: string;
  basicSalary?: number;
  bankAccountNo?: string;
  joiningDate?: string;
  roleId?: number;
  role?: Role;
}
export interface AttendanceDto {
  employeeId: number;
  monthYear: string; // YYYY-MM-01
  workingHours: number;
  overtimeHours: number;
  unpaidLeaves: number;
}
export interface Payroll {
  payrollId?: number;
  employeeId: number;
  month: string;
  basicSalary: number;
  epf: number;
  etf: number;
  tax: number;
  netSalary: number;
  // ... add other fields your backend returns
}
