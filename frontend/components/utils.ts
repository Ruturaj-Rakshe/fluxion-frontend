
 
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const wordsBee = [
    {
      text: "Build",
      className: "text-white dark:text-white"
    },
    {
      text: "awesome",
      className: "text-white dark:text-white"
    },
    {
      text: "templates",
      className: "text-white dark:text-white"
    },
    {
      text: "with",
      className: "text-white dark:text-white"
    },
    {
      text: "Mojito.",
      className: "text-purple-500 dark:text-purple-500",
    },
  ];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const faqData = [
    {
      id: 1,
      question: "What services does Allevia Labs offer?",
      answer:
        "We specialize in full-stack web development, product design, and digital innovation — helping businesses turn their ideas into interactive, scalable solutions.",
    },
    {
      id: 2,
      question: "How long does it take to complete a project?",
      answer:
        "Timelines vary depending on the project scope. On average, MVPs take 3–6 weeks, while full-scale applications may take 2–3 months.",
    },
    {
      id: 3,
      question: "Do you provide ongoing maintenance after project delivery?",
      answer:
        "Yes. We offer post-launch maintenance, performance optimization, and feature enhancement services to ensure your product stays secure and up to date.",
    },
    {
      id: 4,
      question: "Can I get a custom quote for my project?",
      answer:
        "Absolutely. You can reach out to us with your requirements, and our team will provide a personalized plan and quotation within 48 hours.",
    },
    {
      id: 5,
      question: "What technologies do you use?",
      answer:
        "Our stack includes React, Next.js, Node.js, Express, MongoDB, TailwindCSS, and modern DevOps tools — ensuring performance and scalability.",
    },
    {
      id: 6,
      question: "Do you work with startups or only large companies?",
      answer:
        "We collaborate with both — from early-stage startups to established enterprises — adapting our approach to meet each client’s unique needs.",
    },
    {
      id: 7,
      question: "Can you redesign my existing website or app?",
      answer:
        "Yes, we often help clients revamp outdated interfaces, improve UX/UI design, and integrate modern performance and accessibility standards.",
    },
    {
      id: 8,
      question: "How can I contact your team?",
      answer:
        "You can reach us through our website’s contact form or email us directly at hello@allevialabs.com. We typically respond within one business day.",
    },
  ];
