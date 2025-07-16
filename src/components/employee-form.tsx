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
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useEmployees } from "@/hooks/useEmployees";
import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

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
  photo: z.custom<File>((val) => val instanceof File, {
    message: "Please, upload a photo of the employee",
  }),
});

export function EmployeeForm() {
  const { uploadImage } = useFirebaseStorage();
  const { handleNewEmployee, refreshEmployees } = useEmployees();

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsRegistering(true);
    try {
      const employeeId = await handleNewEmployee({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      await uploadImage(values.photo, employeeId);

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refreshEmployees();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-center",
        });
      }
    }
    setIsRegistering(false);
  }

  return (
    <Form {...form}>
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
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    field.onChange(file);
                  }}
                  name={field.name}
                  ref={(el) => {
                    field.ref(el);
                    fileInputRef.current = el;
                  }}
                />
              </FormControl>
              <FormDescription className="text-start">
                Employee photo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="cursor-pointer"
          type="submit"
          disabled={isRegistering}
        >
          <PlusIcon />
          {isRegistering ? "Adding..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}
