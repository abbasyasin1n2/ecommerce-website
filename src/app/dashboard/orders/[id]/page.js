'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!params.id) return;
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${API_URL}/api/orders/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  const getStatusColor = (orderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[orderStatus] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (orderStatus) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle2,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle
    };
    const Icon = icons[orderStatus] || Clock;
    return <Icon className="h-5 w-5" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cod: 'Cash on Delivery',
      bkash: 'bKash',
      nagad: 'Nagad',
      card: 'Credit/Debit Card'
    };
    return methods[method] || method;
  };

  const orderTimeline = [
    { status: 'pending', label: 'Order Placed' },
    { status: 'confirmed', label: 'Order Confirmed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'delivered', label: 'Delivered' }
  ];

  const getTimelineProgress = () => {
    if (!order) return 0;
    if (order.status === 'cancelled') return -1;
    const statusIndex = orderTimeline.findIndex(t => t.status === order.status);
    return statusIndex;
  };

  if (status === 'loading' || loading) {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{error}</h3>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Container>
    );
  }

  if (!order) {
    return null;
  }

  const timelineProgress = getTimelineProgress();

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`ml-auto ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          {order.status !== 'cancelled' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="flex justify-between">
                    {orderTimeline.map((step, index) => {
                      const isCompleted = index <= timelineProgress;
                      const isCurrent = index === timelineProgress;
                      
                      return (
                        <div key={step.status} className="flex flex-col items-center flex-1">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center z-10
                            ${isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                            }
                            ${isCurrent ? 'ring-4 ring-green-200' : ''}
                          `}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-sm">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-8" />
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-green-500 -z-0 mx-8 transition-all duration-500"
                    style={{ width: `${Math.max(0, (timelineProgress / (orderTimeline.length - 1)) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">৳{item.price?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `৳${order.shipping?.toLocaleString()}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>৳{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress?.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress?.city}, {order.shippingAddress?.district}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress?.postalCode}
              </p>
              <Separator className="my-3" />
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {order.shippingAddress?.phone}
              </div>
              {order.shippingAddress?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {order.shippingAddress?.email}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            {order.status === 'pending' && (
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={async () => {
                  if (!confirm('Are you sure you want to cancel this order?')) return;
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                  try {
                    const response = await fetch(`${API_URL}/api/orders/${order._id}`, {
                      method: 'DELETE'
                    });
                    if (response.ok) {
                      toast.success('Order cancelled successfully');
                      router.push('/dashboard');
                    } else {
                      toast.error('Failed to cancel order');
                    }
                  } catch (err) {
                    console.error('Cancel error:', err);
                    toast.error('Failed to cancel order');
                  }
                }}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
