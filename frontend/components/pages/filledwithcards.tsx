"use client"
import { Navbar } from "../Navbarr";
import { ThreeDCardDemo } from "../pinCards";
import { useEffect, useState } from "react";
import { templateAPI } from "@/lib/api";
import { Template } from "@/lib/index";

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
            <Navbar/>
            <div className="min-h-screen p-4 ">
                {loading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-white text-xl">Loading templates...</div>
                    </div>
                )}
                
                {error && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-red-500 text-xl">{error}</div>
                    </div>
                )}
                
                {!loading && !error && templates.length === 0 && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-white text-xl">No templates available at the moment.</div>
                    </div>
                )}
                
                {!loading && !error && templates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 mt-14">
                        {templates.map((template) => (
                            <ThreeDCardDemo key={template.id} template={template} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}