import { db } from '../db/database.js';
import {
  HrEmployee,
  HrDepartment,
  HrDesignation,
  HrEmployeeAssignment,
  HrEmployeeUser,
  HrShift,
  HrEmployeeShift,
  HrAttendance,
  HrAttendanceCorrection,
  HrLeaveType,
  HrLeavePolicy,
  HrLeaveBalance,
  HrLeaveApplication,
  HrHoliday,
  HrOvertime,
  HrSalaryStructure,
  HrSalaryComponent,
  HrPayrollYear,
  HrPayrollPeriod,
  HrPayrollRun,
  HrPayrollItem,
  HrPayslip,
  HrSalaryAdvance,
  HrEmployeeLoan,
  HrLoanInstallment,
  HrReimbursement,
  HrEmployeeDocument,
  HrPerformanceCycle,
  HrEmployeeGoal,
  HrEmployeeReview,
  HrJobRequisition,
  HrCandidate,
  HrApplication,
  HrInterview,
  HrOffer,
  HrOnboarding,
  HrOffboarding,
  HrFinalSettlement
} from '../db/schema.js';

export class HrRepository {

  // Employees
  public async getEmployees(tenantId: string): Promise<HrEmployee[]> {
    return Array.from(db.hrEmployees.values()).filter(e => e.tenantId === tenantId);
  }
  public async getEmployeeById(tenantId: string, id: string): Promise<HrEmployee | undefined> {
    const emp = db.hrEmployees.get(id);
    return emp && emp.tenantId === tenantId ? emp : undefined;
  }
  public async getEmployeeByCode(tenantId: string, code: string): Promise<HrEmployee | undefined> {
    return Array.from(db.hrEmployees.values()).find(e => e.tenantId === tenantId && e.employeeCode === code);
  }
  public async saveEmployee(emp: HrEmployee): Promise<HrEmployee> {
    db.hrEmployees.set(emp.id, emp);
    db.persistToDisk();
    return emp;
  }

  // Departments & Designations
  public async getDepartments(tenantId: string): Promise<HrDepartment[]> {
    return Array.from(db.hrDepartments.values()).filter(d => d.tenantId === tenantId);
  }
  public async getDepartmentById(tenantId: string, id: string): Promise<HrDepartment | undefined> {
    const d = db.hrDepartments.get(id);
    return d && d.tenantId === tenantId ? d : undefined;
  }
  public async saveDepartment(dept: HrDepartment): Promise<HrDepartment> {
    db.hrDepartments.set(dept.id, dept);
    db.persistToDisk();
    return dept;
  }

  public async getDesignations(tenantId: string): Promise<HrDesignation[]> {
    return Array.from(db.hrDesignations.values()).filter(d => d.tenantId === tenantId);
  }
  public async getDesignationById(tenantId: string, id: string): Promise<HrDesignation | undefined> {
    const d = db.hrDesignations.get(id);
    return d && d.tenantId === tenantId ? d : undefined;
  }
  public async saveDesignation(desig: HrDesignation): Promise<HrDesignation> {
    db.hrDesignations.set(desig.id, desig);
    db.persistToDisk();
    return desig;
  }

  // Employee Users
  public async getEmployeeUsers(tenantId: string): Promise<HrEmployeeUser[]> {
    return Array.from(db.hrEmployeeUsers.values()).filter(eu => eu.tenantId === tenantId);
  }
  public async saveEmployeeUser(eu: HrEmployeeUser): Promise<HrEmployeeUser> {
    db.hrEmployeeUsers.set(eu.id, eu);
    db.persistToDisk();
    return eu;
  }

  // Shifts
  public async getShifts(tenantId: string): Promise<HrShift[]> {
    return Array.from(db.hrShifts.values()).filter(s => s.tenantId === tenantId);
  }
  public async saveShift(shift: HrShift): Promise<HrShift> {
    db.hrShifts.set(shift.id, shift);
    db.persistToDisk();
    return shift;
  }

