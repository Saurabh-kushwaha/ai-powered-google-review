"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";

interface ChartData {
  name: string;
  scans: number;
  reviews: number;
}

export function OverviewChart({ data }: { data: ChartData[] }) {
  const { theme } = useTheme();
  
  // Choose colors based on theme, fallback to light mode colors if theme isn't resolved
  const scanColor = theme === "dark" ? "#60a5fa" : "#3b82f6"; // blue-400 : blue-500
  const reviewColor = theme === "dark" ? "#34d399" : "#10b981"; // emerald-400 : emerald-500
  const gridColor = theme === "dark" ? "#27272a" : "#f4f4f5"; // zinc-800 : zinc-100
  const textColor = theme === "dark" ? "#a1a1aa" : "#71717a"; // zinc-400 : zinc-500

  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-zinc-500">No data available yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis 
          dataKey="name" 
          stroke={textColor} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
        />
        <YAxis 
          stroke={textColor} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`} 
        />
        <Tooltip 
          cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5' }}
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff', 
            borderRadius: '8px',
            border: `1px solid ${gridColor}`,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }} 
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="scans" name="QR Scans" fill={scanColor} radius={[4, 4, 0, 0]} />
        <Bar dataKey="reviews" name="Generated Reviews" fill={reviewColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
