import { LOCATIONS } from '@/lib/static-data';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const area = searchParams.get('area');
  const capacity = searchParams.get('capacity');
  const hours = searchParams.get('hours');
  const fromdate = searchParams.get('fromdate');
  const todate = searchParams.get('todate');
  let filtered = LOCATIONS;

  // Filter by area (only if provided & not empty)
  if (area && area.trim() !== '') {
    filtered = filtered.filter(
      (location) => location.area?.toLowerCase() === area.toLowerCase()
    );
  }

  // Filter by capacity (only if provided & valid number)
  if (capacity && !isNaN(Number(capacity))) {
    filtered = filtered.filter(
      (location) => location.capacity === Number(capacity)
    );
  }

  // Filter by hours_til_maintenance (only if provided & valid number)
  if (hours && !isNaN(Number(hours))) {
    filtered = filtered.filter(
      (location) => location.hours_til_maintenance === Number(hours)
    );
  }
  if (fromdate) {
    const from = new Date(fromdate);
    const to = todate ? new Date(todate) : new Date(); // لو مفيش todate يستخدم تاريخ النهاردة
    filtered = filtered.filter((location) => {
      if (!location.installation_date) return false; // لو undefined استبعده

      const installDate = new Date(location.installation_date);
      return installDate >= from && installDate <= to;
    });
    // filtered = filtered.filter((location) => {
    //   const installDate = new Date(location.installation_date);
    //   return installDate >= from && installDate <= to;
    // });
  }

  return NextResponse.json(filtered);
}