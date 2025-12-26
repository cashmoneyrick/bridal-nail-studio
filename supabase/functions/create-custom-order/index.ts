import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation schemas and limits
const MAX_TEXT_LENGTH = 1000;
const MAX_COLORS = 10;
const MAX_ACCENT_NAILS = 10;
const MAX_EFFECTS = 10;
const MAX_ARTWORK_SELECTIONS = 10;
const MAX_INSPIRATION_IMAGES = 10;
const MAX_ARRAY_STRING_LENGTH = 500;

const VALID_SHAPES = ['almond', 'coffin', 'oval', 'square', 'stiletto', 'round'];
const VALID_LENGTHS = ['short', 'medium', 'long', 'extra-long'];
const VALID_FINISHES = ['glossy', 'matte', 'shimmer'];
const VALID_TIERS = ['none', 'minimal', 'moderate', 'full'];
const VALID_ARTWORK_TYPES = ['none', 'predefined', 'custom', 'both'];
const VALID_STATUSES = ['pending', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled'];

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function sanitizeText(text: string | null | undefined, maxLength: number = MAX_TEXT_LENGTH): string | null {
  if (!text || typeof text !== 'string') return null;
  // Trim and limit length
  const sanitized = text.trim().slice(0, maxLength);
  // Remove any potential script tags or dangerous patterns
  return sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+=/gi, '');
}

function validateEnum(value: string | null | undefined, validValues: string[], fieldName: string): ValidationResult {
  if (!value) return { valid: true };
  if (!validValues.includes(value)) {
    return { valid: false, error: `Invalid ${fieldName}: ${value}` };
  }
  return { valid: true };
}

function validateColors(colors: unknown): ValidationResult {
  if (!colors || typeof colors !== 'object') return { valid: true };
  
  const colorsObj = colors as Record<string, unknown>;
  
  // Validate palette structure
  if (colorsObj.palette && typeof colorsObj.palette === 'object') {
    const palette = colorsObj.palette as Record<string, unknown>;
    if (palette.colors && Array.isArray(palette.colors)) {
      if (palette.colors.length > MAX_COLORS) {
        return { valid: false, error: `Too many palette colors: max ${MAX_COLORS}` };
      }
      // Validate each color is a valid hex or color string
      for (const color of palette.colors) {
        if (typeof color !== 'string' || color.length > 50) {
          return { valid: false, error: 'Invalid color format in palette' };
        }
      }
    }
  }
  
  // Validate nailColors
  if (colorsObj.nailColors && typeof colorsObj.nailColors === 'object') {
    const nailColors = colorsObj.nailColors as Record<string, unknown>;
    const keys = Object.keys(nailColors);
    if (keys.length > MAX_COLORS) {
      return { valid: false, error: `Too many nail colors: max ${MAX_COLORS}` };
    }
    for (const key of keys) {
      const value = nailColors[key];
      if (value && typeof value !== 'string') {
        return { valid: false, error: 'Invalid nail color value' };
      }
      if (typeof value === 'string' && value.length > 50) {
        return { valid: false, error: 'Nail color value too long' };
      }
    }
  }
  
  return { valid: true };
}

function validateAccentNails(accentNails: unknown): ValidationResult {
  if (!accentNails) return { valid: true };
  if (!Array.isArray(accentNails)) return { valid: false, error: 'accent_nails must be an array' };
  if (accentNails.length > MAX_ACCENT_NAILS) {
    return { valid: false, error: `Too many accent nails: max ${MAX_ACCENT_NAILS}` };
  }
  
  for (const nail of accentNails) {
    if (typeof nail !== 'object' || nail === null) {
      return { valid: false, error: 'Invalid accent nail entry' };
    }
    const nailObj = nail as Record<string, unknown>;
    if (typeof nailObj.index !== 'number' || nailObj.index < 0 || nailObj.index > 9) {
      return { valid: false, error: 'Invalid accent nail index' };
    }
  }
  
  return { valid: true };
}

function validateEffects(effects: unknown): ValidationResult {
  if (!effects) return { valid: true };
  if (!Array.isArray(effects)) return { valid: false, error: 'effects must be an array' };
  if (effects.length > MAX_EFFECTS) {
    return { valid: false, error: `Too many effects: max ${MAX_EFFECTS}` };
  }
  
  const validEffects = ['chrome', 'holographic', 'french', 'ombre', 'marble', 'glitter'];
  const validScopes = ['all', 'accent'];
  
  for (const effect of effects) {
    if (typeof effect !== 'object' || effect === null) {
      return { valid: false, error: 'Invalid effect entry' };
    }
    const effectObj = effect as Record<string, unknown>;
    if (typeof effectObj.effect !== 'string' || !validEffects.includes(effectObj.effect)) {
      return { valid: false, error: `Invalid effect type: ${effectObj.effect}` };
    }
    if (typeof effectObj.scope !== 'string' || !validScopes.includes(effectObj.scope)) {
      return { valid: false, error: `Invalid effect scope: ${effectObj.scope}` };
    }
  }
  
  return { valid: true };
}

