"use client";
import { Navbar } from "@/components/Navbarr";
import FigmaEmbed from "@/components/ui/iphoneMockup";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { templateAPI, templateDetailAPI} from "@/lib/api";
import { Template, TemplateDetail } from "@/lib/index";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

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
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
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
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading template...</div>
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
      <Navbar />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-16">
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
                className="px-8 py-3 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white font-semibold rounded-lg hover:from-zinc-800 hover:via-zinc-900 hover:to-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20"
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
