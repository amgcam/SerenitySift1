import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateText } from 'ai';

const DANGER_KEYWORDS = [
  'kill myself', 'suicide', 'end it', 'hurt myself', 'self harm',
  'kill someone', 'murder', 'harm others', 'want to die'
];

const MODERATE_KEYWORDS = [
  'depressed', 'hopeless', 'worthless', 'anxious', 'panic', 'scared',
  'overwhelmed', 'can\'t cope', 'giving up'
];

export async function GET() {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json({ 
      error: 'Database unavailable',
      patients: [] 
    }, { status: 503 });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        patients: [] 
      }, { status: 401 });
    }

    // Get all active patient connections
    const { data: connections, error: connectionsError } = await supabase
      .from('patient_connections')
      .select('patient_id')
      .eq('professional_id', user.id)
      .eq('status', 'active');

    if (connectionsError) {
      console.error('[v0] Connections error:', connectionsError);
      return NextResponse.json({ 
        error: 'Failed to fetch patients',
        patients: [] 
      }, { status: 500 });
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({ patients: [] });
    }

    // Generate insights for each patient
    const patients = await Promise.all(
      connections.map(async (conn) => {
        // Get patient profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', conn.patient_id)
          .single();

        // Get recent moods (last 50)
        const { data: moods } = await supabase
          .from('moods')
          .select('emotion, intensity, note, created_at')
          .eq('user_id', conn.patient_id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Get recent chat messages (last 20)
        const { data: chats } = await supabase
          .from('chat_messages')
          .select('content, created_at')
          .eq('user_id', conn.patient_id)
          .eq('role', 'user')
          .order('created_at', { ascending: false })
          .limit(20);

        const patientName = profile?.display_name || 'Unknown Patient';

        // Build context for AI
        const moodText = moods?.map(m => 
          `${m.emotion} (${m.intensity}/10)${m.note ? `: ${m.note}` : ''}`
        ).join('\n') || 'No mood data';

        const chatText = chats?.map(c => c.content).join('\n') || 'No chat data';
        
        const allText = `${moodText}\n${chatText}`.toLowerCase();

        // Generate AI summary
        let summary = '';
        try {
          const { text } = await generateText({
            model: 'openai/gpt-4o-mini',
            prompt: `You are a clinical AI assistant helping a mental health professional.

Analyze this patient's recent emotional wellness data and provide a brief, professional summary in 2-3 sentences.
Focus on: mood patterns, emotional trends, any concerning statements, and overall trajectory.

Recent Moods (last 50 entries):
${moodText}

Recent Journal/Chat Entries (last 20):
${chatText}

Return ONLY the clinical summary. Be direct and professional. Do NOT include greetings or headers.`,
            maxTokens: 200,
          });

          summary = text.trim();
        } catch (aiError) {
          console.error('[v0] AI generation error:', aiError);
          summary = 'Unable to generate AI summary. Please review patient data manually.';
        }

        // Determine risk level
        const hasDanger = DANGER_KEYWORDS.some(k => allText.includes(k.toLowerCase()));
        const hasModerate = MODERATE_KEYWORDS.some(k => allText.includes(k.toLowerCase()));
        const riskLevel = hasDanger ? 'high' : hasModerate ? 'moderate' : 'none';

        // Determine mood trend from recent moods
        let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
        if (moods && moods.length >= 5) {
          const recentAvg = moods.slice(0, 5).reduce((sum, m) => sum + m.intensity, 0) / 5;
          const olderAvg = moods.slice(5, 10).reduce((sum, m) => sum + m.intensity, 0) / Math.min(5, moods.length - 5);
          
          if (recentAvg > olderAvg + 1) {
            moodTrend = 'improving';
          } else if (recentAvg < olderAvg - 1) {
            moodTrend = 'declining';
          }
        }

        return {
          id: conn.patient_id,
          name: patientName,
          avatar: patientName[0],
          summary,
          riskLevel,
          moodTrend,
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }),
        };
      })
    );

    // Sort by risk level (high first, then moderate, then none)
    const sortedPatients = patients.sort((a, b) => {
      const riskOrder = { high: 0, moderate: 1, none: 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });

    return NextResponse.json({ patients: sortedPatients });
  } catch (error) {
    console.error('[v0] AI Insights API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      patients: [] 
    }, { status: 500 });
  }
}
