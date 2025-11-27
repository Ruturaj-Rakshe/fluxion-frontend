"use client"

import { useEffect, useRef, useState } from "react";
import {motion} from "motion/react";

export const BentoGridItem = ({id, onClick, className = "", children, heading, textColor = "text-white/35"} : 
{id: number;
onClick: (id: number, heading: string, content: React.ReactNode) => void;
className?: string;
children: React.ReactNode;
heading: string;
textColor?: string;
}) => {
    return (
<motion.div tabIndex={0} 
    layoutId={`card-${id}`}
    onClick={() => onClick?.(id, heading, children)}
    className={`
    w-full
    focus-visible:outline-none
    focus-visible:ring-4
    focus-visible:ring-indigo-500
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[#04071D]
    rounded-2xl group/bento
    hover:shadow-xl transition duration-200
    shadow-input dark:shadow-none p-4
    bg-linear-to-br text-white
    from-[#04071D] to-[#0C0E23]
    border border-white/10
    cursor-pointer
    ${className}
  `}
>
        
        {heading && (
  <h3 className="
    mb-2 text-lg font-bold
    transition duration-200
    group-hover/bento:translate-x-2
  ">
    {heading}
  </h3>
)}

<div className={`${textColor} transition duration-200 group-hover/bento:translate-x-2`}>
  {children}
</div>


       
</motion.div>
    )
}

const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);;

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [callback]);

    return ref;
}

export const BentoGrid = () => {
  const [current, setCurrent] = useState<{id: number; heading: string; content: React.ReactNode} | null>(null);
  const reference = useOutsideClick(() => setCurrent(null));

  return (
    <div className="mx-4 md:mx-12">
      {/* overlay */}
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* modal */}
      {current?.id && (
        <motion.div
          layoutId={`card-${current.id}`}
          ref={reference}
          className="
            fixed inset-0 z-20
            p-4 overflow-y-auto
            bg-gradient-to-br from-[#04071D] to-[#0C0E23] border border-white/10
            rounded-none w-full h-full
            sm:rounded-2xl sm:w-[60vw] sm:h-[600px] sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2
          "
        >
          <h1 className="text-2xl font-bold text-white">{current.heading}</h1>
          <div className="text-sm text-white/70 pt-2">{current.content}</div>
        </motion.div>
      )}

      {/* GRID — now EXACT layout restored */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BentoGridItem
          id={1}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[200px] md:min-h-[250px] col-span-1 sm:col-span-3"
          heading="ADMIN NOTES"
        >
          Welcome back admin! Here are your notes for today.
        </BentoGridItem>

        <BentoGridItem
          id={2}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="TOTAL USERS"
        >
          1,248 registered users.
        </BentoGridItem>

        <BentoGridItem
          id={3}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="ACTIVE SESSIONS"
        >
          83 users online right now.
        </BentoGridItem>

        <BentoGridItem
          id={4}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="NEW SIGNUPS"
        >
          12 new users today.
        </BentoGridItem>

        <BentoGridItem
          id={5}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px] sm:col-span-2"
          heading="REVENUE OVERVIEW"
        >
            Total Revenue: $5,430 this month.
        </BentoGridItem>

        <BentoGridItem
          id={6}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="TEMPLATE STATS"
        >
            150 templates created.
        </BentoGridItem>

        <BentoGridItem
          id={8}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px] sm:col-span-1"
          heading="RECENT ORDERS"
        >
            23 orders placed today.
        </BentoGridItem>

        <BentoGridItem
          id={7}
          onClick={(id, heading, content) => setCurrent({id, heading, content})}
          className="min-h-[180px] sm:min-h-[250px] col-span-1 sm:col-span-2"
          heading="QUICK ACTIONS"
        >
            Create new admin, manage templates.
        </BentoGridItem>
      </div>
    </div>
  );``
};
