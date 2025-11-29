import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    const payments: Payment[] = [
    { id: "p1", amount: 250, status: "success", email: "rahul@gmail.com" },
    { id: "p2", amount: 340, status: "pending", email: "sneha@yahoo.com" },
    { id: "p3", amount: 120, status: "pending", email: "arjun@hotmail.com" },
    { id: "p4", amount: 560, status: "success", email: "priya@outlook.com" },
];
  
  return payments;
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10 text-white">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export {getData};