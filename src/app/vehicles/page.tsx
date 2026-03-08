'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { HEBREW } from '@/lib/constants/hebrew';
import { supabaseBrowser } from '@/lib/supabase';
import type { VehicleWithStatus } from '@/lib/types';

export default function VehicleListPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleWithStatus[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchRef = useRef(search);
  searchRef.current = search;

  const fetchVehicles = useCallback(async (q?: string) => {
    const url = q ? `/api/vehicles?q=${encodeURIComponent(q)}` : '/api/vehicles';
    const res = await fetch(url);
    if (res.ok) {
      setVehicles(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
    setIsAdmin(sessionStorage.getItem('admin_auth') === 'true');

    // Real-time: refresh list on any vehicle/reading/refuel change
    const channel = supabaseBrowser
      .channel('vehicles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => {
        fetchVehicles(searchRef.current || undefined);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'odometer_readings' }, () => {
        fetchVehicles(searchRef.current || undefined);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'refuel_events' }, () => {
        fetchVehicles(searchRef.current || undefined);
      })
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [fetchVehicles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchVehicles]);

  if (loading) {
    return (
      <AppShell>
        <p className="text-center py-8 text-gray-500">{HEBREW.common.loading}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{HEBREW.vehicles.title}</h1>
          {isAdmin && (
            <button
              onClick={() => router.push('/admin/vehicles')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              + {HEBREW.vehicles.addVehicle}
            </button>
          )}
        </div>

        <input
          type="search"
          placeholder={HEBREW.vehicles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {vehicles.length === 0 ? (
          <p className="text-center py-8 text-gray-500">{HEBREW.vehicles.noVehicles}</p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
