"use client"

import { useEffect, useRef, useState } from "react";
import {motion} from "motion/react";
import Example from "./OnlineUsersChart";
import SimpleAreaChart from "./AreaChart";
import { ItemDemo } from "./AdminActions";
import PieChartWithCustomizedLabel from "./PieChart";
import { DataTable } from "./payments/data-table";
import { columns } from "./payments/columns"
import { getData } from "./payments/page";
import ActiveUsersCard from "./ActiveUsers";
import { TotalUsersCard } from "./TotalUsers";
import { AdminNotesCard } from "./AdminNotes";
import { AdminStats, RecentOrder } from "@/lib";
import { adminAPI } from "@/lib/api";

export const BentoGridItem = ({id, onClick, className = "", children, heading, textColor = "text-white/35", SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers, TotalUsers, AdminNotes}: 
{id: number;
onClick: (id: number, heading: string, content: React.ReactNode, SimpleChart?: React.ReactNode, AreaChart?: React.ReactNode, AdminActions?: React.ReactNode, PieChart?: React.ReactNode, DataTable?: React.ReactNode, ActiveUsers?: React.ReactNode, TotalUsers?: React.ReactNode, AdminNotes?: React.ReactNode) => void;
className?: string;
children: React.ReactNode;
heading: string;
textColor?: string;
SimpleChart?: React.ReactNode;
AreaChart?: React.ReactNode;
AdminActions?: React.ReactNode;
PieChart?: React.ReactNode;
DataTable?: React.ReactNode;
ActiveUsers?: React.ReactNode;
TotalUsers?: React.ReactNode;
AdminNotes?: React.ReactNode;
}) => {
    return (
<motion.div tabIndex={0} 
    layoutId={`card-${id}`}
    onClick={() => onClick?.(id, heading, children, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers, TotalUsers, AdminNotes)}
    className={`
    w-full
    focus-visible:outline-none
    focus-visible:ring-4
    focus-visible:ring-indigo-500
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[#04071D]
    rounded-2xl group/bento
    hover:shadow-md transition duration-200
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

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "success" | "failed";
  email: string;
}

export const BentoGrid = ({ stats }: { stats: AdminStats }) => {
  const [current, setCurrent] = useState<{id: number; heading: string; content: React.ReactNode, SimpleChart?: React.ReactNode, AreaChart?: React.ReactNode, AdminActions?: React.ReactNode, PieChart?: React.ReactNode, DataTable?: React.ReactNode, ActiveUsers?: React.ReactNode, TotalUsers?: React.ReactNode, AdminNotes?: React.ReactNode} | null>(null);
  const reference = useOutsideClick(() => setCurrent(null));
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch real orders and transform to payment format
      try {
        const response = await adminAPI.getRecentOrders(20);
        const ordersData = response.data;
        
        if (ordersData && ordersData.orders && Array.isArray(ordersData.orders)) {
          // Transform orders to payment format for the table
          const transformedPayments: Payment[] = ordersData.orders.map((order: RecentOrder) => {
            const statusLower = order.status.toLowerCase();
            let status: "pending" | "success" | "failed" = "pending";
            if (statusLower === 'completed') status = 'success';
            else if (statusLower === 'cancelled') status = 'failed';
            
            return {
              id: order.id,
              amount: order.total,
              status,
              email: order.user?.email || 'N/A'
            };
          });
          setPayments(transformedPayments);
        } else {
          // Fallback to dummy data
          const dummyData = await getData();
          setPayments(dummyData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback to dummy data if API fails
        const dummyData = await getData();
        setPayments(dummyData);
      }
    }
    fetchData();
  }, []);

  // Transform stats data for charts
  const signupsByDate = Object.entries(stats.users.byDate).map(([date, count]) => ({
    date,
    count
  }));

  const revenueByDate = Object.entries(stats.revenue.byDate).map(([date, revenue]) => ({
    date,
    revenue
  }));

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
            bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10
            rounded-none w-full h-full
            sm:rounded-2xl sm:w-[60vw] sm:h-[600px] sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2
          "
        >
          <h1 className="text-2xl font-bold text-white">{current.heading}</h1>
          <div className="text-sm text-white/70 pt-2">{current.content}</div>

          {current.SimpleChart && (
            <div className="mt-6">
              {current.SimpleChart}
            </div>
          )}

          {current.AreaChart && (
            <div className="mt-6">
              {current.AreaChart}
            </div>
          )}

          {current.AdminActions && (
            <div className="mt-6">
              {current.AdminActions}
            </div>
          )}

          {current.PieChart && (
            <div className="mt-6">
              {current.PieChart}
            </div>
          )}

          {current.DataTable && (
            <div className="mt-6">
              {current.DataTable}
            </div>
          )}

          {current.ActiveUsers && (
            <div className="mt-6">
              {current.ActiveUsers}
            </div>
          )}

          {current.TotalUsers && (
            <div className="mt-6">
              {current.TotalUsers}
            </div>
          )}

          {current.AdminNotes && (
            <div className="mt-6">
              {current.AdminNotes}
            </div>
          )}

        </motion.div>
      )}

      {/* GRID — now EXACT layout restored */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BentoGridItem
          id={1}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers, TotalUsers, AdminNotes) => setCurrent({id, heading, content, AdminNotes})}
          className="min-h-[180px] sm:min-h-[200px] md:min-h-[250px] col-span-1 sm:col-span-3"
          heading="ADMIN NOTES"
          AdminNotes={<AdminNotesCard notes={["Review user reports", "Update system settings", "Backup database"]} />}
        >
          Welcome back admin! Here are your notes for today.
        </BentoGridItem>

        <BentoGridItem
          id={2}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers, TotalUsers) => setCurrent({id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers, TotalUsers})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="TOTAL USERS"
          TotalUsers={<TotalUsersCard totalUsers={stats.users.total} growthPercent={5.2} />}
        >
          {stats.users.total.toLocaleString()} registered users.
        </BentoGridItem>

        <BentoGridItem
          id={3}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers) => setCurrent({id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable, ActiveUsers})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="ACTIVE SESSIONS"
          ActiveUsers={<ActiveUsersCard />}
        >
          Active users online right now.
        </BentoGridItem>

        <BentoGridItem
          id={4}
          onClick={(id, heading, content, SimpleChart) => setCurrent({id, heading, content, SimpleChart})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="NEW SIGNUPS"
          SimpleChart={<Example signupsByDate={signupsByDate} />}
        >
          {stats.users.newToday} new users today.
        </BentoGridItem>

        <BentoGridItem
          id={5}
          onClick={(id, heading, content, SimpleChart, AreaChart) => setCurrent({id, heading, content,SimpleChart, AreaChart})}
          className="min-h-[180px] sm:min-h-[250px] sm:col-span-2"
          heading="REVENUE OVERVIEW"
          AreaChart={<SimpleAreaChart revenueByDate={revenueByDate} />}
        >
            Total Revenue: ${stats.revenue.monthly.toFixed(2)} this month.
        </BentoGridItem>

        <BentoGridItem
          id={6}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart) => setCurrent({id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart})}
          className="min-h-[180px] sm:min-h-[250px]"
          heading="TEMPLATE STATS"
          PieChart={<PieChartWithCustomizedLabel activeTemplates={stats.templates.active} inactiveTemplates={stats.templates.inactive} />}
        >
            {stats.templates.total} templates ({stats.templates.active} active).
        </BentoGridItem>

        <BentoGridItem
          id={8}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable) => setCurrent({id, heading, content, SimpleChart, AreaChart, AdminActions, PieChart, DataTable})}
          className="min-h-[180px] sm:min-h-[250px] sm:col-span-1"
          heading="RECENT ORDERS"
          DataTable={<DataTable columns={columns} data={payments} />}
          
        >
            {stats.orders.today} orders placed today.
        </BentoGridItem>

        <BentoGridItem
          id={7}
          onClick={(id, heading, content, SimpleChart, AreaChart, AdminActions) => setCurrent({id, heading, content, SimpleChart, AreaChart, AdminActions})}
          className="min-h-[180px] sm:min-h-[250px] col-span-1 sm:col-span-2"
          heading="QUICK ACTIONS"
          AdminActions={<ItemDemo />}
        >
            Create new admin, manage templates.
        </BentoGridItem>
      </div>
    </div>
  );
};
