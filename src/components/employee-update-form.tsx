import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeAvatar from "./employee-avatar";

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Username must be at least 6 characters." }),
  phone: z
    .string()
    .min(11, { message: "Phone must be at least 11 characters." })
    .max(11, { message: "Phone must be 11 characters" }),
  email: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function EmployeeUpdateForm({ employee }: { employee: EmployeeWithId }) {
  const { handleUpdateEmployee, refreshEmployees } = useEmployees();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: employee,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUpdating(true);
    try {
      await handleUpdateEmployee(values, employee.id);
      await refreshEmployees();
    } catch (error) {
      console.error(error);
    }
    setIsUpdating(false);
  }

  return (
    <Form {...form}>
      <div className="w-full flex justify-center">
        <EmployeeAvatar employee={employee} />
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Luciana" {...field} />
              </FormControl>
              <FormDescription className="text-start">
                Employee name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="88992048450" maxLength={11} {...field} />
              </FormControl>
              <FormDescription className="text-start">
                Employee phone
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="luciana@example.com" {...field} />
              </FormControl>
              <FormDescription className="text-start">
                Employee email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="cursor-pointer" type="submit" disabled={isUpdating}>
          <Edit />
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
