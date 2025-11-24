import { prisma } from "../lib/prisma.ts";
import { Request, Response } from "express";
import ZodSchemas, { TemplateType } from "src/lib/zodValidation.ts";

class ProductController {
  // add template
  public async addTemplate(req: Request, res: Response): Promise<void> {
    try {
      const data = ZodSchemas.TemplateSchema.safeParse(req.body);
      if (!data.success) {
        res.status(400).json({ message: "Invalid data", errors: data.error.issues });
        return;
      }
      const createTemplate = await prisma.tempelate.create({
        data: data.data
      });
      res.status(201).json({ message: "Template created successfully", template: createTemplate });

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const deletedTemplate = await prisma.tempelate.delete({
        where: { id }
      });
      res.status(200).json({ message: "Template deleted successfully", template: deletedTemplate });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateTempelate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const data = ZodSchemas.TemplateSchema.partial().safeParse(req.body) as unknown as { success: boolean; data: Partial<TemplateType>; error: any }
      if (!data.success) {
        res.status(400).json({ message: "Invalid data", errors: data.error.issues });
        return;
      }
      const updatedTemplate = await prisma.tempelate.update({
        where: { id },
        data: data.data
      });
      res.status(200).json({ message: "Template updated successfully", template: updatedTemplate });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getTemplateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const template = await prisma.tempelate.findUnique({
        where: { id }
      });
      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }
      res.status(200).json({ message: "Template retrieved successfully", template });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getAllTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await prisma.tempelate.findMany();
      res.status(200).json({ message: "All Templates retrieved successfully", templates });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

}

export default new ProductController();





// addtempelate
// deletetempelate
// updatetempelate
// gettempelatebyid
// getalltempelate