"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import Loader from "@/components/custom ui/Loader";
import { useEffect, useState } from "react";

const CollectionDetails = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  // Fetch collection data based on the provided collectionId
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const getCollectionDetails = async () => {
    try {
      const response = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET",
      });

      const data = await response.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collection details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollectionDetails();
  }, []);

  return loading ? <Loader /> : (
    <CollectionForm initialData={collectionDetails}/>
  )
};

export default CollectionDetails;
