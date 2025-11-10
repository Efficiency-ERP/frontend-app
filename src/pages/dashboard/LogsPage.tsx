import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLogs } from '@/context/logs-context'
import { Link } from 'react-router-dom'

function linkFor(module: string, id?: string): string | null {
  if (!id) return null
  switch (module) {
    case 'invoices': return `/dashboard/invoices/${id}`
    case 'contacts': return `/dashboard/contacts/${id}`
    case 'articles': return `/dashboard/articles/${id}`
    case 'deliveries': return `/dashboard/deliveries/${id}`
    case 'orders': return `/dashboard/orders/${id}`
    case 'issues': return `/dashboard/issues/${id}`
    default: return null
  }
}

export default function LogsPage() {
  const { logs } = useLogs()
  const items = useMemo(() => logs, [logs])
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Application activity by user and module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((l) => {
                  const href = linkFor(l.module, l.targetId)
                  return (
                    <TableRow key={l.id}>
                      <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{l.userName}</TableCell>
                      <TableCell>{l.message}</TableCell>
                      <TableCell className="capitalize">{l.module}</TableCell>
                      <TableCell>
                        {href ? <Link to={href} className="underline">{l.targetId}</Link> : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}