function validateArtworkSelections(selections: unknown): ValidationResult {
  if (!selections) return { valid: true };
  if (!Array.isArray(selections)) return { valid: false, error: 'artwork_selections must be an array' };
  if (selections.length > MAX_ARTWORK_SELECTIONS) {
    return { valid: false, error: `Too many artwork selections: max ${MAX_ARTWORK_SELECTIONS}` };
  }
  
  for (const selection of selections) {
    if (typeof selection !== 'object' || selection === null) {
      return { valid: false, error: 'Invalid artwork selection entry' };
    }
    const selObj = selection as Record<string, unknown>;
    if (typeof selObj.type !== 'string' || selObj.type.length > 100) {
      return { valid: false, error: 'Invalid artwork type' };
    }
    if (selObj.nails && Array.isArray(selObj.nails) && selObj.nails.length > 10) {
      return { valid: false, error: 'Too many nails in artwork selection' };
    }
  }
  
  return { valid: true };
}

function validateInspirationImages(images: unknown): ValidationResult {
  if (!images) return { valid: true };
  if (!Array.isArray(images)) return { valid: false, error: 'inspiration_images must be an array' };
  if (images.length > MAX_INSPIRATION_IMAGES) {
    return { valid: false, error: `Too many inspiration images: max ${MAX_INSPIRATION_IMAGES}` };
  }
  
  const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  for (const url of images) {
    if (typeof url !== 'string') {
      return { valid: false, error: 'Invalid image URL' };
    }
    if (url.length > MAX_ARRAY_STRING_LENGTH) {
      return { valid: false, error: 'Image URL too long' };
    }
    if (!urlPattern.test(url)) {
      return { valid: false, error: 'Invalid image URL format' };
    }
  }
  
  return { valid: true };
}

function validatePrice(price: unknown): ValidationResult {
  if (price === null || price === undefined) return { valid: true };
  if (typeof price !== 'number') return { valid: false, error: 'estimated_price must be a number' };
  if (price < 0 || price > 10000) {
    return { valid: false, error: 'estimated_price must be between 0 and 10000' };
  }
  return { valid: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    // Create client with user's auth for RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Get user from token (optional - guest orders allowed but rate limited)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Parse request body
    const body = await req.json();
    console.log('Received order request:', { hasUser: !!user, bodyKeys: Object.keys(body) });
    
    // Validate required fields
    if (!body.shape || !VALID_SHAPES.includes(body.shape)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing shape' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!body.length || !VALID_LENGTHS.includes(body.length)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing length' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!body.finish || !VALID_FINISHES.includes(body.finish)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing finish' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate optional enum fields
    const enumValidations = [
      validateEnum(body.rhinestones_tier, VALID_TIERS, 'rhinestones_tier'),
      validateEnum(body.charms_tier, VALID_TIERS, 'charms_tier'),
      validateEnum(body.artwork_type, VALID_ARTWORK_TYPES, 'artwork_type'),
      validateEnum(body.status, VALID_STATUSES, 'status'),
    ];
    
    for (const validation of enumValidations) {
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Validate JSONB fields
    const jsonbValidations = [
      validateColors(body.colors),
      validateAccentNails(body.accent_nails),
      validateEffects(body.effects),
      validateArtworkSelections(body.artwork_selections),
      validateInspirationImages(body.inspiration_images),
      validatePrice(body.estimated_price),
    ];
    
    for (const validation of jsonbValidations) {
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Sanitize text fields
    const sanitizedNotes = sanitizeText(body.notes);
    const sanitizedDescription = sanitizeText(body.custom_artwork_description);
    const sanitizedCharmPreferences = sanitizeText(body.charms_preferences, 500);
    const sanitizedBaseProductHandle = sanitizeText(body.base_product_handle, 100);
    
    // Build validated order payload
    const orderPayload = {
      user_id: user?.id || null,
      base_product_handle: sanitizedBaseProductHandle,
      shape: body.shape,
      length: body.length,
      finish: body.finish,
      colors: body.colors || {},
      accent_nails: body.accent_nails || [],
      effects: body.effects || [],
      rhinestones_tier: body.rhinestones_tier || 'none',
      charms_tier: body.charms_tier || 'none',
      charms_preferences: sanitizedCharmPreferences,
      artwork_type: body.artwork_type || 'none',
      artwork_selections: body.artwork_selections || [],
      custom_artwork_description: sanitizedDescription,
      inspiration_images: body.inspiration_images || [],
      estimated_price: body.estimated_price || null,
      requires_quote: body.requires_quote === true,
      status: body.status || 'pending',
      notes: sanitizedNotes,
    };
    
    // Use service role client for insert to bypass RLS
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert order
    const { data: order, error: insertError } = await adminClient
      .from('custom_orders')
      .insert([orderPayload])
      .select('id')
      .single();
    
    if (insertError) {
      console.error('Failed to create order:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Order created successfully:', { orderId: order.id, userId: user?.id });
    
    return new Response(JSON.stringify({ id: order.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in create-custom-order:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
