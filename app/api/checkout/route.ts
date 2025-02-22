import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
  export async function POST(req: NextRequest) {
    try {
      const { cartItems, customer } = await req.json();
  
      if (!cartItems || !customer) {
        return new NextResponse("Not enough data to checkout", { status: 400 });
      }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "AU", "JP", "ZA"],
      },
      shipping_options: [
        { shipping_rate: "shr_1QXX1LCctejUt7J48aJXpkvG" },
        { shipping_rate: "shr_1QXX0fCctejUt7J4uGh4DkIq" },
        { shipping_rate: "shr_1QZ9oHCctejUt7J4ewnJ8fzv" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "zar",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: Math.round(cartItem.item.price * 1.15 * 100),
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[Checkout Error]", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
