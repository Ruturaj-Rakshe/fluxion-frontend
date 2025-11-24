import ZodSchemas from 'src/lib/zodValidation.ts';
import { prisma } from '../lib/prisma.ts';
import { Request, Response } from "express";
import xss from "xss";

class TempelateDetailsController {

  // Get template details by template ID (one-to-one relation)
  public async getTemplateDetails(req: Request, res: Response): Promise<void> {
    try {
      const { tempelateId } = req.params as { tempelateId: string };

      const templateDetails = await prisma.tempelateDetail.findUnique({
        where: { tempelateId },
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

      if (!templateDetails) {
        res.status(404).json({ message: "Template details not found" });
        return;
      }

      res.status(200).json({
        message: "Template details fetched successfully",
        templateDetails
      });
    } catch (error: any) {
      console.error("Error fetching template details:", error);
      res.status(500).json({ message: "An error occurred while fetching template details" });
    }
  }

  // Add template detail (admin only - apply isAdmin middleware in route)
  public async addTemplateDetail(req: Request, res: Response): Promise<void> {
    try {
      const { tempelateId } = req.params as { tempelateId: string };

      // Check if template exists
      const template = await prisma.tempelate.findUnique({
        where: { id: tempelateId }
      });

      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }

      // Check if detail already exists
      const existingDetail = await prisma.tempelateDetail.findUnique({
        where: { tempelateId }
      });

      if (existingDetail) {
        res.status(400).json({
          message: "Template details already exist. Use update instead."
        });
        return;
      }

      const validation = ZodSchemas.TemplateDetailSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const data = validation.data;

      // Sanitize string arrays to prevent XSS
      const sanitizedData = {
        ...data,
        header: xss(data.header),
        headerSubtitle: xss(data.headerSubtitle),
        features: data.features.map(f => xss(f)),
        benefits: data.benefits.map(b => xss(b)),
        tempelateId
      };

      const newTemplateDetail = await prisma.tempelateDetail.create({
        data: sanitizedData
      });

      res.status(201).json({
        message: "Template detail added successfully",
        templateDetail: newTemplateDetail
      });

    } catch (error: any) {
      console.error("Error adding template detail:", error);

      if (error.code === "P2002") {
        res.status(400).json({
          message: "Template details already exist for this template"
        });
        return;
      }

      res.status(500).json({
        message: "An error occurred while adding template details"
      });
    }
  }

  // Update template detail (admin only)
  public async updateTemplateDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };

      const validation = ZodSchemas.TemplateDetailSchema.partial().safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.issues
        });
        return;
      }

      const data = validation.data;

      if (Object.keys(data).length === 0) {
        res.status(400).json({ message: "No valid fields to update" });
        return;
      }

      // Sanitize inputs
      const sanitizedData: any = {};
      if (data.header) sanitizedData.header = xss(data.header);
      if (data.headerSubtitle) sanitizedData.headerSubtitle = xss(data.headerSubtitle);
      if (data.features) sanitizedData.features = data.features.map(f => xss(f));
      if (data.benefits) sanitizedData.benefits = data.benefits.map(b => xss(b));

      const updatedTemplateDetail = await prisma.tempelateDetail.update({
        where: { id },
        data: sanitizedData
      });

      res.status(200).json({
        message: "Template detail updated successfully",
        templateDetail: updatedTemplateDetail
      });

    } catch (error: any) {
      console.error("Error updating template detail:", error);

      if (error.code === "P2025") {
        res.status(404).json({ message: "Template details not found" });
        return;
      }

      res.status(500).json({
        message: "An error occurred while updating template details"
      });
    }
  }

  // Delete template detail (admin only)
  public async deleteTemplateDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };

      await prisma.tempelateDetail.delete({
        where: { id }
      });

      res.status(200).json({ message: "Template detail deleted successfully" });

    } catch (error: any) {
      console.error("Error deleting template detail:", error);

      if (error.code === "P2025") {
        res.status(404).json({ message: "Template details not found" });
        return;
      }

      res.status(500).json({
        message: "An error occurred while deleting template details"
      });
    }
  }

  // List all template details with pagination (public or admin)
  public async listTemplateDetails(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const skip = (page - 1) * limit;

      const [templateDetails, total] = await Promise.all([
        prisma.tempelateDetail.findMany({
          skip,
          take: limit,
          include: {
            tempelate: {
              select: {
                id: true,
                title: true,
                price: true,
                isActive: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.tempelateDetail.count()
      ]);

      res.status(200).json({
        message: "Template details fetched successfully",
        templateDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + templateDetails.length < total
        }
      });

    } catch (error: any) {
      console.error("Error listing template details:", error);
      res.status(500).json({
        message: "An error occurred while fetching template details"
      });
    }
  }
}

export default new TempelateDetailsController();