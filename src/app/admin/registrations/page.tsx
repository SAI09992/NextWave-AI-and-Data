'use client';

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  Download,
  RefreshCw,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  Eye,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creditFilter, setCreditFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Deletion modal state
  const [deletingRecord, setDeletingRecord] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Inspect modal state
  const [inspectingRecord, setInspectingRecord] = useState<any | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/registrations-list');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleExportCsv = () => {
    window.location.href = '/api/admin/export?type=registrations';
    toast.success('Downloading registration CSV export...');
  };

  const handleDelete = async () => {
    if (!deletingRecord) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations-list?id=${deletingRecord.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Registration deleted successfully.');
        setRegistrations((prev) => prev.filter((r) => r.id !== deletingRecord.id));
        setDeletingRecord(null);
      } else {
        toast.error(data.error || 'Failed to delete registration.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to delete.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = registrations.filter((r) => {
    if (creditFilter !== 'ALL' && r.creditType !== creditFilter) return false;
    if (paymentFilter !== 'ALL') {
      const status = r.paymentStatus || 'unpaid';
      if (status !== paymentFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.registrationId.toLowerCase().includes(q) ||
        r.registerNumber.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-sm max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-yellow-400" />
            <span>PARTICIPANT ROSTER & REGISTRATIONS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            TOTAL ENROLLED: {registrations.length} PARTICIPANTS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold font-sans text-sm transition-colors shadow-lg shadow-yellow-500/20"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV</span>
          </button>
          <button
            onClick={fetchRegistrations}
            className="p-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors shadow-lg"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name, Reg ID, Roll No..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        {/* Credit Filter */}
        <select
          value={creditFilter}
          onChange={(e) => setCreditFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none"
        >
          <option value="ALL">All Tracks</option>
          <option value="PE_CSE">PE — CSE</option>
          <option value="PE_IT">PE — IT</option>
          <option value="UE">UE — Other</option>
        </select>

        {/* Payment Status Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Under Verification</option>
          <option value="rejected">Rejected</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-gray-950 border-b border-gray-800 text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Reg ID</th>
                <th className="p-4">Participant Name</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Dept / Year</th>
                <th className="p-4">Track</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Registered At</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-bold text-yellow-400 font-mono">{r.registrationId}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{r.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{r.email}</div>
                    </td>
                    <td className="p-4 font-mono">{r.registerNumber}</td>
                    <td className="p-4">
                      <div>{r.department}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{r.year} (Sec {r.section})</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-orange-400">
                        {r.creditType === 'PE_CSE' ? 'PE — CSE' : r.creditType === 'PE_IT' ? 'PE — IT' : 'UE — OTHER'}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={r.paymentStatus || 'unpaid'} />
                    </td>
                    <td className="p-4 text-gray-500 font-mono">{formatDate(r.createdAt)}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => setInspectingRecord(r)}
                        className="p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors shadow-sm"
                        title="Inspect Application & Payment"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingRecord(r)}
                        className="p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors shadow-sm"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.25)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
                <AlertTriangle className="w-5 h-5" />
                <span>CONFIRM PERMANENT DELETION</span>
              </div>
              <button
                onClick={() => setDeletingRecord(null)}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-gray-400">
              <p>
                Are you sure you want to permanently delete registration{' '}
                <strong className="text-yellow-400 font-mono">{deletingRecord.registrationId}</strong> for{' '}
                <strong className="text-white">{deletingRecord.name}</strong> ({deletingRecord.registerNumber})?
              </p>
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono">
                ⚠️ This will immediately free up 1 seat in the live capacity monitor and permanently purge all associated payment records and attendance data.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteLoading ? 'DELETING...' : 'YES, DELETE REGISTRATION'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Record Modal */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-[0_0_40px_rgba(255,215,0,0.15)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Eye className="w-5 h-5 text-yellow-400" />
                <span>PARTICIPANT DOSSIER: <span className="text-yellow-400 font-mono">{inspectingRecord.registrationId}</span></span>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Profile Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-yellow-400 uppercase border-b border-gray-800 pb-2 tracking-wide font-mono text-xs">
                  Academic Profile
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name</span>
                    <span className="font-bold text-white">{inspectingRecord.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-bold text-white font-mono text-xs">{inspectingRecord.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-bold text-white font-mono">{inspectingRecord.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">College</span>
                    <span className="font-bold text-white text-right max-w-[200px] truncate" title={inspectingRecord.college}>{inspectingRecord.college}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Roll Number</span>
                    <span className="font-bold text-white font-mono">{inspectingRecord.registerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dept / Year / Sec</span>
                    <span className="font-bold text-white">
                      {inspectingRecord.department} / {inspectingRecord.year} / {inspectingRecord.section}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Track Registered</span>
                    <span className="font-bold text-orange-400">
                      {inspectingRecord.creditType === 'PE_CSE' ? 'PE — CSE' : inspectingRecord.creditType === 'PE_IT' ? 'PE — IT' : 'UE — OTHER'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-red-400 uppercase border-b border-gray-800 pb-2 tracking-wide font-mono text-xs pt-2">
                  Residence Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Residence Type</span>
                    <span className="font-bold text-white">
                      {inspectingRecord.residenceType === 'DAY_SCHOLAR' ? 'DAY SCHOLAR' : 'HOSTELLER'}
                    </span>
                  </div>
                  {inspectingRecord.residenceType === 'HOSTEL' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hostel Name</span>
                        <span className="font-bold text-white">{inspectingRecord.hostelName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Room Number</span>
                        <span className="font-bold text-white font-mono">{inspectingRecord.roomNumber || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-orange-400 uppercase border-b border-gray-800 pb-2 tracking-wide font-mono text-xs">
                  Payment Profile
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <StatusBadge status={inspectingRecord.paymentStatus || 'unpaid'} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-white font-mono">₹{inspectingRecord.amount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">UTR Number</span>
                    <span className="font-bold text-yellow-400 font-mono bg-gray-950 px-2 py-1 rounded border border-gray-800 text-xs">
                      {inspectingRecord.utr || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-gray-500 block mb-2">Payment Screenshot</span>
                  {inspectingRecord.screenshotUrl ? (
                    <a
                      href={inspectingRecord.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500 transition-colors bg-gray-950 p-2"
                    >
                      <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden rounded">
                        {inspectingRecord.screenshotUrl.length > 32000 ? (
                          <div className="text-center p-4">
                            <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-gray-500 font-mono">Base64 Image Data.<br/>Cannot preview reliably.</p>
                          </div>
                        ) : (
                          <img
                            src={inspectingRecord.screenshotUrl}
                            alt="Payment Proof"
                            className="w-full h-full object-contain"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white font-bold bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 shadow-lg text-sm">
                            <Eye className="w-4 h-4" /> View Full Image
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="p-6 rounded-xl bg-gray-950 border border-gray-800 border-dashed text-center text-gray-600 font-mono text-xs">
                      No screenshot provided.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
