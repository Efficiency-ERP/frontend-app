import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useInvoicesStore } from '@/pages/dashboard/invoices/store-context'
import { useArticlesStore } from '@/pages/dashboard/articles/store-context'
import { usePMESelection } from '@/context/pme-context'
import { formatTND } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import SalesBarChart from '@/components/SalesBarChart'

type Range = '7' | '30' | '90' | 'ytd'

function inRange(dateStr: string, range: Range) {
  const d = new Date(dateStr)
  const now = new Date()
  if (range === 'ytd') {
    return d.getFullYear() === now.getFullYear()
  }
  const days = Number(range)
  const ms = days * 24 * 3600 * 1000
  return now.getTime() - d.getTime() <= ms
}

export default function DashboardHome() {
  const navigate = useNavigate()
  const { invoices, deliveries, issues, orders } = useInvoicesStore()
  const { articles } = useArticlesStore()
  const { selectedOrgId, selectedOrgName } = usePMESelection()
  const [range, setRange] = useState<Range>('30')

  const isTenant = selectedOrgId === 'all'

  const scopedInvoices = useMemo(() => (
    isTenant ? invoices : invoices.filter((i) => i.organizationId === selectedOrgId)
  ), [invoices, isTenant, selectedOrgId])
  const scopedDeliveries = useMemo(() => (
    isTenant ? deliveries : deliveries.filter((d) => d.organizationId === selectedOrgId)
  ), [deliveries, isTenant, selectedOrgId])
  const scopedIssues = useMemo(() => (
    isTenant ? issues : issues.filter((i) => i.organizationId === selectedOrgId)
  ), [issues, isTenant, selectedOrgId])
  const scopedOrders = useMemo(() => (
    isTenant ? orders : orders.filter((o) => o.organizationId === selectedOrgId)
  ), [orders, isTenant, selectedOrgId])

  // KPI calculations
  const todayStr = new Date().toISOString().slice(0,10)
  const revenueToday = scopedInvoices.filter((i) => i.date === todayStr).reduce((s, i) => s + (i.totals.ttc ?? 0), 0)
  const revenueMTD = scopedInvoices.filter((i) => inRange(i.date, '30')).reduce((s, i) => s + (i.totals.ttc ?? 0), 0)
  const revenueYTD = scopedInvoices.filter((i) => inRange(i.date, 'ytd')).reduce((s, i) => s + (i.totals.ttc ?? 0), 0)

  const draftCount = scopedInvoices.filter((i) => i.status === 'draft').length
  const sentCount = scopedInvoices.filter((i) => i.status === 'sent').length
  const paidCount = scopedInvoices.filter((i) => i.status === 'paid').length
  const cancelledCount = scopedInvoices.filter((i) => i.status === 'cancelled').length

  const cashCollectedMTD = scopedInvoices.filter((i) => i.status === 'paid' && inRange(i.date, '30')).reduce((s, i) => s + (i.totals.ttc ?? 0), 0)
  const receivablesOutstanding = scopedInvoices.filter((i) => i.status === 'sent').reduce((s, i) => s + (i.totals.ttc ?? 0), 0)
  const dsoEstimate = (() => {
    const invoicesCount = scopedInvoices.length || 1
    const avg = revenueMTD / invoicesCount
    return Math.round((receivablesOutstanding / (avg || 1)) * 30)
  })()

  const vatMTD = scopedInvoices.filter((i) => inRange(i.date, '30')).reduce((s, i) => s + Object.values(i.totals.vatByRate || {}).reduce((a,b)=>a+b,0), 0)
  const dcMTD = scopedInvoices.filter((i) => inRange(i.date, '30')).reduce((s, i) => s + Object.values(i.totals.dcByRate || {}).reduce((a,b)=>a+b,0), 0)

  const consignmentsMTD = scopedInvoices.filter((i) => inRange(i.date, '30')).reduce((s, i) => s + i.consignments.reduce((a,c)=>a+c.total,0), 0)

  // Overdue spotlight (top 5)
  const overdueList = useMemo(() => {
    const now = Date.now()
    return scopedInvoices
      .filter((i) => i.status === 'sent')
      .map((i) => ({ id: i.id, number: i.number, amount: i.totals.ttc ?? 0, days: Math.floor((now - new Date(i.date).getTime())/(24*3600*1000)) }))
      .sort((a,b)=> b.days - a.days)
      .slice(0,5)
  }, [scopedInvoices])

  // Pipeline counts current month
  const pipelineCounts = {
    orders: scopedOrders.filter((o)=> inRange(o.date, '30')).length,
    issues: scopedIssues.filter((i)=> inRange(i.date, '30')).length,
    deliveries: scopedDeliveries.filter((d)=> inRange(d.date, '30')).length,
    invoices: scopedInvoices.filter((i)=> inRange(i.date, '30')).length,
  }

  // Low stock alerts
  const lowStock = useMemo(() => articles.filter((a) => a.type === 'product' && a.stock.onHand < a.stock.minStock).slice(0,6), [articles])

  // Fake data for top chart (last 6 months TTC)
  const chartFakeData = [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 16800 },
    { label: 'Mar', value: 14200 },
    { label: 'Apr', value: 9800 },
    { label: 'May', value: 17500 },
    { label: 'Jun', value: 15300 },
  ]
  const fakeMax = Math.max(...chartFakeData.map((d) => d.value)) || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mode: {isTenant ? 'Tenant (all orgs)' : `Organization — ${selectedOrgName ?? selectedOrgId}`}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm">Range</span>
          <div className="flex gap-1">
            {(['7','30','90','ytd'] as Range[]).map((r) => (
              <Button key={r} size="sm" variant={range===r? 'default':'outline'} onClick={()=>setRange(r)}>{r==='ytd'?'YTD':`${r}d`}</Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards + Top chart (fake data) */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Keep two KPIs on top row */}
        <Card className="shadow-none border border-border/40 md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue MTD</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{formatTND(revenueMTD)}</div></CardContent>
        </Card>
        <Card className="shadow-none border border-border/40 md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Receivables</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{formatTND(receivablesOutstanding)}</div><div className="text-xs text-muted-foreground">DSO est.: {dsoEstimate} days</div></CardContent>
        </Card>
        {/* Chart takes remaining width */}
        <Card className="shadow-none border border-border/40 md:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Sales Trend (Fake)</CardTitle><CardDescription>Last 6 months TTC (demo)</CardDescription></CardHeader>
          <CardContent>
            <SalesBarChart
              data={chartFakeData.map((d) => ({
                label: d.label,
                value: d.value,
                onClick: () => navigate('/dashboard/invoices'),
              }))}
              maxValue={fakeMax}
            />
          </CardContent>
        </Card>
      </div>

      {/* Moved KPIs to next row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-none border border-border/40 md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue Today</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{formatTND(revenueToday)}</div></CardContent>
        </Card>
        <Card className="shadow-none border border-border/40 md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue YTD</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{formatTND(revenueYTD)}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-none border border-border/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Invoices</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Draft: {draftCount} · Sent: {sentCount} · Paid: {paidCount} · Cancelled: {cancelledCount}</div>
            <Separator className="my-2" />
            <Button variant="outline" size="sm" onClick={()=> navigate('/dashboard/invoices?status=sent')}>Open Invoices</Button>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Cash Collected (MTD)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{formatTND(cashCollectedMTD)}</div></CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Tax Collected (MTD)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">VAT: {formatTND(vatMTD)}</div>
            <div className="text-sm">DC: {formatTND(dcMTD)}</div>
            <Separator className="my-2" />
            <Button variant="outline" size="sm">View report</Button>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Consignment (MTD)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatTND(consignmentsMTD)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline and low stock */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Pipeline (30d)</CardTitle><CardDescription>Order → Issue → Delivery → Invoice</CardDescription></CardHeader>
          <CardContent className="text-sm grid grid-cols-4 gap-2">
            <div>Orders<div className="text-xl font-semibold">{pipelineCounts.orders}</div></div>
            <div>Issues<div className="text-xl font-semibold">{pipelineCounts.issues}</div></div>
            <div>Deliveries<div className="text-xl font-semibold">{pipelineCounts.deliveries}</div></div>
            <div>Invoices<div className="text-xl font-semibold">{pipelineCounts.invoices}</div></div>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Low Stock Alerts</CardTitle><CardDescription>Below minimum stock</CardDescription></CardHeader>
          <CardContent>
            {lowStock.length ? (
              <ul className="text-sm space-y-2">
                {lowStock.map((a) => (
                  <li key={a.id} className="flex items-center justify-between">
                    <span>{a.code} — {a.designation}</span>
                    <span className="text-muted-foreground">{a.stock.onHand}/{a.stock.minStock}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No low stock — <Link to="/dashboard/orders/create?type=supplier" className="underline">Create supplier order</Link></div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overdue spotlight and quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Overdue Spotlight</CardTitle><CardDescription>Top 5 overdue invoices</CardDescription></CardHeader>
          <CardContent>
            {overdueList.length ? (
              <ul className="text-sm space-y-2">
                {overdueList.map((o) => (
                  <li key={o.id} className="flex items-center justify-between">
                    <Link to={`/dashboard/invoices/${o.id}`} className="underline">{o.number}</Link>
                    <span>{formatTND(o.amount)} · {o.days} days</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No overdue — <Link to="/dashboard/invoices" className="underline">Open invoices</Link></div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Quick Actions</CardTitle><CardDescription>Create documents</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={()=>navigate('/dashboard/invoices/create/standard')}>Create Invoice</Button>
            <Button size="sm" variant="secondary" onClick={()=>navigate('/dashboard/invoices/create/credit')}>Create Credit</Button>
            <Button size="sm" variant="secondary" onClick={()=>navigate('/dashboard/invoices/create/debit')}>Create Debit</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/dashboard/deliveries/create')}>Create Delivery</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/dashboard/issues/create')}>Create Issue</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/dashboard/orders/create?type=supplier')}>Create Supplier Order</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/dashboard/contacts/add')}>Add Contact</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/dashboard/articles/add')}>Add Article</Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>See full logs for details</CardDescription></CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">View <Link to="/dashboard/logs" className="underline">Logs</Link> for recent actions.
              Instrumentation can be added to stream actions here.</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend (real data, interactive) */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="shadow-none border border-border/40">
          <CardHeader><CardTitle>Sales Trend</CardTitle><CardDescription>Last 6 months (TTC)</CardDescription></CardHeader>
          <CardContent>
            <SalesBarChart
              data={(['Jan','Feb','Mar','Apr','May','Jun'] as string[]).map((m, idx) => ({
                label: m,
                value: scopedInvoices
                  .filter((i) => new Date(i.date).getMonth() === idx)
                  .reduce((s, i) => s + (i.totals.ttc ?? 0), 0),
                onClick: () => navigate('/dashboard/invoices'),
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}