  // Attendance
  public async getAttendance(tenantId: string, employeeId?: string, date?: string): Promise<HrAttendance[]> {
    return Array.from(db.hrAttendances.values()).filter(a => {
      if (a.tenantId !== tenantId) return false;
      if (employeeId && a.employeeId !== employeeId) return false;
      if (date && a.date !== date) return false;
      return true;
    });
  }
  public async getAttendanceById(tenantId: string, id: string): Promise<HrAttendance | undefined> {
    const att = db.hrAttendances.get(id);
    return att && att.tenantId === tenantId ? att : undefined;
  }
  public async saveAttendance(att: HrAttendance): Promise<HrAttendance> {
    db.hrAttendances.set(att.id, att);
    db.persistToDisk();
    return att;
  }

  // Attendance Corrections
  public async getAttendanceCorrections(tenantId: string): Promise<HrAttendanceCorrection[]> {
    return Array.from(db.hrAttendanceCorrections.values()).filter(ac => ac.tenantId === tenantId);
  }
  public async saveAttendanceCorrection(corr: HrAttendanceCorrection): Promise<HrAttendanceCorrection> {
    db.hrAttendanceCorrections.set(corr.id, corr);
    db.persistToDisk();
    return corr;
  }

  // Leave Types & Policies & Balances & Applications
  public async getLeaveTypes(tenantId: string): Promise<HrLeaveType[]> {
    return Array.from(db.hrLeaveTypes.values()).filter(lt => lt.tenantId === tenantId);
  }
  public async saveLeaveType(lt: HrLeaveType): Promise<HrLeaveType> {
    db.hrLeaveTypes.set(lt.id, lt);
    db.persistToDisk();
    return lt;
  }

