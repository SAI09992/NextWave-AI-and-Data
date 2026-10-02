import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { registrations, payments, attendance } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eq } from 'drizzle-orm';

import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'registrations';
    const requestedFormat = (searchParams.get('format') || '').toLowerCase();

    if (type === 'registrations') {
      const records = await db
        .select({
          registrationId: registrations.registrationId,
          name: registrations.name,
          email: registrations.email,
          phone: registrations.phone,
          registerNumber: registrations.registerNumber,
          department: registrations.department,
          year: registrations.year,
          section: registrations.section,
          college: registrations.college,
          creditType: registrations.creditType,
          residenceType: registrations.residenceType,
          hostelName: registrations.hostelName,
          roomNumber: registrations.roomNumber,
          status: registrations.status,
          paymentStatus: payments.status,
          utr: payments.utr,
          amount: payments.amount,
          screenshotUrl: payments.screenshotUrl,
          createdAt: registrations.createdAt,
        })
        .from(registrations)
        .leftJoin(payments, eq(registrations.id, payments.registrationId));

      const excelData = (records as any[]).map((r: any) => {
        let screenshot = r.screenshotUrl || '';
        // Excel cells cannot exceed 32,767 characters. 
        // If an image was saved as a Base64 string instead of a Vercel Blob URL, it will crash the export.
        if (screenshot.length > 32000) {
          screenshot = '[Base64 Image Data - Too Large for Excel Export]';
        }

        const isHostel = r.residenceType === 'HOSTEL';

        return {
          'Registration ID': r.registrationId || '',
          'Name': r.name || '',
          'Email': r.email || '',
          'Phone': r.phone || '',
          'Register Number': r.registerNumber || '',
          'Department': r.department || '',
          'Year': r.year || '',
          'Section': r.section || '',
          'College': r.college || '',
          'Credit Type': r.creditType === 'NON_CGPA'
            ? (() => {
                const dept = (r.department || '').toUpperCase().trim();
                const isCseIt = dept === 'CSE' || dept === 'IT' || dept === 'COMPUTER SCIENCE AND ENGINEERING' || dept === 'INFORMATION TECHNOLOGY';
                return isCseIt ? 'NON CGPA — 1 Group 3 Certificate + Program Elective' : 'NON CGPA — 1 Group 3 Certificate + University Elective';
              })()
            : (r.creditType || ''),
          'Residence Type': isHostel ? 'Hosteller' : 'Day Scholar',
          'Hostel Name': isHostel ? (r.hostelName || 'N/A') : 'N/A',
          'Room Number': isHostel ? (r.roomNumber || 'N/A') : 'N/A',
          'Registration Status': (r.status || 'registered').toUpperCase(),
          'Payment Status': (r.paymentStatus || 'unpaid').toUpperCase(),
          'UTR': r.utr || '',
          'Amount (INR)': r.amount || 0,
          'Registered At': r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
          'Screenshot Blob Link': screenshot
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

      // If XLSX requested explicitly, return Excel workbook
      if (requestedFormat === 'xlsx') {
        const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return new NextResponse(buf as any, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="nextgen-soc-registrations-${Date.now()}.xlsx"`,
          },
        });
      }

      // Default to standard CSV format (with UTF-8 BOM for Microsoft Excel compatibility)
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      const bom = '\uFEFF';

      return new NextResponse((bom + csvContent) as any, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="nextgen-soc-registrations-${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'absentees') {
      const dayParam = searchParams.get('day') || '1'; // '1', '2', or 'all'

      // Fetch all registered cadets
      const allCadets = await db
        .select({
          id: registrations.id,
          registrationId: registrations.registrationId,
          name: registrations.name,
          email: registrations.email,
          registerNumber: registrations.registerNumber,
          department: registrations.department,
          year: registrations.year,
          section: registrations.section,
          paymentStatus: payments.status,
        })
        .from(registrations)
        .leftJoin(payments, eq(registrations.id, payments.registrationId));

      // Helper to guarantee 11-digit KLU registration number
      const getKluRegNo = (regNo?: string | null, email?: string | null): string => {
        const prefix = (email || '').split('@')[0].trim();
        if (prefix.startsWith('99') && /^\d+$/.test(prefix)) {
          return prefix;
        }
        return regNo || '';
      };

      // Fetch present attendance records
      const presentRecords = await db
        .select()
        .from(attendance)
        .where(eq(attendance.status, 'present'));

      const presentDay1Set = new Set<string>();
      const presentDay2Set = new Set<string>();

      presentRecords.forEach((att: any) => {
        if (att.day === 1 && att.registrationId) presentDay1Set.add(att.registrationId);
        if (att.day === 2 && att.registrationId) presentDay2Set.add(att.registrationId);
      });

      let absenteeRows: Array<{ 'Student Name': string; 'Registration Number': string; 'Absent Days'?: string }> = [];

      if (dayParam === '1') {
        absenteeRows = (allCadets as any[])
          .filter((c: any) => !presentDay1Set.has(c.id || ''))
          .map((c: any) => ({
            'Student Name': c.name || '',
            'Registration Number': getKluRegNo(c.registerNumber, c.email),
          }));
      } else if (dayParam === '2') {
        absenteeRows = (allCadets as any[])
          .filter((c: any) => !presentDay2Set.has(c.id || ''))
          .map((c: any) => ({
            'Student Name': c.name || '',
            'Registration Number': getKluRegNo(c.registerNumber, c.email),
          }));
      } else {
        absenteeRows = (allCadets as any[])
          .filter((c: any) => !presentDay1Set.has(c.id || '') || !presentDay2Set.has(c.id || ''))
          .map((c: any) => {
            const absentOn: string[] = [];
            if (!presentDay1Set.has(c.id || '')) absentOn.push('Day 1');
            if (!presentDay2Set.has(c.id || '')) absentOn.push('Day 2');
            return {
              'Student Name': c.name || '',
              'Registration Number': getKluRegNo(c.registerNumber, c.email),
              'Absent Days': absentOn.join(', '),
            };
          });
      }

      const worksheet = XLSX.utils.json_to_sheet(absenteeRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Absentees_Day_${dayParam}`);

      const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buf as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="nextgen-soc-absentees-day${dayParam}-${Date.now()}.xlsx"`,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid export type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
