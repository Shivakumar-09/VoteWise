import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const pincode = searchParams.get("pincode");
    const q = searchParams.get("q");
    const userLat = parseFloat(searchParams.get("lat") || "");
    const userLng = parseFloat(searchParams.get("lng") || "");

    if (!state && !district && !pincode && !q && !userLat) {
      return NextResponse.json(
        { error: "Provide at least one search parameter or location" },
        { status: 400 }
      );
    }

    const where: any = {};
    
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
        { pincode: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { area: { contains: q, mode: "insensitive" } },
      ];
    } else if (pincode) {
      where.pincode = pincode;
    } else if (district) {
      where.district = { contains: district, mode: "insensitive" };
    }

    let booths: any[] = [];
    try {
      // 3-second timeout to prevent API hangs if DB is unreachable
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database connection timeout")), 3000)
      );
      
      const dbPromise = prisma.pollingBooth.findMany({
        where,
        take: 50,
      });

      booths = await Promise.race([dbPromise, timeoutPromise]) as any[];
    } catch (dbError) {
      console.warn("Database unavailable or timed out, falling back to simulated booths.");
      booths = [];
    }

    // If no real booths found, and we have location context, generate random ones for demo
    if (booths.length === 0 && (!isNaN(userLat) || q || district || pincode)) {
      const cityCoordinates: Record<string, {lat: number, lng: number}> = {
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'delhi': { lat: 28.6139, lng: 77.2090 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'ahmedabad': { lat: 23.0225, lng: 72.5714 }
      };

      let baseLat = !isNaN(userLat) ? userLat : 17.3850;
      let baseLng = !isNaN(userLng) ? userLng : 78.4867;

      if (isNaN(userLat) && q) {
        const queryLower = q.toLowerCase();
        for (const [city, coords] of Object.entries(cityCoordinates)) {
          if (queryLower.includes(city)) {
            baseLat = coords.lat;
            baseLng = coords.lng;
            break;
          }
        }
      }
      
      const simulatedBooths = [
        {
          id: 'sim-1',
          boothCode: 'SIM-001',
          name: 'Primary Health Center (Simulated)',
          address: 'Near Main Market area',
          state: 'Telangana',
          district: district || q || 'Hyderabad',
          pincode: pincode || '500001',
          timing: '7:00 AM - 6:00 PM',
          latitude: baseLat + 0.005,
          longitude: baseLng + 0.003,
        },
        {
          id: 'sim-2',
          boothCode: 'SIM-002',
          name: 'Community Hall (Simulated)',
          address: 'Sector 4, Green Park Colony',
          state: 'Telangana',
          district: district || q || 'Hyderabad',
          pincode: pincode || '500001',
          timing: '7:00 AM - 6:00 PM',
          latitude: baseLat - 0.004,
          longitude: baseLng + 0.006,
        },
        {
          id: 'sim-3',
          boothCode: 'SIM-003',
          name: 'Government High School (Simulated)',
          address: 'Station Road, West Side',
          state: 'Telangana',
          district: district || q || 'Hyderabad',
          pincode: pincode || '500001',
          timing: '7:00 AM - 6:00 PM',
          latitude: baseLat + 0.008,
          longitude: baseLng - 0.002,
        }
      ];
      booths = simulatedBooths;
    }

    // Haversine calculation if user location is available
    if (!isNaN(userLat) && !isNaN(userLng)) {
      booths = booths.map((booth: any) => {
        if (booth.latitude && booth.longitude) {
          const distance = calculateDistance(userLat, userLng, booth.latitude, booth.longitude);
          const travelTime = Math.round((distance / 20) * 60);
          return { ...booth, distance, travelTime };
        }
        return booth;
      });
      booths.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));
    }

    return NextResponse.json({ booths: booths.slice(0, 10), count: booths.length });
  } catch (error) {
    console.error("Booth finder error:", error);
    return NextResponse.json(
      { error: "Failed to find booths. Please try again." },
      { status: 500 }
    );
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}
