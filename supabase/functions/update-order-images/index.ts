import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation constants (matching create-custom-order)
const MAX_INSPIRATION_IMAGES = 10;
const MAX_URL_LENGTH = 500;

interface ValidationResult {
  valid: boolean;
  error?: string;
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
    if (url.length > MAX_URL_LENGTH) {
      return { valid: false, error: 'Image URL too long' };
    }
    // Also allow storage paths (not just URLs) for private bucket
    if (!urlPattern.test(url) && !url.match(/^[a-f0-9-]+\/\d+-\d+\.\w+$/)) {
      return { valid: false, error: 'Invalid image URL or path format' };
    }
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
    
    // Get authorization header - required for this endpoint
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Create client with user's auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse request body
    const body = await req.json();
    const { orderId, inspirationImages } = body;
    
    console.log('Update order images request:', { 
      userId: user.id, 
      orderId, 
      imageCount: inspirationImages?.length 
    });
    
    // Validate orderId
    if (!orderId || typeof orderId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid orderId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(orderId)) {
      return new Response(JSON.stringify({ error: 'Invalid orderId format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate inspiration images
    const imageValidation = validateInspirationImages(inspirationImages);
    if (!imageValidation.valid) {
      return new Response(JSON.stringify({ error: imageValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Use service role to verify order ownership and update
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // First verify the order exists and belongs to this user (or is a guest order they created)
    const { data: existingOrder, error: fetchError } = await adminClient
      .from('custom_orders')
      .select('id, user_id')
      .eq('id', orderId)
      .single();
    
    if (fetchError || !existingOrder) {
      console.error('Order not found:', fetchError);
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Verify ownership - user must own the order
    if (existingOrder.user_id !== user.id) {
      console.error('Unauthorized: user does not own this order', { 
        orderUserId: existingOrder.user_id, 
        requestUserId: user.id 
      });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Update the order with validated images
    const { error: updateError } = await adminClient
      .from('custom_orders')
      .update({ inspiration_images: inspirationImages || [] })
      .eq('id', orderId);
    
    if (updateError) {
      console.error('Failed to update order:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Order images updated successfully:', { orderId, imageCount: inspirationImages?.length || 0 });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in update-order-images:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
