import { useEffect, useMemo } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEmployees } from "@/hooks/useEmployees";

export function Employees() {
  const { employees, refreshEmployees } = useEmployees();
  const data = useMemo(() => employees || [], [employees]);

  useEffect(() => {
    async function fetchFuntion() {
      await refreshEmployees();
    }
    fetchFuntion();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
