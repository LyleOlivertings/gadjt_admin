import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/models/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
  try {
    await connectToDB()

    const collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse(JSON.stringify({ message: "Collection not found" }), { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 })



  } catch (error) {
    console.log("[CollectionId_GET]", error)
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let collection = await Collection.findById(params.collectionId)

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 })
    }

    const { title, description, image } = await req.json()

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 })
    }

    collection = await Collection.findByIdAndUpdate(params.collectionId, { title, description, image }, { new: true })

    await collection.save()

    return NextResponse.json(collection, { status: 200 });

  } catch (error) {

  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Collection.findByIdAndDelete(params.collectionId);

    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }


};



