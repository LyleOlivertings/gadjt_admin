import { connectToDB } from "@/lib/models/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/lib/models/Order"; // Adjust the import path as necessary
import Customer from "@/lib/models/Customer";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const siganture = req.headers.get("Stripe-Signature") as string;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      siganture,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerInfo = {
        clerkId: session.client_reference_id,
        name: session.customer_details?.name,
        email: session.customer_details?.email,

      }

      const ShippingAddress = {
        streetNumber: session.shipping_details?.address?.line1,
        streetName: session.shipping_details?.address?.line2,
        city: session.shipping_details?.address?.city,
        state: session.shipping_details?.address?.state,
        postalCode: session.shipping_details?.address?.postal_code,
        country: session.shipping_details?.address?.country,

      }

      const retrieveSession = await stripe.checkout.sessions.retrieve (
        session.id,
        { expand: ["line_items.data.price.product"] }
      )

      const lineItems = await retrieveSession?.line_items?.data

      const orderItems = lineItems?.map((item: any) => {
        return {
            product: item.price.product.metadata.productId,
            color: item.price.product.metadata.color || "N/A",
            size: item.price.product.metadata.size || "N/A",
            quantity: item.quantity,
        }
      });

      await connectToDB();
      const newOrder = new Order ({
        customerClerkid: customerInfo.clerkId, 
        products: orderItems,
        ShippingAddress,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      })
      await newOrder.save();

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        customer.orders.push(newOrder._id);
        await customer.save();
      } else {
        customer = new Customer({
            ...customerInfo,
            orders: [newOrder._id],
        });
      }
    }

  } catch (error) {
    console.log("Webhooks_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
