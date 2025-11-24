import { prisma } from "../lib/prisma.ts";
import { Request, Response } from "express";
import ZodSchemas from "../lib/zodValidation.ts";

class CartController {

  // Get all cart items for current user
  async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          tempelate: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              imageUrl: true,
              thumbnailUrl: true,
              isActive: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calculate totals
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartItems.reduce((sum, item) =>
        sum + (item.tempelate.price * item.quantity), 0
      );

      res.status(200).json({
        message: "Cart fetched successfully",
        cart: cartItems,
        summary: {
          totalItems,
          totalPrice,
          itemCount: cartItems.length
        }
      });
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "An error occurred while fetching cart" });
    }
  }

  // Add template to cart or update quantity if exists
  async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const validation = ZodSchemas.CartSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const { tempelateId, quantity } = validation.data;

      // Check if template exists and is active
      const template = await prisma.tempelate.findUnique({
        where: { id: tempelateId }
      });

      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }

      if (template.isActive !== "ACTIVE") {
        res.status(400).json({ message: "Template is not available" });
        return;
      }

      // Check if item already in cart
      const existingCartItem = await prisma.cart.findUnique({
        where: {
          userId_tempelateId: {
            userId,
            tempelateId
          }
        }
      });

      let cartItem;

      if (existingCartItem) {
        // Calculate new quantity
        const newQuantity = existingCartItem.quantity + quantity;

        // Check max limit (from Zod CartSchema)
        if (newQuantity > 100) {
          res.status(400).json({
            message: `Cannot add ${quantity} items. Maximum 100 per template. Current: ${existingCartItem.quantity}`
          });
          return;
        }

        // Update quantity (add to existing)
        cartItem = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: newQuantity
          },
          include: {
            tempelate: {
              select: {
                id: true,
                title: true,
                price: true,
                thumbnailUrl: true
              }
            }
          }
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cart.create({
          data: {
            userId,
            tempelateId,
            quantity
          },
          include: {
            tempelate: {
              select: {
                id: true,
                title: true,
                price: true,
                thumbnailUrl: true
              }
            }
          }
        });
      }

      res.status(existingCartItem ? 200 : 201).json({
        message: existingCartItem ? "Cart item updated" : "Template added to cart",
        cartItem
      });

    } catch (error: any) {
      console.error("Error adding to cart:", error);

      if (error.code === "P2002") {
        res.status(400).json({ message: "Item already in cart" });
        return;
      }

      res.status(500).json({ message: "An error occurred while adding to cart" });
    }
  }

  // Update cart item quantity
  async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { tempelateId } = req.params;

      if (!tempelateId) {
        res.status(400).json({ message: "tempelateId is required" });
        return;
      }

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const validation = ZodSchemas.CartSchema.partial().safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const { quantity } = validation.data;

      if (quantity === undefined) {
        res.status(400).json({ message: "Quantity is required" });
        return;
      }

      const cartItem = await prisma.cart.update({
        where: {
          userId_tempelateId: {
            userId,
            tempelateId
          }
        },
        data: { quantity },
        include: {
          tempelate: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      });

      res.status(200).json({
        message: "Cart item updated successfully",
        cartItem
      });

    } catch (error: any) {
      console.error("Error updating cart item:", error);

      if (error.code === "P2025") {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      res.status(500).json({ message: "An error occurred while updating cart" });
    }
  }

  // Remove specific template from cart
  async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { tempelateId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!tempelateId) {
        res.status(400).json({ message: "tempelateId is required" });
        return;
      }

      await prisma.cart.delete({
        where: {
          userId_tempelateId: {
            userId,
            tempelateId
          }
        }
      });

      res.status(200).json({ message: "Item removed from cart" });

    } catch (error: any) {
      console.error("Error removing from cart:", error);

      if (error.code === "P2025") {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      res.status(500).json({ message: "An error occurred while removing from cart" });
    }
  }

  // Clear entire cart for user
  async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const deletedCount = await prisma.cart.deleteMany({
        where: { userId }
      });

      res.status(200).json({
        message: "Cart cleared successfully",
        deletedItems: deletedCount.count
      });

    } catch (error: any) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "An error occurred while clearing cart" });
    }
  }

  // Checkout cart (placeholder - implement order creation later)
  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

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
          }
        }
      });

      if (cartItems.length === 0) {
        res.status(400).json({ message: "Cart is empty" });
        return;
      }

      // Validate all templates are still active
      const inactiveItems = cartItems.filter(item => item.tempelate.isActive !== "ACTIVE");
      if (inactiveItems.length > 0) {
        res.status(400).json({
          message: "Some items are no longer available",
          inactiveItems: inactiveItems.map(item => item.tempelate.title)
        });
        return;
      }

      // Calculate total
      const totalPrice = cartItems.reduce((sum, item) =>
        sum + (item.tempelate.price * item.quantity), 0
      );

      // TODO: Create Order, process payment, clear cart
      // For now, return checkout summary
      res.status(200).json({
        message: "Checkout summary (order creation not implemented)",
        items: cartItems.map(item => ({
          templateId: item.tempelateId ?? "",
          title: item.tempelate.title,
          quantity: item.quantity,
          unitPrice: item.tempelate.price,
          subtotal: item.tempelate.price * item.quantity
        })),
        totalPrice,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        note: "Payment processing and order creation to be implemented"
      });

    } catch (error: any) {
      console.error("Error during checkout:", error);
      res.status(500).json({ message: "An error occurred during checkout" });
    }
  }
}

export default new CartController();

// checkOut
