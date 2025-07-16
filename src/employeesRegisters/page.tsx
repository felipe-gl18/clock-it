import { useEffect, useMemo } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEmployeeTimeRecord } from "@/hooks/useEmployeeTimeRecord";

export default function EmployeesTimeRecord() {
  const { employeesTimeRecord, refreshEmployeesTimeRecord } =
    useEmployeeTimeRecord();
  const data = useMemo(() => employeesTimeRecord || [], [employeesTimeRecord]);

  useEffect(() => {
    async function fetchFuntion() {
      await refreshEmployeesTimeRecord();
    }
    fetchFuntion();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
