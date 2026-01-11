import React from "react";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Globe,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

// Dummy data
const stats = [
  {
    title: "Total Bookings",
    value: "1,248",
    change: "+12%",
    isPositive: true,
    icon: Package,
    color: "bg-blue-500"
  },
  {
    title: "Active Customers",
    value: "843",
    change: "+8%",
    isPositive: true,
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Revenue",
    value: "$124,580",
    change: "+23%",
    isPositive: true,
    icon: DollarSign,
    color: "bg-purple-500"
  },
  {
    title: "Satisfaction",
    value: "4.8",
    change: "+0.3",
    isPositive: true,
    icon: Star,
    color: "bg-yellow-500"
  },
];

const recentBookings = [
  {
    id: 1,
    customer: "John Smith",
    destination: "Dubai",
    package: "Premium Desert Safari",
    amount: "$2,499",
    status: "confirmed",
    date: "2024-03-15",
    avatar: "JS"
  },
  {
    id: 2,
    customer: "Emma Wilson",
    destination: "Turkey",
    package: "Cappadocia Hot Air Balloon",
    amount: "$1,899",
    status: "pending",
    date: "2024-03-14",
    avatar: "EW"
  },
  {
    id: 3,
    customer: "Robert Chen",
    destination: "Greece",
    package: "Santorini Luxury Getaway",
    amount: "$3,299",
    status: "confirmed",
    date: "2024-03-13",
    avatar: "RC"
  },
  {
    id: 4,
    customer: "Sarah Johnson",
    destination: "Thailand",
    package: "Phuket Island Hopping",
    amount: "$1,599",
    status: "cancelled",
    date: "2024-03-12",
    avatar: "SJ"
  },
  {
    id: 5,
    customer: "Michael Brown",
    destination: "Indonesia",
    package: "Bali Cultural Retreat",
    amount: "$2,199",
    status: "confirmed",
    date: "2024-03-11",
    avatar: "MB"
  },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 81000 },
  { month: 'Mar', revenue: 92000 },
  { month: 'Apr', revenue: 78000 },
  { month: 'May', revenue: 105000 },
  { month: 'Jun', revenue: 124580 },
];

const destinationStats = [
  { name: 'Dubai', value: 35, color: '#0088FE' },
  { name: 'Turkey', value: 25, color: '#00C49F' },
  { name: 'Greece', value: 20, color: '#FFBB28' },
  { name: 'Thailand', value: 15, color: '#FF8042' },
  { name: 'Indonesia', value: 5, color: '#8884D8' },
];

const upcomingTours = [
  { id: 1, tour: "Dubai Desert Safari", date: "Mar 20, 2024", seats: 8, status: "almost_full" },
  { id: 2, tour: "Santorini Sunset Cruise", date: "Mar 22, 2024", seats: 15, status: "available" },
  { id: 3, tour: "Cappadocia Hot Air Balloon", date: "Mar 25, 2024", seats: 3, status: "limited" },
  { id: 4, tour: "Phuket Island Tour", date: "Mar 28, 2024", seats: 12, status: "available" },
  { id: 5, tour: "Bali Waterfall Trek", date: "Mar 30, 2024", seats: 20, status: "available" },
];

const Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTourStatusColor = (status: string) => {
    switch (status) {
      case 'almost_full': return 'bg-orange-100 text-orange-800';
      case 'limited': return 'bg-red-100 text-red-800';
      case 'available': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your travel business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <Button className="bg-accent hover:bg-accent/90">
            <Eye className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      {stat.isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinationStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {destinationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Upcoming Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{booking.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{booking.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        {booking.destination}
                      </div>
                    </TableCell>
                    <TableCell>{booking.package}</TableCell>
                    <TableCell className="font-medium">{booking.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{booking.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Tours */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{tour.tour}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{tour.date}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Available seats:</span>
                        <span className="font-medium">{tour.seats}</span>
                      </div>
                      <Progress value={100 - (tour.seats / 20 * 100)} className="mt-1" />
                    </div>
                  </div>
                  <Badge className={getTourStatusColor(tour.status)}>
                    {tour.status === 'almost_full' ? 'Almost Full' :
                      tour.status === 'limited' ? 'Limited' : 'Available'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              <Eye className="mr-2 h-4 w-4" />
              View All Tours
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Dubai</h3>
                <p className="text-gray-600">350 bookings this month</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+18% growth</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">$2,450</h3>
                <p className="text-gray-600">Per customer booking</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12% increase</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">4.8/5.0</h3>
                <p className="text-gray-600">Based on 842 reviews</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Response time: 2h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;