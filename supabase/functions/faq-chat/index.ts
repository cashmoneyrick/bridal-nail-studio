import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FAQ_SYSTEM_PROMPT = `You are a friendly and helpful customer support assistant for YourPrettySets, a luxury press-on nail boutique. 

Here are the FAQs you should know:

**ORDERING & SHIPPING:**
- Orders ship within 2-3 business days
- Free shipping on orders over $50
- We ship worldwide (international orders take 7-14 days)
- You'll receive a tracking number via email once shipped

**PRODUCTS:**
- Each set includes 24 press-on nails, nail glue, a mini file, prep pad, instructions, and a reusable storage case
- Our nails are handcrafted and made-to-order
- Nails come in sizes 1-10 (measure your natural nails for best fit)
- Custom designs are available through our Custom Studio

**APPLICATION & CARE:**
- Press-ons last 1-2 weeks with proper application
- Always prep your natural nails (clean, dry, push back cuticles)
- Apply glue to both your natural nail AND the press-on
- Avoid water for the first hour after application
- Remove gently by soaking in warm soapy water

**RETURNS & EXCHANGES:**
- We accept returns within 14 days for unused products
- Custom orders are final sale
- Contact us at hello@yourprettysets.com for any issues

**NAIL CLUB MEMBERSHIP:**
- Monthly subscription with exclusive designs
- 20% off all orders
- Early access to new collections
- Free shipping on all orders

Be concise, friendly, and helpful. If you don't know something, suggest they contact support at hello@yourprettysets.com.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message } = body;

    // Validate message exists and is a string
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedMessage = message.trim();

    // Check for empty message
    if (trimmedMessage.length === 0) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enforce maximum length (1000 chars)
    if (trimmedMessage.length > 1000) {
      return new Response(JSON.stringify({ error: 'Message too long (max 1000 characters)' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Log only first 100 chars to prevent log injection
    console.log("Processing FAQ question:", trimmedMessage.substring(0, 100));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: FAQ_SYSTEM_PROMPT },
          { role: "user", content: trimmedMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    console.log("AI response generated successfully");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("FAQ chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
