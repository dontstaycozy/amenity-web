// src/app/lib/streakService.ts
import { supabase } from './supabaseclient';

// Get the user's streak and HP for today
export async function getUserStreakAndHP(user_id: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('streaks_input')
    .select('*')
    .eq('user_id', user_id)
    .eq('date', today)
    .single();

  if (error || !data) {
    // If no entry for today, fetch the latest entry
    const { data: lastData } = await supabase
      .from('streaks_input')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    return lastData;
  }
  return data;
}

// When user finishes reading, restore HP and increment streak
export async function finishReading(user_id: string) {
  const today = new Date().toISOString().split('T')[0];
  // Get yesterday's streak
  const { data: lastData } = await supabase
    .from('streaks_input')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  const newStreak = lastData ? lastData.streaknum + 1 : 1;

  // Upsert today's entry
  const { data, error } = await supabase
    .from('streaks_input')
    .upsert([
      {
        user_id,
        date: today,
        streaknum: newStreak,
        Stage: 1, // full plant
        Health_Points: 3,
      },
    ], { onConflict: ['user_id', 'date'] });

  return { data, error };
}