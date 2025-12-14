"use client"
import { Navbar } from "../Navbarr";
import { ThreeDCardDemo } from "../pinCards";
import { useEffect, useState } from "react";
import { templateAPI } from "@/lib/api";
import { Template } from "@/lib/index";
import { Skeleton } from "@/components/ui/skeleton";

export default function FilledwithCards() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTemplates() {
            try {
                setLoading(true);
                const response = await templateAPI.getAllTemplates();
                if (response.templates) {
                    // Filter only active templates
                    const activeTemplates = response.templates.filter(
                        template => template.isActive === "ACTIVE"
                    );                    
                    setTemplates(activeTemplates);
                }
            } catch (err) {
                console.error("Error fetching templates:", err);
                setError("Failed to load templates. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchTemplates();
    }, []);

    return (
        <>  
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar/>
            </div>
            <div className="min-h-screen p-4 pt-24">
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 mt-14 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="inter-var flex justify-center">
                                <div className=" dark:bg-black dark:border-white/20 border-black/10 w-full sm:w-[30rem] rounded-xl p-6 border">
                                    <Skeleton className="h-7 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mt-2" />
                                    <Skeleton className="h-4 w-5/6 mt-1" />
                                    <Skeleton className="h-60 w-full rounded-xl mt-4" />
                                    <div className="flex justify-between items-center mt-20">
                                        <Skeleton className="h-9 w-28" />
                                        <Skeleton className="h-9 w-36" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {error && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-red-500 text-xl">{error}</div>
                    </div>
                )}
                
                {!loading && !error && templates.length === 0 && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-white text-xl zalando-sans-expanded">No templates available at the moment.</div>
                    </div>
                )}
                
                {!loading && !error && templates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
                        {templates.map((template) => (
                            <ThreeDCardDemo key={template.id} template={template} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
