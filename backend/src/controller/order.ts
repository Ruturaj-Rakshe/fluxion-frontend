import { prisma } from "../lib/prisma.ts";
import ZodSchemas from "../lib/zodValidation.ts";
import { Request, Response } from "express";

class OrderController {

  // Create order from cart (checkout)
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const validation = ZodSchemas.CreateOrderSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const { paymentId, paymentRef } = validation.data;

      if(!paymentId || !paymentRef) {
        res.status(400).json({ message: "Payment information is required" });
        return;
      }
      // Get all cart items
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          tempelate: {
            select: {
              id: true,
              title: true,
              price: true,
              isActive: true
            }
          },
          tempelateDetail: {
            select: {
              id: true,
              tempelateId: true
            }
          }
        }
      });

      if (cartItems.length === 0) {
        res.status(400).json({ message: "Cart is empty" });
        return;
      }

      // Validate template details still exist if specified
      const invalidItems = cartItems.filter(item => {
        if (item.tempelateDetailId && !item.tempelateDetail) return true;
        if (item.tempelateDetail && item.tempelateDetail.tempelateId !== item.tempelateId) return true;
        return false;
      });

      if (invalidItems.length > 0) {
        res.status(400).json({ 
          message: "Some cart items have invalid configurations",
          details: "Please remove and re-add these items to your cart"
        });
        return;
      }

      // Validate all templates are active
      const inactiveItems = cartItems.filter(item => item.tempelate.isActive !== "ACTIVE");
      if (inactiveItems.length > 0) {
        res.status(400).json({
          message: "Some items are no longer available",
          inactiveItems: inactiveItems.map(item => item.tempelate.title)
        });
        return;
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) =>
        sum + (item.tempelate.price * item.quantity), 0
      );

      // Create order with order items in transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId,
            total,
            status: "PENDING",
            paymentId,
            paymentRef
          }
        });

        // Create order items from cart
        await tx.orderItem.createMany({
          data: cartItems.map(cartItem => ({
            orderId: newOrder.id,
            tempelateId: cartItem.tempelateId,
            tempelateDetailId: cartItem.tempelateDetailId,
            quantity: cartItem.quantity,
            price: cartItem.tempelate.price
          }))
        });

        // Clear user's cart
        await tx.cart.deleteMany({
          where: { userId }
        });

        return newOrder;
      });

      res.status(201).json({
        message: "Order created successfully",
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          note: "Payment processing to be implemented"
        }
      });

    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "An error occurred while creating order" });
    }
  }

  // Get all orders for current user
  async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              tempelate: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true
                }
              },
              tempelateDetail: {
                select: {
                  id: true,
                  header: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        message: "Orders fetched successfully",
        orders: orders.map(order => ({
          id: order.id,
          total: order.total,
          status: order.status,
          itemCount: order.orderItems.length,
          items: order.orderItems.map(item => ({
            template: item.tempelate.title,
            model: item.tempelateDetail?.header || null,
            quantity: item.quantity,
            price: item.price
          })),
          createdAt: order.createdAt
        }))
      });

    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "An error occurred while fetching orders" });
    }
  }

  // Get single order details
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!orderId) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              tempelate: true,
              tempelateDetail: true
            }
          }
        }
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.userId !== userId) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      res.status(200).json({
        message: "Order fetched successfully",
        order
      });

    } catch (error: any) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  }

  // Cancel order
  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
        if (!orderId) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.userId !== userId) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      if (order.status === "COMPLETED") {
        res.status(400).json({ message: "Cannot cancel completed order" });
        return;
      }

      if (order.status === "CANCELLED") {
        res.status(400).json({ message: "Order already cancelled" });
        return;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" }
      });

      res.status(200).json({
        message: "Order cancelled successfully",
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status
        }
      });

    } catch (error: any) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  }

  // Update order status (admin/webhook)
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
        if (!orderId) {
        res.status(400).json({ message: "Order ID is required" });
        return;
        }

      const validation = ZodSchemas.UpdateOrderStatusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const { status } = validation.data;

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });

      res.status(200).json({
        message: "Order status updated",
        order: updatedOrder
      });

    } catch (error: any) {
      console.error("Error updating order:", error);
      
      if (error.code === "P2025") {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.status(500).json({ message: "An error occurred" });
    }
  }

  // Get order by payment ID (for webhook verification)
  async getOrderByPaymentId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { paymentId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!paymentId) {
        res.status(400).json({ message: "Payment ID is required" });
        return;
      }

      const order = await prisma.order.findFirst({
        where: {
          paymentId,
          userId
        },
        include: {
          orderItems: {
            include: {
              tempelate: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                  price: true
                }
              },
              tempelateDetail: true
            }
          }
        }
      });

      if (!order) {
        res.status(404).json({ message: "Order not found", order: null });
        return;
      }

      res.status(200).json({
        message: "Order found",
        order
      });

    } catch (error: any) {
      console.error("Error fetching order by payment ID:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
}

export default new OrderController();

