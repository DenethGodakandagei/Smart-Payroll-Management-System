"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../lib/api";
import dayjs from "dayjs";
import Sidebar from "@/app/components/Sidebar";
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  PaperAirplaneIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function PayslipPage() {
  const params = useParams();
  const router = useRouter();
  const [payroll, setPayroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Email States
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    
    api.get(`/payroll/${params.id}`)
      .then(res => {
        setPayroll(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to retrieve payslip details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params?.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!params?.id) return;
    setEmailSending(true);
    setEmailSuccess(null);
    setEmailError(null);
    try {
      await api.post(`/payroll/${params.id}/email`);
      setEmailSuccess("Payslip email generated and dispatched successfully!");
      setTimeout(() => setEmailSuccess(null), 5000);
    } catch (err: any) {
      console.error(err);
      setEmailError(err.response?.data?.message || "Failed to dispatch email. Check SMTP settings.");
      setTimeout(() => setEmailError(null), 5000);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800 print:bg-white print:text-black">
      {/* Hide sidebar during printing */}
      <div className="print:hidden flex shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-10 overflow-y-auto print:p-0 print:m-0">
        
        {/* Back Button and Actions (Hidden during print) */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/payroll")}
              className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-555 hover:text-zinc-900 hover:bg-zinc-50 transition duration-150 shadow-sm"
            >
              <ArrowLeftIcon className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Employee Payslip</h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Verify deductions, earnings, and net payslips.</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSendEmail}
              disabled={emailSending}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-sm font-bold rounded-full shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {emailSending ? (
                <div className="w-4 h-4 border-2 border-zinc-800/30 border-t-zinc-800 rounded-full animate-spin" />
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4 stroke-[2.5]" />
                  Email Payslip
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-bold rounded-full shadow-sm transition-all active:scale-[0.98]"
            >
              <PrinterIcon className="w-4 h-4 stroke-[2.5]" />
              Print Payslip
            </button>
          </div>
        </div>

        {/* Email Alerts Banners */}
        {emailSuccess && (
          <div className="max-w-2xl mx-auto flex gap-2.5 p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium print:hidden">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            <span>{emailSuccess}</span>
          </div>
        )}
        {emailError && (
          <div className="max-w-2xl mx-auto flex gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium print:hidden">
            <InformationCircleIcon className="w-5 h-5 shrink-0" />
            <span>{emailError}</span>
          </div>
        )}

        {/* Detailed Payslip Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 print:hidden">
            <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
            <span className="text-zinc-450 text-sm font-semibold">Retrieving payslip...</span>
          </div>
        ) : error || !payroll ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm print:hidden">
            <DocumentTextIcon className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-zinc-800">Payslip Not Found</h2>
            <p className="text-zinc-550 text-xs mt-1 mb-4 font-semibold">{error || "Could not find requested payroll log."}</p>
            <button onClick={() => router.push("/payroll")} className="px-4 py-2 bg-zinc-950 text-white rounded-full text-sm font-bold">
              Back to Payroll
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white border border-zinc-200 shadow-sm rounded-3xl p-8 print:border-none print:shadow-none print:p-0 print:mx-0">
            
            {/* Header / Brand details */}
            <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-[#2bd97b] flex items-center justify-center font-bold text-zinc-950 text-xs">
                    S
                  </div>
                  <span className="text-base font-bold text-zinc-950 tracking-tight">SmartPayroll Ltd</span>
                </div>
                <p className="text-zinc-400 text-xs font-semibold">128 Enterprise Drive, Colombo 03</p>
                <p className="text-zinc-400 text-xs font-semibold mt-0.5">info@smartpayroll.com</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Official Pay Slip</span>
                <span className="text-lg font-extrabold text-zinc-900">{dayjs(payroll.monthYear).format("MMMM YYYY")}</span>
              </div>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 border border-zinc-200/80 rounded-2xl p-4 mb-6">
              <div>
                <span className="text-zinc-400 text-xxs font-bold uppercase tracking-wider block">Employee Details</span>
                <h4 className="text-sm font-extrabold text-zinc-900 mt-1">{payroll.employee?.fullName}</h4>
                <p className="text-xs text-zinc-500 font-semibold mt-0.5">{payroll.employee?.designation || "Staff Member"}</p>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-xxs font-bold uppercase tracking-wider block">Reference Numbers</span>
                <p className="text-xs text-zinc-800 font-bold mt-1">ID: <span className="font-mono text-zinc-500">#{payroll.employeeId}</span></p>
                <p className="text-xs text-zinc-800 font-bold mt-0.5">NIC: <span className="font-mono text-zinc-500">{payroll.employee?.nic || "N/A"}</span></p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Earnings Table */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-3 pb-1.5 border-b border-zinc-200">Earnings</h3>
                <div className="space-y-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Basic Salary</span>
                    <span className="font-mono text-zinc-900 font-bold">LKR {Number(payroll.basicPay).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Overtime Pay</span>
                    <span className="font-mono text-zinc-900 font-bold">LKR {Number(payroll.otPay).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-zinc-200 font-bold text-zinc-900">
                    <span>Gross Earnings</span>
                    <span className="font-mono">LKR {Number(payroll.grossSalary).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-3 pb-1.5 border-b border-zinc-200">Deductions</h3>
                <div className="space-y-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-zinc-550">EPF Contribution (8%)</span>
                    <span className="font-mono text-red-500 font-bold">- LKR {Number(payroll.epf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">ETF Contribution (3%)</span>
                    <span className="font-mono text-red-500 font-bold">- LKR {Number(payroll.etf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Income Tax (10%)</span>
                    <span className="font-mono text-red-500 font-bold">- LKR {Number(payroll.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-zinc-200 font-bold text-red-650">
                    <span>Total Deductions</span>
                    <span className="font-mono">- LKR {Number(payroll.epf + payroll.etf + payroll.tax).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="flex justify-between items-center bg-zinc-950 text-white rounded-2xl p-5 mb-6">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Net Take-Home Salary</h4>
                <p className="text-xxs text-zinc-500 font-medium mt-1">EPF, ETF, and taxes already deducted.</p>
              </div>
              <span className="text-2xl font-extrabold text-[#2bd97b] font-mono tracking-tight">
                LKR {Number(payroll.netSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Verification Stamp / Seal */}
            <div className="flex items-center gap-2 text-zinc-450 border-t border-zinc-200 pt-6">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-500 stroke-[2]" />
              <span className="text-xs font-semibold">Digitally verified and approved by SmartPayroll Ltd.</span>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
