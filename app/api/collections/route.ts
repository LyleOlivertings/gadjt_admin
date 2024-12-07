
import { connectToDB } from "@/lib/models/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";



export const POST = async (req: NextRequest) => {
    try {

        const { userId }: { userId: string | null } = await auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        const { title, description, image } = await req.json()

        const existingCollection = await Collection.findOne({ title })


        if (existingCollection) {
            return new NextResponse("Collection already exists", { status: 400 })
        }

        if (!title || !image) {
            return new NextResponse("Title and images are required to create new collection", { status: 400 })
        }


        const newCollection = await Collection.create({
            title,
            description,
            image,

        })

        await newCollection.save()

        return NextResponse.json(newCollection, { status: 200 })


    } catch (error) {
        console.log("[collections_POST] Error: ", error);
        return new NextResponse('Internal server error', { status: 500 })
    }
}


export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const collections = await Collection.find().sort({ createdAt: "desc" })

        return NextResponse.json(collections, { status: 200 })


    } catch (error) {
        console.log("[collections_GET] Error: ", error);
        return new NextResponse('Internal server error', { status: 500 })

    }
}