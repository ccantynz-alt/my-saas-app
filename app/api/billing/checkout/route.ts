    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,

      // ✅ Map checkout back to the Clerk user
      client_reference_id: userId,

      // ✅ Also store on the subscription itself so later webhook events can map user
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },

      metadata: {
        clerkUserId: userId,
      },
    });
