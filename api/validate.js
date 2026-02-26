export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { code } = await req.json();

  if (!code) return new Response(JSON.stringify({ valid: false }), {
    headers: { 'Content-Type': 'application/json' }
  });

  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/access_codes?code=eq.${code.toUpperCase().trim()}&is_active=eq.true&select=code`, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
    }
  });

  const data = await res.json();
  const valid = Array.isArray(data) && data.length > 0;

  return new Response(JSON.stringify({ valid }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
