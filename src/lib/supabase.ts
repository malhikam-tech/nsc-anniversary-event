import { createClient } from '@supabase/supabase-js';
import { ExamSettings, Participant } from '../types';

export const SUPABASE_URL = 'https://ckbirxkmyglcblqwxuvf.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_vTz7oRJidWGZHbq7QXKdeg_uPon3QyI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

const DEFAULT_SETTINGS: ExamSettings = {
  id: 'singleton',
  is_open: false,
  announcement: 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!',
  max_violations: 3,
};

// 1. Upload proof photo to Supabase Storage bucket 'proofs'
export async function uploadProofPhoto(file: File, phone: string): Promise<{ url: string; error?: string }> {
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const extension = file.name.split('.').pop() || 'jpg';
    const filePath = `proof_${cleanPhone}_${Date.now()}.${extension}`;

    const { data, error } = await supabase.storage
      .from('proofs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase storage upload error:', error.message);
      return { url: '', error: `Gagal upload ke bucket proofs: ${error.message}` };
    }

    const { data: publicData } = supabase.storage.from('proofs').getPublicUrl(data.path);
    return { url: publicData.publicUrl };
  } catch (err: any) {
    console.error('Failed to upload proof photo:', err);
    return { url: '', error: err.message || 'Gagal mengunggah foto' };
  }
}

// 2. Fetch exam settings directly from Supabase
export async function fetchExamSettings(): Promise<ExamSettings> {
  try {
    const { data, error } = await supabase
      .from('exam_settings')
      .select('*')
      .eq('id', 'singleton')
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return data as ExamSettings;
  } catch (err) {
    console.warn('Error fetching exam settings from Supabase:', err);
    return DEFAULT_SETTINGS;
  }
}

// 3. Update exam settings (Admin)
export async function updateExamSettings(settings: Partial<ExamSettings>): Promise<boolean> {
  try {
    const payload = {
      id: 'singleton',
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('exam_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase update exam settings error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to update exam settings:', err);
    return false;
  }
}

// 4. Register or Get Participant directly in Supabase
export async function registerParticipant(participant: {
  username: string;
  phone: string;
  proof_url: string;
  status: Participant['status'];
}): Promise<{ participant: Participant; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .upsert(
        {
          username: participant.username,
          phone: participant.phone,
          proof_url: participant.proof_url,
          status: participant.status,
          violations_count: 0,
          score: 0,
          correct_answers: 0,
          answers: {},
          last_active: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase register error:', error.message);
      return {
        participant: {
          id: `p_${Date.now()}`,
          username: participant.username,
          phone: participant.phone,
          proof_url: participant.proof_url,
          status: 'waiting',
          violations_count: 0,
          score: 0,
          correct_answers: 0,
          answers: {},
          created_at: new Date().toISOString(),
          submitted_at: null,
          last_active: new Date().toISOString(),
        },
        error: error.message,
      };
    }

    return { participant: data as Participant };
  } catch (err: any) {
    console.error('Registration error:', err);
    return {
      participant: {
        id: `p_${Date.now()}`,
        username: participant.username,
        phone: participant.phone,
        proof_url: participant.proof_url,
        status: 'waiting',
        violations_count: 0,
        score: 0,
        correct_answers: 0,
        answers: {},
        created_at: new Date().toISOString(),
        submitted_at: null,
        last_active: new Date().toISOString(),
      },
      error: err.message,
    };
  }
}

// 5. Update participant progress / answers in real-time
export async function updateParticipantProgress(
  phone: string,
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  violationsCount: number,
  status: Participant['status'] = 'in_progress',
  reason?: string
): Promise<void> {
  const payload: any = {
    answers,
    violations_count: violationsCount,
    status,
    last_active: new Date().toISOString(),
  };
  if (reason) payload.disqualification_reason = reason;

  try {
    const { error } = await supabase.from('participants').update(payload).eq('phone', phone);
    if (error) {
      console.warn('Real-time sync warning:', error.message);
    }
  } catch (err) {
    console.warn('Real-time sync error:', err);
  }
}

// 6. Submit final exam
export async function submitExam(
  phone: string,
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  score: number,
  correctAnswers: number
): Promise<{ success: boolean; error?: string }> {
  const payload = {
    answers,
    score,
    correct_answers: correctAnswers,
    status: 'submitted' as const,
    submitted_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('participants').update(payload).eq('phone', phone);
    if (error) {
      console.error('Supabase submit error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error submitting exam:', err);
    return { success: false, error: err.message };
  }
}

// 7. Disqualify participant (Anti-cheat or Admin Action)
export async function disqualifyParticipant(phone: string, reason: string): Promise<void> {
  const payload = {
    status: 'disqualified' as const,
    disqualification_reason: reason,
    last_active: new Date().toISOString(),
  };

  try {
    await supabase.from('participants').update(payload).eq('phone', phone);
  } catch (err) {
    console.warn('Supabase disqualify error:', err);
  }
}

// 8. Reinstate participant (Admin Action)
export async function reinstateParticipant(phone: string): Promise<void> {
  const payload = {
    status: 'in_progress' as const,
    violations_count: 0,
    disqualification_reason: null,
    last_active: new Date().toISOString(),
  };

  try {
    await supabase.from('participants').update(payload).eq('phone', phone);
  } catch (err) {
    console.warn('Supabase reinstate error:', err);
  }
}

// 9. Fetch all participants directly from Supabase for Admin Dashboard
export async function fetchAllParticipants(): Promise<Participant[]> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('score', { ascending: false })
      .order('submitted_at', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetch participants warning:', error?.message);
      return [];
    }

    return data as Participant[];
  } catch (err) {
    console.error('Error fetching all participants from Supabase:', err);
    return [];
  }
}
