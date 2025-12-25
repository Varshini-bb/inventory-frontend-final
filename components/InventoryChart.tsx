"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

export default function InventoryChart({ data }: any) {
  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          label
        >
          {data.map((_: any, i: number) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
