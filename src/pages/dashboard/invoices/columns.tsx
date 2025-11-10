import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export type Invoice = {
  id: string
  customer: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link to={`/dashboard/invoices/${row.original.id}`} className="underline">
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const value = row.original.amount
      return <div className="text-right">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === "paid" ? "default" : status === "pending" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]