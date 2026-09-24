import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  DollarSign,
  FolderLock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Employee, EmploymentType, SalaryType, WorkforceRole } from '../types';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  onToast: (msg: string) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onToast
}) => {
  const [activeStep, setActiveStep] = useState<'personal' | 'employment' | 'salary' | 'documents'>('personal');

  // Personal Information
  const [empId, setEmpId] = useState(`EMP-${Math.floor(100 + Math.random() * 900)}`);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1992-05-15');
  const [phone, setPhone] = useState('+91 98470 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9');

  // Employment Information
  const [joiningDate, setJoiningDate] = useState('2026-03-24');
  const [department, setDepartment] = useState('Quarry Operations');
  const [designation, setDesignation] = useState('Quarry Pithead Supervisor');
  const [role, setRole] = useState<WorkforceRole>('SUPERVISOR');
  const [branch, setBranch] = useState('Calicut Laterite Concession #1');
  const [workLocation, setWorkLocation] = useState('Pithead Concession Sector A');
  const [reportingManager, setReportingManager] = useState('Rajesh Nair');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full Time');
  const [status, setStatus] = useState<'Active' | 'Probation'>('Active');

  // Salary Information
  const [salaryType, setSalaryType] = useState<SalaryType>('Monthly Salary');
  const [salaryRate, setSalaryRate] = useState('30000');
  const [overtimeRate, setOvertimeRate] = useState('180');
  const [battaEligible, setBattaEligible] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'Bank Transfer' | 'Cash' | 'Cheque'>('Bank Transfer');
  const [bankName, setBankName] = useState('Federal Bank');
  const [accountNo, setAccountNo] = useState('14200100');
  const [ifsc, setIfsc] = useState('FDRL0001420');

  // Documents
  const [hasIdProof, setHasIdProof] = useState(true);
  const [hasAddressProof, setHasAddressProof] = useState(true);
  const [hasEmploymentAgreement, setHasEmploymentAgreement] = useState(true);
  const [hasBankProof, setHasBankProof] = useState(true);

  if (!isOpen) return null;

  const handleSave = (addAnother: boolean = false) => {
    if (!fullName.trim()) {
      onToast('Please enter employee full name');
      return;
    }

    const newEmp: Partial<Employee> = {
      id: empId,
      name: fullName,
      department,
      designation,
      role,
      branch,
      joiningDate,
      salaryType,
      salaryRate: Number(salaryRate) || 0,
      status,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@malabarmining.com`,
      gender,
      dob,
      address,
      emergencyContact: {
        name: emergencyName || 'Primary Contact',
        relation: emergencyRelation,
        phone: emergencyPhone
      },
      reportingManager,
      employmentType,
      overtimeRate: Number(overtimeRate) || 0,
      battaEligible,
      paymentMode,
      bankDetails: {
        bankName,
        accountNo,
        ifsc,
        branch
      },
      attendanceThisMonth: 0,
      leaveBalance: 18,
      advanceBalance: 0,
      pendingSalary: 0,
      documentsCount: 4
    };

    onSave(newEmp);
    onToast(`Employee ${fullName} created successfully (${empId})`);

    if (addAnother) {
      setEmpId(`EMP-${Math.floor(100 + Math.random() * 900)}`);
      setFullName('');
      setActiveStep('personal');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Employee Profile</h3>
              <p className="text-xs text-slate-400">
                Register employee in master HR directory &amp; configure salary setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 pb-3 bg-slate-950/50">
          <button
            onClick={() => setActiveStep('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStep === 'personal'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal</span>
          </button>
          <button
            onClick={() => setActiveStep('employment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStep === 'employment'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>2. Employment</span>
          </button>
          <button
            onClick={() => setActiveStep('salary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStep === 'salary'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Salary Setup</span>
          </button>
          <button
            onClick={() => setActiveStep('documents')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeStep === 'documents'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>4. KYC Documents</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          {/* STEP 1: PERSONAL */}
          {activeStep === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sajeer Ahamed"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Contact Phone *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@malabarmining.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Permanent Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House Name / Street, Post Office, City, District, PIN..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contact Person Name"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-sans text-xs"
                  />
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="Relationship (e.g. Spouse, Father)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-sans text-xs"
                  />
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Emergency Phone"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EMPLOYMENT */}
          {activeStep === 'employment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Quarry Operations">Quarry Operations</option>
                    <option value="Crusher Plant">Crusher Plant</option>
                    <option value="Vehicle & Fleet Logistics">Vehicle & Fleet Logistics</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                    <option value="Dispatch & Weighbridge">Dispatch & Weighbridge</option>
                    <option value="Human Resources (HR)">Human Resources (HR)</option>
                    <option value="Administration">Administration</option>
                    <option value="Sales & Commercial">Sales & Commercial</option>
                    <option value="Contract & Civil Jobs">Contract & Civil Jobs</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Heavy Excavator Operator"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Role Classification</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="DRIVER">DRIVER</option>
                    <option value="ACCOUNTANT">ACCOUNTANT</option>
                    <option value="HR">HR</option>
                    <option value="STAFF">STAFF</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Branch / Concession</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Reporting Manager</label>
                  <input
                    type="text"
                    value={reportingManager}
                    onChange={(e) => setReportingManager(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Weekly Wage">Weekly Wage</option>
                    <option value="Contract">Contract</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SALARY SETUP */}
          {activeStep === 'salary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Salary Type</label>
                  <select
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Monthly Salary">Monthly Salary</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Weekly Wage">Weekly Wage</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">
                    {salaryType === 'Daily Wage' ? 'Daily Rate (₹)' : 'Monthly Base Rate (₹)'}
                  </label>
                  <input
                    type="number"
                    value={salaryRate}
                    onChange={(e) => setSalaryRate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Overtime Rate (₹ / Hour)</label>
                  <input
                    type="number"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-bold block mb-1.5">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cash">Cash Desk</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="battaCheck"
                  checked={battaEligible}
                  onChange={(e) => setBattaEligible(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="battaCheck" className="text-xs text-slate-300 font-sans cursor-pointer">
                  <strong>Batta &amp; Travel Allowance Eligible</strong> (Enables daily field and haulage trip batta booking)
                </label>
              </div>

              {paymentMode === 'Bank Transfer' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Bank Account Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank Name"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-sans text-xs"
                    />
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="Account Number"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      placeholder="IFSC Code"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {activeStep === 'documents' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-sans">
                Attach or verify preliminary KYC compliance documents. Scanned files can be renewed anytime in the Staff Document vault.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">ID Proof (Aadhaar / Voter ID)</span>
                      <span className="text-[10px] text-slate-500">National identity record</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasIdProof}
                    onChange={(e) => setHasIdProof(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Address Proof Document</span>
                      <span className="text-[10px] text-slate-500">Electricity bill or ration card</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasAddressProof}
                    onChange={(e) => setHasAddressProof(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Employment Agreement / Letter</span>
                      <span className="text-[10px] text-slate-500">Signed appointment document</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasEmploymentAgreement}
                    onChange={(e) => setHasEmploymentAgreement(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Bank Passbook / Cheque Copy</span>
                      <span className="text-[10px] text-slate-500">Account verification slip</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasBankProof}
                    onChange={(e) => setHasBankProof(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-sans">
                <strong>Studio Verification:</strong> Uploading physical scans will be handled by the production cloud storage provider upon backend onboarding.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {activeStep !== 'personal' && (
              <button
                onClick={() => {
                  if (activeStep === 'documents') setActiveStep('salary');
                  else if (activeStep === 'salary') setActiveStep('employment');
                  else if (activeStep === 'employment') setActiveStep('personal');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Previous Step
              </button>
            )}
            {activeStep !== 'documents' && (
              <button
                onClick={() => {
                  if (activeStep === 'personal') setActiveStep('employment');
                  else if (activeStep === 'employment') setActiveStep('salary');
                  else if (activeStep === 'salary') setActiveStep('documents');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold cursor-pointer"
              >
                Next Step &rarr;
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold cursor-pointer border border-amber-500/30"
            >
              Save &amp; Add Another
            </button>
            <button
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Save Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
