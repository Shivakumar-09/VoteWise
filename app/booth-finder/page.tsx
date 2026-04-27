"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Clock,
  Phone,
  Navigation,
  AlertTriangle,
  Loader2,
  Info,
  Compass,
  ArrowRight,
  ExternalLink,
  Map as MapIcon
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface Booth {
  id: string;
  boothCode: string;
  name: string;
  address: string;
  state: string;
  district: string;
  city?: string;
  area?: string;
  pincode: string;
  contactNumber?: string;
  timing: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  travelTime?: number;
}

export default function BoothFinderPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps?q=India&z=5&output=embed");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent, locationOverride?: { lat: number; lng: number }) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && !locationOverride) return;

    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      if (locationOverride) {
        params.append("lat", locationOverride.lat.toString());
        params.append("lng", locationOverride.lng.toString());
      } else {
        const query = searchQuery.trim();
        if (/^\d{6}$/.test(query)) {
          params.append("pincode", query);
        } else {
          params.append("q", query);
        }
      }

      const res = await fetch(`/api/booths?${params}`);
      const data = await res.json();

      if (data.booths && data.booths.length > 0) {
        setBooths(data.booths);
        const first = data.booths[0];
        updateMap(first.latitude || 17.3850, first.longitude || 78.4867, 15);
      } else {
        setBooths([]);
        if (!locationOverride) {
          updateMapFromQuery(searchQuery);
        }
      }
      
      setSearched(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to booth database. Showing general map results.");
    } finally {
      setLoading(false);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const updateMap = (lat: number, lng: number, zoom = 14) => {
    if (apiKey) {
      setMapUrl(`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=${zoom}`);
    } else {
      setMapUrl(`https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`);
    }
  };

  const updateMapFromQuery = (query: string) => {
    if (apiKey) {
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query + " polling station")}&zoom=13`);
    } else {
      setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(query + " polling station")}&z=13&output=embed`);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSearchQuery("My Current Location");
        handleSearch(undefined, { lat: latitude, lng: longitude });
        setGeoLoading(false);
      },
      (err) => {
        console.error(err);
        setGeoLoading(false);
        alert("Unable to retrieve your location. Please check browser permissions.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 transition-colors duration-300">
      <div className="page-container max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <Compass className="w-3 h-3" />
              Live Booth Finder
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground mb-4 tracking-tighter leading-none">
              Find Your <span className="gradient-text">Polling Station</span>
            </h1>
            <p className="text-foreground/50 text-lg font-medium">
              Locate the nearest voting center in real-time with precise distance and directions.
            </p>
          </div>
          
          <button
            onClick={handleUseMyLocation}
            disabled={geoLoading || loading}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-foreground text-background font-bold hover:bg-foreground/90 transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
            {t("booth.use_my_location")}
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search & List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card-strong p-6 rounded-[2rem] border-foreground/10 shadow-premium">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-foreground/30 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("booth.search_placeholder")}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-indigo-500/50 focus:bg-foreground/10 transition-all text-sm font-bold"
                />
              </form>
            </div>

            <div ref={resultsRef} className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="glass-card p-6 border-foreground/5 animate-pulse">
                        <div className="h-4 bg-foreground/10 rounded w-1/4 mb-4" />
                        <div className="h-6 bg-foreground/10 rounded w-3/4 mb-4" />
                        <div className="h-4 bg-foreground/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : searched && booths.length > 0 ? (
                  booths.map((booth, idx) => (
                    <motion.div
                      key={booth.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => updateMap(booth.latitude!, booth.longitude!)}
                      className="glass-card p-6 border-foreground/5 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{booth.boothCode}</span>
                           <h3 className="text-foreground font-bold text-lg leading-tight group-hover:text-indigo-400 transition-colors">{booth.name}</h3>
                        </div>
                        {booth.distance && (
                          <div className="text-right">
                             <p className="text-foreground font-black text-lg leading-none">{booth.distance} <span className="text-[10px] uppercase">km</span></p>
                             <p className="text-foreground/30 text-[10px] uppercase font-bold mt-1">Distance</p>
                          </div>
                        )}
                      </div>

                      <p className="text-foreground/50 text-sm mb-6 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        {booth.address}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-foreground/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[10px] text-foreground/60 font-bold uppercase">{booth.timing}</span>
                        </div>
                        {booth.travelTime && (
                          <div className="flex items-center gap-2 justify-end">
                            <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] text-foreground/60 font-bold uppercase">~{booth.travelTime} mins</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${booth.latitude},${booth.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/10"
                        >
                          <Navigation className="w-3.5 h-3.5" /> {t("booth.get_directions")}
                        </a>
                        {booth.contactNumber && (
                           <a 
                             href={`tel:${booth.contactNumber}`}
                             onClick={(e) => e.stopPropagation()}
                             className="p-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all"
                           >
                             <Phone className="w-3.5 h-3.5" />
                           </a>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : searched ? (
                  <div className="glass-card p-10 text-center border-amber-500/20 bg-amber-500/5 rounded-[2rem]">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h4 className="text-foreground font-bold text-lg mb-2">No Records Found</h4>
                    <p className="text-foreground/50 text-sm mb-6">We don't have detailed booth records for this specific area yet.</p>
                    <div className="space-y-3">
                       <a href="tel:1950" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-sm">
                         <Phone className="w-4 h-4" /> Call Helpline: 1950
                       </a>
                       <div className="text-[10px] text-foreground/30 uppercase font-black tracking-widest pt-2">Fallback to general map</div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center border-foreground/5 opacity-50 border-dashed">
                     <MapIcon className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
                     <p className="text-foreground/40 text-sm font-medium">Search for your area or use GPS <br />to find nearby polling stations.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-7 h-[600px] lg:h-[800px] sticky top-24">
            <div className="glass-card-strong h-full rounded-[2.5rem] border-foreground/10 shadow-premium overflow-hidden relative group">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                src={mapUrl}
                allowFullScreen
                loading="lazy"
                className="transition-opacity duration-700"
              />
              
              {/* Floating Legend */}
              <div className="absolute top-6 left-6 p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-2xl max-w-xs hidden md:block">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    <span className="text-xs font-bold text-foreground">Polling Station</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                    <span className="text-xs font-bold text-foreground">You are here</span>
                 </div>
              </div>

              {/* Bottom Actions */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-xl border border-foreground/10 px-6 py-3 rounded-full shadow-2xl whitespace-nowrap">
                 <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] border-r border-foreground/10 pr-4 mr-2">Interactive Guide</p>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                       <span className="text-xs font-bold text-foreground">Accurate Routes</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Info className="w-3.5 h-3.5 text-amber-500" />
                       <span className="text-xs font-bold text-foreground">Open Now</span>
                    </div>
                 </div>
              </div>

              {/* Loading Overlay */}
              <AnimatePresence>
                {(loading || geoLoading) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-20"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                         <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                         <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500" />
                      </div>
                      <div className="text-center">
                         <p className="text-foreground font-black text-sm uppercase tracking-[0.3em] animate-pulse mb-2">Syncing with ECI Database</p>
                         <p className="text-foreground/30 text-[10px] font-bold">CALCULATING NEAREST COORDINATES...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Help Section */}
        <div className="mt-20">
           <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 border-l-4 border-indigo-500 bg-indigo-500/5">
                 <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-4">Official Helpline</h4>
                 <p className="text-foreground/50 text-sm leading-relaxed mb-6">Call the National Voter Helpline for any issues regarding your voter card or polling station assignment.</p>
                 <a href="tel:1950" className="flex items-center justify-between group">
                    <span className="text-2xl font-black text-indigo-500">1950</span>
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Phone className="w-4 h-4" />
                    </div>
                 </a>
              </div>

              <div className="glass-card p-8 border-l-4 border-rose-500 bg-rose-500/5">
                 <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-4">Telangana CEO</h4>
                 <p className="text-foreground/50 text-sm leading-relaxed mb-6">Visit the official Chief Electoral Officer website for Telangana state-specific announcements.</p>
                 <a href="https://ceotelangana.nic.in" target="_blank" className="flex items-center justify-between group">
                    <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Visit Portal</span>
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                       <ExternalLink className="w-4 h-4" />
                    </div>
                 </a>
              </div>

              <div className="glass-card p-8 border-l-4 border-amber-500 bg-amber-500/5">
                 <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-4">Search Tips</h4>
                 <p className="text-foreground/50 text-sm leading-relaxed mb-6">If your area is not found, try searching for the main city name or use your 6-digit PIN code.</p>
                 <div className="flex flex-wrap gap-2">
                    {['Hyderabad', 'Secunderabad', 'Rangareddy'].map(city => (
                       <button key={city} onClick={() => setSearchQuery(city)} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-colors">
                          {city}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
