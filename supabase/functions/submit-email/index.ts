import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // First, store the email in the database
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (dbError) {
      console.error("Database error:", dbError);
      if (dbError.code === "23505") { // unique violation
        return new Response(
          JSON.stringify({ error: "This email is already on the waitlist" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }
      throw new Error("Failed to save to database");
    }

    // Then attempt to send the notification email
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Know.Period Waitlist <onboarding@resend.dev>", // Using Resend's default domain until custom domain is verified
        to: "aruloca2006@gmail.com",
        subject: "New Waitlist Signup",
        html: `
          <h2>New Waitlist Signup</h2>
          <p>Email: ${email}</p>
          <p>Signed up at: ${new Date().toISOString()}</p>
        `
      })
    });

    if (!resendResponse.ok) {
      // Log the detailed error but don't throw
      const resendError = await resendResponse.text();
      console.error("Resend API error:", resendError);
      
      // Update the status in the database
      await supabase
        .from("waitlist")
        .update({ status: "email_failed" })
        .eq("email", email);

      // Still return success to the user since we stored their email
      return new Response(
        JSON.stringify({ 
          message: "Successfully joined waitlist",
          warning: "Notification delivery delayed"
        }),
        { 
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Update status to success
    await supabase
      .from("waitlist")
      .update({ status: "completed" })
      .eq("email", email);

    return new Response(
      JSON.stringify({ message: "Successfully joined waitlist" }),
      { 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        details: error.message 
      }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});