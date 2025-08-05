import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity,
  Eye,
  Target,
  Zap,
  Calendar
} from 'lucide-react';

// Dummy data
const revenueData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 2000, profit: 9800 },
  { month: 'Apr', revenue: 2780, profit: 3908 },
  { month: 'May', revenue: 1890, profit: 4800 },
  { month: 'Jun', revenue: 2390, profit: 3800 },
  { month: 'Jul', revenue: 3490, profit: 4300 },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1900 },
  { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 2100 },
  { month: 'May', users: 2800 },
  { month: 'Jun', users: 3200 },
  { month: 'Jul', users: 3800 },
];

const categoryData = [
  { name: 'Technology', value: 400, color: '#0088FE' },
  { name: 'Fashion', value: 300, color: '#00C49F' },
  { name: 'Food', value: 300, color: '#FFBB28' },
  { name: 'Travel', value: 200, color: '#FF8042' },
];

const dailyActivityData = [
  { day: 'Mon', orders: 65, views: 120 },
  { day: 'Tue', orders: 59, views: 110 },
  { day: 'Wed', orders: 80, views: 140 },
  { day: 'Thu', orders: 81, views: 160 },
  { day: 'Fri', orders: 56, views: 180 },
  { day: 'Sat', orders: 55, views: 190 },
  { day: 'Sun', orders: 40, views: 130 },
];

const StatCard = ({ title, value, change, changeType, icon: Icon, description }: { title: string, value: string, change: string, changeType: 'positive' | 'negative', icon: React.ComponentType, description: string }) => (

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">
        <Icon />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        {changeType === 'positive' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
          {change}
        </span>
        <span>{description}</span>
      </div>
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Last 30 days</span>
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          change="+20.1%"
          changeType="positive"
          icon={DollarSign}
          description="from last month"
        />
        <StatCard
          title="Active Users"
          value="2,350"
          change="+180.1%"
          changeType="positive"
          icon={Users}
          description="from last month"
        />
        <StatCard
          title="Total Orders"
          value="12,234"
          change="+19%"
          changeType="positive"
          icon={ShoppingCart}
          description="from last month"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="-4.3%"
          changeType="negative"
          icon={Target}
          description="from last month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue Overview</span>
            </CardTitle>
            <CardDescription>
              Monthly revenue and profit trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Growth</span>
            </CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Sales by Category</span>
            </CardTitle>
            <CardDescription>
              Distribution of sales across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${(entry.percent ?? 0 * 100).toFixed(0)}%`}

                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Daily Activity</span>
            </CardTitle>
            <CardDescription>
              Orders and page views this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                <Bar dataKey="views" fill="#82ca9d" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Server Response Time</span>
                <span>245ms</span>
              </div>
              <Progress value={75} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span>4.8/5</span>
              </div>
              <Progress value={96} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Task Completion Rate</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>System Uptime</span>
                <span>99.9%</span>
              </div>
              <Progress value={99.9} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New order placed", user: "John Doe", time: "2 minutes ago", amount: "$299.00" },
              { action: "Payment received", user: "Jane Smith", time: "5 minutes ago", amount: "$150.00" },
              { action: "User registered", user: "Mike Johnson", time: "12 minutes ago", amount: null },
              { action: "Product review", user: "Sarah Wilson", time: "18 minutes ago", amount: "⭐⭐⭐⭐⭐" },
              { action: "Subscription renewed", user: "David Brown", time: "25 minutes ago", amount: "$29.99" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
                {activity.amount && (
                  <Badge variant="outline">{activity.amount}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;