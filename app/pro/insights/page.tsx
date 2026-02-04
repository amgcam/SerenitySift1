'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  avatar: string;
  summary: string;
  riskLevel: 'none' | 'moderate' | 'high';
  lastUpdated: string;
  moodTrend: 'improving' | 'stable' | 'declining';
}

export default function AIInsights() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pro/insights')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch insights');
        return r.json();
      })
      .then(data => {
        setPatients(data.patients || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[v0] AI Insights error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black flex items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-soft-cyan animate-spin" />
          <p className="text-soft-text">Generating AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black pb-24">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-soft-cyan" />
            <h1 className="text-3xl font-bold text-white">AI Patient Insights</h1>
          </div>
          <Link href="/pro">
            <span className="text-soft-cyan hover:underline cursor-pointer">← Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Error State */}
        {error && (
          <Card className="border-coral/20 bg-coral/10 backdrop-blur-xl">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-coral" />
                <p className="text-white">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Insights */}
        {patients.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-soft-cyan/20 bg-deep-purple/80 backdrop-blur-xl">
              <CardContent className="py-16 text-center">
                <Sparkles className="w-16 h-16 mx-auto text-soft-cyan/50 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No Clients Yet</h3>
                <p className="text-soft-text">
                  Invite clients to your practice to see AI-generated wellness insights
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link href={`/pro/patient/${patient.id}`}>
                  <Card
                    className={`border backdrop-blur-xl relative overflow-hidden cursor-pointer hover:border-soft-cyan/40 transition-all group ${
                      patient.riskLevel === 'high'
                        ? 'border-coral/40 bg-coral/5'
                        : patient.riskLevel === 'moderate'
                          ? 'border-yellow-500/30 bg-yellow-500/5'
                          : 'border-soft-cyan/20 bg-deep-purple/80'
                    }`}
                  >
                    {/* HIGH RISK ALERT */}
                    {patient.riskLevel === 'high' && (
                      <div className="absolute top-0 left-0 right-0 bg-coral text-white text-sm font-bold py-2 px-4 flex items-center gap-2 animate-pulse">
                        <AlertCircle className="w-5 h-5" />
                        IMMEDIATE CONCERN – Review Now
                      </div>
                    )}

                    <CardContent className={`p-6 ${patient.riskLevel === 'high' ? 'mt-10' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-soft-cyan/20 flex items-center justify-center text-soft-cyan font-bold text-lg shrink-0">
                          {patient.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="text-xl font-semibold text-white group-hover:text-soft-cyan transition-colors">
                                {patient.name}
                              </h3>
                              <p className="text-sm text-soft-text">{patient.lastUpdated}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {patient.riskLevel === 'moderate' && (
                                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                  Monitor Closely
                                </Badge>
                              )}
                              {patient.moodTrend === 'improving' && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                  Improving
                                </Badge>
                              )}
                              {patient.moodTrend === 'declining' && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                  Declining
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="mt-3 text-gray-300 leading-relaxed">
                            {patient.summary}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
