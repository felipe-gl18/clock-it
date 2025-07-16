import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEmployees } from "@/hooks/useEmployees";
import { useEffect, useState } from "react";
import { useEmployeeTimeRecord } from "@/hooks/useEmployeeTimeRecord";
import Loading from "@/components/loading";

type TChartData = {
  name: string;
  worked_hours: number;
};

const chartConfig = {
  worked_hours: {
    label: "Worked hours",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function Graphics() {
  const { employees, refreshEmployees } = useEmployees();
  const { handleMonthlyWorkedHoursAndMinutes } = useEmployeeTimeRecord();

  const [data, setData] = useState<TChartData[] | null>(null);

  useEffect(() => {
    const fetchFunction = async () => {
      await refreshEmployees();
    };
    fetchFunction();
  }, []);

  useEffect(() => {
    if (!employees) return;
    const fetchFunction = async () => {
      const data = await Promise.all(
        employees.map(async (employee) => {
          const workedHoursAndMinutes =
            await handleMonthlyWorkedHoursAndMinutes(employee.id);
          return {
            name: employee.name,
            worked_hours: workedHoursAndMinutes.hours,
          };
        })
      );
      setData(data);
    };
    fetchFunction();
  }, [employees]);

  console.log(employees);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-6">
      {!employees || employees.length === 0 ? (
        <>
          <p className="text-sm font-bold text-center text-gray-500">
            You need employees data to display the chart
          </p>
          <Loading />
        </>
      ) : (
        <ChartContainer config={chartConfig} className="h-10/12 w-4/6">
          <BarChart accessibilityLayer data={data!}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <YAxis
              dataKey="worked_hours"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="worked_hours"
              fill="var(--color-worked_hours)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
