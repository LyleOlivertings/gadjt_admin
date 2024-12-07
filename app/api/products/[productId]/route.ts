import ProductDetails from "@/app/(dashboard)/products/[productId]/page";
import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/models/mongoDB";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const productDetails = await Product.findById(params.productId).populate({ path: "collections", model: Collection });

    if (!productDetails) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(productDetails, { status: 200 });
  } catch (error) {
    console.log("[ProductDetails_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
