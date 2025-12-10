"use client";

import { useState } from "react";
import { BadgeCheckIcon, FileText, Trash2, Edit, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ItemDemo() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: "addTemplate" | "removeTemplate" | "updateTemplate" | "userManagement" | null;
  }>({ open: false, type: null });
  
  const [templateForm, setTemplateForm] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    thumbnailUrl: "",
  });

  const [templateDetailForm, setTemplateDetailForm] = useState({
    header: "",
    headerSubtitle: "",
    features: [""],
    benefits: [""],
  });

  const handleAddTemplate = async () => {
    try {
      // First create the template
      const templateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/template/add-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: templateForm.title,
          description: templateForm.description,
          price: parseFloat(templateForm.price),
          imageUrl: templateForm.imageUrl,
          thumbnailUrl: templateForm.thumbnailUrl,
          isActive: "ACTIVE"
        }),
      });
      
      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        const templateId = templateData.template.id;

        // Then add template details
        const detailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/template-details/add/${templateId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            header: templateDetailForm.header,
            headerSubtitle: templateDetailForm.headerSubtitle,
            features: templateDetailForm.features.filter(f => f.trim() !== ""),
            benefits: templateDetailForm.benefits.filter(b => b.trim() !== ""),
          }),
        });

        if (detailsResponse.ok) {
          toast.success("Template and details added successfully!");
          setDialogState({ open: false, type: null });
          setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
          setTemplateDetailForm({ header: "", headerSubtitle: "", features: [""], benefits: [""] });
        } else {
          toast.warning("Template added but failed to add details");
        }
      } else {
        const error = await templateResponse.json();
        toast.error(error.message || "Failed to add template");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleRemoveTemplate = async () => {
    if (!templateForm.id) {
      toast.error("Please enter template ID");
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/template/delete-template/${templateForm.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (response.ok) {
        toast.success("Template removed successfully!");
        setDialogState({ open: false, type: null });
        setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove template");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!templateForm.id) {
      toast.error("Please enter template ID");
      return;
    }
    
    try {
      const updateData: {
        title?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        thumbnailUrl?: string;
      } = {};
      if (templateForm.title) updateData.title = templateForm.title;
      if (templateForm.description) updateData.description = templateForm.description;
      if (templateForm.price) updateData.price = parseFloat(templateForm.price);
      if (templateForm.imageUrl) updateData.imageUrl = templateForm.imageUrl;
      if (templateForm.thumbnailUrl) updateData.thumbnailUrl = templateForm.thumbnailUrl;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/template/update-template/${templateForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        toast.success("Template updated successfully!");
        setDialogState({ open: false, type: null });
        setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update template");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-md">
            <BadgeCheckIcon className="size-5 text-white" />
            <span className="text-sm font-medium text-white">Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle className="text-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Add Template
              </ItemTitle>
              <ItemDescription>Create a new template in the system.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
                  setDialogState({ open: true, type: "addTemplate" });
                }}
              >
                Add
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle className="text-gray-100 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Remove Template
              </ItemTitle>
              <ItemDescription>Delete a template from the system.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
                  setDialogState({ open: true, type: "removeTemplate" });
                }}
              >
                Remove
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle className="text-gray-100 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Update Template
              </ItemTitle>
              <ItemDescription>Modify an existing template.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setTemplateForm({ id: "", title: "", description: "", price: "", imageUrl: "", thumbnailUrl: "" });
                  setDialogState({ open: true, type: "updateTemplate" });
                }}
              >
                Update
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle className="text-gray-100 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                View Templates
              </ItemTitle>
              <ItemDescription>Browse all templates and details.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => window.location.href = "/templates"}
              >
                View All
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle className="text-gray-100 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </ItemTitle>
              <ItemDescription>View and manage all users.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = "/users"}
              >
                Manage
              </Button>
            </ItemActions>
          </Item>
        </div>
      </div>

      {/* Add Template Dialog */}
      <Dialog open={dialogState.open && dialogState.type === "addTemplate"} onOpenChange={(open) => !open && setDialogState({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Template</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in the template and details information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Template Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white border-b border-slate-700 pb-2">Template Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter template title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-white">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={templateForm.price}
                  onChange={(e) => setTemplateForm({ ...templateForm, price: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl" className="text-white">Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={templateForm.imageUrl}
                  onChange={(e) => setTemplateForm({ ...templateForm, imageUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnailUrl" className="text-white">Thumbnail URL *</Label>
                <Input
                  id="thumbnailUrl"
                  value={templateForm.thumbnailUrl}
                  onChange={(e) => setTemplateForm({ ...templateForm, thumbnailUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Template Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white border-b border-slate-700 pb-2">Template Details</h3>
              <div className="grid gap-2">
                <Label htmlFor="header" className="text-white">Header *</Label>
                <Input
                  id="header"
                  value={templateDetailForm.header}
                  onChange={(e) => setTemplateDetailForm({ ...templateDetailForm, header: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Main header text"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="headerSubtitle" className="text-white">Header Subtitle *</Label>
                <Input
                  id="headerSubtitle"
                  value={templateDetailForm.headerSubtitle}
                  onChange={(e) => setTemplateDetailForm({ ...templateDetailForm, headerSubtitle: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Subtitle or tagline"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Features</Label>
                {templateDetailForm.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...templateDetailForm.features];
                        newFeatures[idx] = e.target.value;
                        setTemplateDetailForm({ ...templateDetailForm, features: newFeatures });
                      }}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder={`Feature ${idx + 1}`}
                    />
                    {idx === templateDetailForm.features.length - 1 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setTemplateDetailForm({ ...templateDetailForm, features: [...templateDetailForm.features, ""] })}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Benefits</Label>
                {templateDetailForm.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...templateDetailForm.benefits];
                        newBenefits[idx] = e.target.value;
                        setTemplateDetailForm({ ...templateDetailForm, benefits: newBenefits });
                      }}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder={`Benefit ${idx + 1}`}
                    />
                    {idx === templateDetailForm.benefits.length - 1 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setTemplateDetailForm({ ...templateDetailForm, benefits: [...templateDetailForm.benefits, ""] })}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTemplate} className="bg-blue-600 hover:bg-blue-700">
              Create Template with Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Template Dialog */}
      <Dialog open={dialogState.open && dialogState.type === "removeTemplate"} onOpenChange={(open) => !open && setDialogState({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Remove Template</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter the template ID to remove it permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="templateId" className="text-white">Template ID</Label>
              <Input
                id="templateId"
                value={templateForm.id}
                onChange={(e) => setTemplateForm({ ...templateForm, id: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter template ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRemoveTemplate} variant="destructive">
              Remove Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Template Dialog */}
      <Dialog open={dialogState.open && dialogState.type === "updateTemplate"} onOpenChange={(open) => !open && setDialogState({ open: false, type: null })}>
        <DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Update Template</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter template ID and the fields you want to update.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="updateTemplateId" className="text-white">Template ID *</Label>
              <Input
                id="updateTemplateId"
                value={templateForm.id}
                onChange={(e) => setTemplateForm({ ...templateForm, id: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Required"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateTitle" className="text-white">Title (optional)</Label>
              <Input
                id="updateTitle"
                value={templateForm.title}
                onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateDescription" className="text-white">Description (optional)</Label>
              <Textarea
                id="updateDescription"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updatePrice" className="text-white">Price (optional)</Label>
              <Input
                id="updatePrice"
                type="number"
                value={templateForm.price}
                onChange={(e) => setTemplateForm({ ...templateForm, price: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateImageUrl" className="text-white">Image URL (optional)</Label>
              <Input
                id="updateImageUrl"
                value={templateForm.imageUrl}
                onChange={(e) => setTemplateForm({ ...templateForm, imageUrl: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="updateThumbnailUrl" className="text-white">Thumbnail URL (optional)</Label>
              <Input
                id="updateThumbnailUrl"
                value={templateForm.thumbnailUrl}
                onChange={(e) => setTemplateForm({ ...templateForm, thumbnailUrl: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateTemplate} className="bg-blue-600 hover:bg-blue-700">
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