  public async getLeaveBalances(tenantId: string, employeeId?: string): Promise<HrLeaveBalance[]> {
    return Array.from(db.hrLeaveBalances.values()).filter(lb => {
      if (lb.tenantId !== tenantId) return false;
      if (employeeId && lb.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveLeaveBalance(lb: HrLeaveBalance): Promise<HrLeaveBalance> {
    db.hrLeaveBalances.set(lb.id, lb);
    db.persistToDisk();
    return lb;
  }

  public async getLeaveApplications(tenantId: string, employeeId?: string): Promise<HrLeaveApplication[]> {
    return Array.from(db.hrLeaveApplications.values()).filter(la => {
      if (la.tenantId !== tenantId) return false;
      if (employeeId && la.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveLeaveApplication(la: HrLeaveApplication): Promise<HrLeaveApplication> {
    db.hrLeaveApplications.set(la.id, la);
    db.persistToDisk();
    return la;
  }

  // Holidays
  public async getHolidays(tenantId: string): Promise<HrHoliday[]> {
    return Array.from(db.hrHolidays.values()).filter(h => h.tenantId === tenantId);
  }
  public async saveHoliday(h: HrHoliday): Promise<HrHoliday> {
    db.hrHolidays.set(h.id, h);
    db.persistToDisk();
    return h;
  }

  // Overtime
  public async getOvertime(tenantId: string): Promise<HrOvertime[]> {
    return Array.from(db.hrOvertimes.values()).filter(o => o.tenantId === tenantId);
  }
  public async saveOvertime(ot: HrOvertime): Promise<HrOvertime> {
    db.hrOvertimes.set(ot.id, ot);
    db.persistToDisk();
    return ot;
  }

  // Salary Structures & Components
  public async getSalaryStructures(tenantId: string, employeeId?: string): Promise<HrSalaryStructure[]> {
    return Array.from(db.hrSalaryStructures.values()).filter(ss => {
      if (ss.tenantId !== tenantId) return false;
      if (employeeId && ss.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveSalaryStructure(ss: HrSalaryStructure): Promise<HrSalaryStructure> {
    db.hrSalaryStructures.set(ss.id, ss);
    db.persistToDisk();
    return ss;
  }

  public async getSalaryComponents(tenantId: string, salaryStructureId?: string): Promise<HrSalaryComponent[]> {
    return Array.from(db.hrSalaryComponents.values()).filter(sc => {
      if (sc.tenantId !== tenantId) return false;
      if (salaryStructureId && sc.salaryStructureId !== salaryStructureId) return false;
      return true;
    });
  }
  public async saveSalaryComponent(sc: HrSalaryComponent): Promise<HrSalaryComponent> {
    db.hrSalaryComponents.set(sc.id, sc);
    db.persistToDisk();
    return sc;
  }

  // Payroll Years & Periods
  public async getPayrollPeriods(tenantId: string): Promise<HrPayrollPeriod[]> {
    return Array.from(db.hrPayrollPeriods.values()).filter(p => p.tenantId === tenantId);
  }
  public async savePayrollPeriod(p: HrPayrollPeriod): Promise<HrPayrollPeriod> {
    db.hrPayrollPeriods.set(p.id, p);
    db.persistToDisk();
    return p;
  }

  // Payroll Runs & Items
  public async getPayrollRuns(tenantId: string): Promise<HrPayrollRun[]> {
    return Array.from(db.hrPayrollRuns.values()).filter(r => r.tenantId === tenantId);
  }
  public async getPayrollRunById(tenantId: string, id: string): Promise<HrPayrollRun | undefined> {
    const run = db.hrPayrollRuns.get(id);
    return run && run.tenantId === tenantId ? run : undefined;
  }
  public async savePayrollRun(run: HrPayrollRun): Promise<HrPayrollRun> {
    db.hrPayrollRuns.set(run.id, run);
    db.persistToDisk();
    return run;
  }

  public async getPayrollItems(tenantId: string, payrollRunId?: string): Promise<HrPayrollItem[]> {
    return Array.from(db.hrPayrollItems.values()).filter(pi => {
      if (pi.tenantId !== tenantId) return false;
      if (payrollRunId && pi.payrollRunId !== payrollRunId) return false;
      return true;
    });
  }
  public async savePayrollItem(pi: HrPayrollItem): Promise<HrPayrollItem> {
    db.hrPayrollItems.set(pi.id, pi);
    db.persistToDisk();
    return pi;
  }

  // Payslips
  public async getPayslips(tenantId: string, employeeId?: string): Promise<HrPayslip[]> {
    return Array.from(db.hrPayslips.values()).filter(ps => {
      if (ps.tenantId !== tenantId) return false;
      if (employeeId && ps.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async savePayslip(ps: HrPayslip): Promise<HrPayslip> {
    db.hrPayslips.set(ps.id, ps);
    db.persistToDisk();
    return ps;
  }

  // Salary Advances & Loans
  public async getSalaryAdvances(tenantId: string, employeeId?: string): Promise<HrSalaryAdvance[]> {
    return Array.from(db.hrSalaryAdvances.values()).filter(sa => {
      if (sa.tenantId !== tenantId) return false;
      if (employeeId && sa.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveSalaryAdvance(sa: HrSalaryAdvance): Promise<HrSalaryAdvance> {
    db.hrSalaryAdvances.set(sa.id, sa);
    db.persistToDisk();
    return sa;
  }

  public async getEmployeeLoans(tenantId: string, employeeId?: string): Promise<HrEmployeeLoan[]> {
    return Array.from(db.hrEmployeeLoans.values()).filter(el => {
      if (el.tenantId !== tenantId) return false;
      if (employeeId && el.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveEmployeeLoan(el: HrEmployeeLoan): Promise<HrEmployeeLoan> {
    db.hrEmployeeLoans.set(el.id, el);
    db.persistToDisk();
    return el;
  }

  // Reimbursements
  public async getReimbursements(tenantId: string, employeeId?: string): Promise<HrReimbursement[]> {
    return Array.from(db.hrReimbursements.values()).filter(r => {
      if (r.tenantId !== tenantId) return false;
      if (employeeId && r.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveReimbursement(r: HrReimbursement): Promise<HrReimbursement> {
    db.hrReimbursements.set(r.id, r);
    db.persistToDisk();
    return r;
  }

  // Employee Documents
  public async getEmployeeDocuments(tenantId: string, employeeId?: string): Promise<HrEmployeeDocument[]> {
    return Array.from(db.hrEmployeeDocuments.values()).filter(ed => {
      if (ed.tenantId !== tenantId) return false;
      if (employeeId && ed.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveEmployeeDocument(doc: HrEmployeeDocument): Promise<HrEmployeeDocument> {
    db.hrEmployeeDocuments.set(doc.id, doc);
    db.persistToDisk();
    return doc;
  }

  // Performance
  public async getPerformanceCycles(tenantId: string): Promise<HrPerformanceCycle[]> {
    return Array.from(db.hrPerformanceCycles.values()).filter(pc => pc.tenantId === tenantId);
  }
  public async savePerformanceCycle(pc: HrPerformanceCycle): Promise<HrPerformanceCycle> {
    db.hrPerformanceCycles.set(pc.id, pc);
    db.persistToDisk();
    return pc;
  }

  public async getEmployeeGoals(tenantId: string, employeeId?: string): Promise<HrEmployeeGoal[]> {
    return Array.from(db.hrEmployeeGoals.values()).filter(g => {
      if (g.tenantId !== tenantId) return false;
      if (employeeId && g.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveEmployeeGoal(g: HrEmployeeGoal): Promise<HrEmployeeGoal> {
    db.hrEmployeeGoals.set(g.id, g);
    db.persistToDisk();
    return g;
  }

  public async getEmployeeReviews(tenantId: string, employeeId?: string): Promise<HrEmployeeReview[]> {
    return Array.from(db.hrEmployeeReviews.values()).filter(r => {
      if (r.tenantId !== tenantId) return false;
      if (employeeId && r.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveEmployeeReview(r: HrEmployeeReview): Promise<HrEmployeeReview> {
    db.hrEmployeeReviews.set(r.id, r);
    db.persistToDisk();
    return r;
  }

  // Recruitment
  public async getJobRequisitions(tenantId: string): Promise<HrJobRequisition[]> {
    return Array.from(db.hrJobRequisitions.values()).filter(jr => jr.tenantId === tenantId);
  }
  public async saveJobRequisition(jr: HrJobRequisition): Promise<HrJobRequisition> {
    db.hrJobRequisitions.set(jr.id, jr);
    db.persistToDisk();
    return jr;
  }

  public async getCandidates(tenantId: string): Promise<HrCandidate[]> {
    return Array.from(db.hrCandidates.values()).filter(c => c.tenantId === tenantId);
  }
  public async saveCandidate(c: HrCandidate): Promise<HrCandidate> {
    db.hrCandidates.set(c.id, c);
    db.persistToDisk();
    return c;
  }

  public async getApplications(tenantId: string): Promise<HrApplication[]> {
    return Array.from(db.hrApplications.values()).filter(a => a.tenantId === tenantId);
  }
  public async saveApplication(app: HrApplication): Promise<HrApplication> {
    db.hrApplications.set(app.id, app);
    db.persistToDisk();
    return app;
  }

  public async getInterviews(tenantId: string): Promise<HrInterview[]> {
    return Array.from(db.hrInterviews.values()).filter(i => i.tenantId === tenantId);
  }
  public async saveInterview(i: HrInterview): Promise<HrInterview> {
    db.hrInterviews.set(i.id, i);
    db.persistToDisk();
    return i;
  }

  public async getOffers(tenantId: string): Promise<HrOffer[]> {
    return Array.from(db.hrOffers.values()).filter(o => o.tenantId === tenantId);
  }
  public async saveOffer(offer: HrOffer): Promise<HrOffer> {
    db.hrOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }

  // Onboarding, Offboarding & Final Settlement
  public async getOnboardings(tenantId: string, employeeId?: string): Promise<HrOnboarding[]> {
    return Array.from(db.hrOnboardings.values()).filter(o => {
      if (o.tenantId !== tenantId) return false;
      if (employeeId && o.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveOnboarding(o: HrOnboarding): Promise<HrOnboarding> {
    db.hrOnboardings.set(o.id, o);
    db.persistToDisk();
    return o;
  }

  public async getOffboardings(tenantId: string, employeeId?: string): Promise<HrOffboarding[]> {
    return Array.from(db.hrOffboardings.values()).filter(o => {
      if (o.tenantId !== tenantId) return false;
      if (employeeId && o.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveOffboarding(o: HrOffboarding): Promise<HrOffboarding> {
    db.hrOffboardings.set(o.id, o);
    db.persistToDisk();
    return o;
  }

  public async getFinalSettlements(tenantId: string, employeeId?: string): Promise<HrFinalSettlement[]> {
    return Array.from(db.hrFinalSettlements.values()).filter(fs => {
      if (fs.tenantId !== tenantId) return false;
      if (employeeId && fs.employeeId !== employeeId) return false;
      return true;
    });
  }
  public async saveFinalSettlement(fs: HrFinalSettlement): Promise<HrFinalSettlement> {
    db.hrFinalSettlements.set(fs.id, fs);
    db.persistToDisk();
    return fs;
  }
}

export const hrRepository = new HrRepository();
