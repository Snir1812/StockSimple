import { supabase } from './supabase'

/**
 * Ensures the given auth user has a profiles row with a business_id.
 * Creates a business + profile on first login (e.g. Google OAuth users
 * who never went through the email/password signup flow).
 * Returns the user's business_id.
 */
export async function ensureUserProfile(user) {
  if (!user) return null

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, business_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingProfile?.business_id) {
    return existingProfile.business_id
  }

  const emailPrefix = user.email ? user.email.split('@')[0] : 'העסק שלי'

  const { data: business, error: businessError } = await supabase
    .from('business')
    .insert({ name: emailPrefix, owner_id: user.id })
    .select('id')
    .single()

  if (businessError) throw businessError

  const fullName = user.user_metadata?.full_name || user.email

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ business_id: business.id })
      .eq('user_id', user.id)
    if (updateError) throw updateError
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({
      user_id: user.id,
      full_name: fullName,
      email: user.email,
      role: 'admin',
      business_id: business.id,
    })
    if (insertError) throw insertError
  }

  return business.id
}
