"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, ArrowLeft, Plus, DollarSign, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: string;
  createdAt: string;
}

interface TemplateDetail {
  id: string;
  tempelateId: string;
  header: string;
  headerSubtitle: string;
  features: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateDetail, setTemplateDetail] = useState<TemplateDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/templates/get-all-templates`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        toast.error("Failed to fetch templates");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateDetails = async (templateId: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/template-details/get-by-template/${templateId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTemplateDetail(data.templateDetails);
      } else {
        setTemplateDetail(null);
        toast.info("No details found for this template");
      }
    } catch {
      toast.error("Failed to load template details");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleViewDetails = (template: Template) => {
    setSelectedTemplate(template);
    setDetailsOpen(true);
    fetchTemplateDetails(template.id);
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Templates</h1>
              <p className="text-slate-400 mt-1">Browse and manage all templates</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800 text-white"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <Skeleton className="h-48 w-full bg-slate-800 rounded-md mb-4" />
                  <Skeleton className="h-6 w-3/4 bg-slate-800" />
                  <Skeleton className="h-4 w-full bg-slate-800 mt-2" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-9 w-full bg-slate-800" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full bg-slate-800 rounded-t-lg overflow-hidden">
                    {template.thumbnailUrl ? (
                      <Image
                      width={400}
                      height={300}
                        src={template.thumbnailUrl}
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-white text-lg mb-2">{template.title}</CardTitle>
                  <CardDescription className="text-slate-400 line-clamp-2 mb-3">
                    {template.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold flex items-center">
                      <DollarSign className="w-4 h-4" />
                      {template.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive === "ACTIVE"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {template.isActive}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(template)}
                    className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Template Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{selectedTemplate?.title}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-6 w-1/4 bg-slate-800" />
              <Skeleton className="h-20 w-full bg-slate-800" />
              <Skeleton className="h-6 w-1/4 bg-slate-800" />
              <Skeleton className="h-20 w-full bg-slate-800" />
            </div>
          ) : templateDetail ? (
            <div className="space-y-6 py-4">
              {/* Header Section */}
              <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-xl font-bold text-white mb-1">{templateDetail.header}</h3>
                <p className="text-slate-300">{templateDetail.headerSubtitle}</p>
              </div>

              {/* Features */}
              {templateDetail.features && templateDetail.features.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded"></span>
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {templateDetail.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {templateDetail.benefits && templateDetail.benefits.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-500 rounded"></span>
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {templateDetail.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-purple-400 mt-1">★</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Info */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-lg">Price:</span>
                  <span className="text-3xl font-bold text-green-400 flex items-center">
                    <DollarSign className="w-6 h-6" />
                    {selectedTemplate?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p>No detailed information available for this template.</p>
              <p className="text-sm mt-2">Template details can be added from the dashboard.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
