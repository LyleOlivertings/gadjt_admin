import { columns } from '@/components/customers/CustomerColumns'
import { DataTable } from '@/components/customui/DataTable'
import Customer from '@/lib/models/Customer'
import { connectToDB } from '@/lib/models/mongoDB'
import { Separator } from '@radix-ui/react-separator'
import React from 'react'

const Customers = async () => {

    await connectToDB()

    const customers = await Customer.find().sort({createdAt: "desc"})
  return (
    <div className='px-10 py-5'>
        <p className='text-heading2-bold'>Customers</p>
        <Separator className='my-5'/>
        <DataTable columns={columns} data={customers} searchKey='name' /> 
        
    </div>
  )
}

export default Customers