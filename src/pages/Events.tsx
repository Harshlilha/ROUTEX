import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Calendar, Clock } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassPanel } from '../components/ui/GlassPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { eventService } from '../services/event.service';
import { DisruptionEvent } from '../types';

export const Events = () => {
  const [events, setEvents] = useState<DisruptionEvent[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Critical' | 'High' | 'Medium' | 'Low'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        eventService.getEvents(100),
        eventService.getEventStats(),
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.severity === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading events..." />
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="w-8 h-8 text-violet-500" />
              <h1 className="text-4xl font-bold text-white">Disruption Events</h1>
            </div>
            <p className="text-gray-400">Track and monitor supply chain disruptions</p>
          </motion.div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Events</span>
                  <AlertTriangle className="w-5 h-5 text-violet-500" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalEvents}</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Critical</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.severityCounts.Critical}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">High</span>
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.severityCounts.High}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Active Now</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.activeEvents}</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg Duration</span>
                  <Clock className="w-5 h-5 text-violet-500" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.avgDuration.toFixed(0)}d
                </div>
              </GlassPanel>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            {(['all', 'Critical', 'High', 'Medium', 'Low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel className={`p-6 border ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{event.event_type}</h3>
                      <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500">Start Date</span>
                        <p className="text-sm text-white">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500">End Date</span>
                        <p className="text-sm text-white">
                          {new Date(event.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500">Duration</span>
                        <p className="text-sm text-white">{event.duration_days} days</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {event.affected_cities.map((city, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
