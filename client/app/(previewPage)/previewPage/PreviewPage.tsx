"use client";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbarr";
import FigmaEmbed from "@/components/ui/iphoneMockup";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { templateAPI, templateDetailAPI} from "@/lib/api";
import { Template, TemplateDetail } from "@/lib/index";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("id");
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [templateDetail, setTemplateDetail] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    async function fetchTemplateData() {
      if (!templateId) {
        setError("No template ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch both template and template details
        const [templateRes, detailRes] = await Promise.all([
          templateAPI.getTemplateById(templateId),
          templateDetailAPI.getTemplateDetailByTemplateId(templateId).catch(() => null)
        ]);

        if (templateRes.template) {
          setTemplate(templateRes.template);
        }

        if (detailRes?.templateDetails) {
          setTemplateDetail(detailRes.templateDetails);
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError("Failed to load template. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplateData();
  }, [templateId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (!templateId) return;

    try {
      setAddingToCart(true);
      await addToCart(templateId, 1);
      alert("Added to cart successfully!");
    } catch (err: unknown) {
      console.error("Error adding to cart:", err);
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        alert((err.response as { data: { message?: string } }).data.message || "Failed to add to cart");
      } else {
        alert("Failed to add to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (!templateId) return;

    try {
      setBuyingNow(true);
      await addToCart(templateId, 1);
      router.push("/cartPage");
    } catch (err: unknown) {
      console.error("Error adding to cart:", err);
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        alert((err.response as { data: { message?: string } }).data.message || "Failed to add to cart");
      } else {
        alert("Failed to add to cart");
      }
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) {
    return (

      <div className="bg-black min-h-screen overflow-x-hidden">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-16 pt-24">
          {/* Left Content Skeleton */}
          <div className="mt-20 lg:mt-36 space-y-8">
            <Skeleton className="h-12 lg:h-16 w-3/4 mx-auto lg:mx-0" />
            
            <div className="py-10 lg:py-20 space-y-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="flex justify-center items-center py-10 lg:py-20">
            <div className="w-full max-w-md space-y-4">
              <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || "Template not found"}</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-dvh overflow-x-hidden">
      {/* <Navbar /> */}

      <div className="min-h-screen  grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-16">
        {/* Left Content */}
        <div className="mt-20 lg:mt-36">
          <h1 className="font-extrabold text-white text-3xl lg:text-5xl leading-tight bbh-sans-bartle text-center lg:text-left">
            {templateDetail?.header || template.title}
          </h1>

          <div className="py-10 lg:py-20 max-w-3xl mx-auto space-y-6 text-center lg:text-left">
            <p className="text-base lg:text-lg text-white leading-relaxed">
              {templateDetail?.headerSubtitle || template.description}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="px-8 py-3 bg-linear-to-r from-zinc-900 via-black to-zinc-900 text-white font-semibold rounded-lg hover:from-zinc-800 hover:via-zinc-900 hover:to-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20"
              >
                {buyingNow ? "Buying..." : `Buy Now: $${template.price}`}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {templateDetail?.features && templateDetail.features.length > 0 && (
              <div className="space-y-4 text-left text-white">
                <h2 className="text-lg lg:text-xl font-bold">
                  Features:
                </h2>
                <ol className="list-disc pl-6 space-y-2">
                  {templateDetail.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ol>
              </div>
            )}

            {templateDetail?.benefits && templateDetail.benefits.length > 0 && (
              <div className="space-y-4 text-left text-white">
                <h2 className="text-lg lg:text-xl font-bold">
                  Benefits:
                </h2>
                <ol className="list-disc pl-6 space-y-2">
                  {templateDetail.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Figma Embed) */}
        <div className="mt-12 lg:mt-0 flex justify-center items-center">
          <FigmaEmbed src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/jYREOgJvzwciYhyAg2A0qO/Untitled?page-id=0%3A1&node-id=29-2&p=f&viewport=1612%2C8600%2C0.08&t=d4LzjnueM7WcV5RG-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=29%3A2" />
        </div>
      </div>

      <Navbar />
    </div>

  );
}
