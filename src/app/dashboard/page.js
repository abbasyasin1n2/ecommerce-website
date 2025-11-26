'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Settings, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Plus,
  LayoutList
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch(
          `${API_URL}/api/orders/user/${encodeURIComponent(session.user.email)}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
          
          // Calculate stats
          const totalOrders = data.orders?.length || 0;
          const pendingOrders = data.orders?.filter(o => 
            ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
          ).length || 0;
          const completedOrders = data.orders?.filter(o => o.status === 'delivered').length || 0;
          const totalSpent = data.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
          
          setStats({ totalOrders, pendingOrders, completedOrders, totalSpent });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle2,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  const userInitials = session.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session.user?.image} alt={session.user?.name} />
            <AvatarFallback className="text-lg bg-orange-100 text-orange-600">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {session.user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/add-product">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Add Product</p>
                <p className="text-xs text-muted-foreground">Create new listing</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/manage-products">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LayoutList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Manage Products</p>
                <p className="text-xs text-muted-foreground">View & edit</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/orders">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">My Orders</p>
                <p className="text-xs text-muted-foreground">Track orders</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/wishlist">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="font-medium">Wishlist</p>
                <p className="text-xs text-muted-foreground">Saved items</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">৳{stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                          <p className="text-sm">
                            {order.items?.length || 0} item(s) • ৳{order.total?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/orders/${order._id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user?.image} alt={session.user?.name} />
                  <AvatarFallback className="text-xl bg-orange-100 text-orange-600">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{session.user?.name}</h3>
                  <p className="text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="p-3 bg-muted rounded-lg">{session.user?.name || 'Not set'}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="p-3 bg-muted rounded-lg">{session.user?.email}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Saved Addresses
                </h4>
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No saved addresses yet</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Add Address
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your orders and promotions
                  </p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password & Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your password and security settings
                  </p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Connected Accounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage connected social accounts
                  </p>
                </div>
                <Badge variant="outline">Google Connected</Badge>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}

