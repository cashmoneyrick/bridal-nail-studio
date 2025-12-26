import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
// For production, consider using Redis/Upstash for persistent rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_HOUR = 5;
const HOUR_IN_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + HOUR_IN_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
  }
  
  if (record.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - record.count };
}

// Email validation regex
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function sanitizeString(str: string | null | undefined, maxLength: number): string | null {
  if (!str) return null;
  // Trim and limit length
  const sanitized = str.trim().substring(0, maxLength);
  // Remove any potential script tags or dangerous characters
  return sanitized.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${ip.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0'
          } 
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, first_name, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length > 255) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(trimmedEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize first_name
    const sanitizedFirstName = sanitizeString(first_name, 50);
    
    // Validate source
    const allowedSources = ['nail_club_page', 'popup', 'footer'];
    const sanitizedSource = allowedSources.includes(source) ? source : 'nail_club_page';

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Insert subscriber
    const { error } = await supabase
      .from('nail_club_subscribers')
      .insert({
        email: trimmedEmail,
        first_name: sanitizedFirstName,
        source: sanitizedSource,
      });

    if (error) {
      // Handle duplicate email (unique constraint violation)
      if (error.code === '23505') {
        console.log(`Already subscribed: ${trimmedEmail.substring(0, 3)}...`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            already_subscribed: true,
            message: 'Already subscribed' 
          }),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': rateLimit.remaining.toString()
            } 
          }
        );
      }
      
      console.error('Subscription error:', error.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Subscription failed. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`New subscriber: ${trimmedEmail.substring(0, 3)}...`);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
