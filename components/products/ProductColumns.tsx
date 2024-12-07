"use client";

import Delete from "@/components/custom ui/Delete";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Collection Title",
    cell: ({ row }) => (
      <Link href={`/products/${row.original._id}`} className="hover:text-red-1">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  
  },

  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({row}) => row.original.collections.map((collection) => collection.title).join(", "),
  
  },

  {
    accessorKey: "price",
    header: "Price (R)",
  
  },

  {
    accessorKey: "expense",
    header: "Expense (R)",
  
  
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="products" id={row.original._id} />,
  },
];
