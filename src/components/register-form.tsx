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
import { Checkbox } from "./ui/checkbox";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters." })
    .max(12, { message: "Username can't be more than 12 characters" }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const { signInWithGoogle, signUp } = useFirebaseStorage();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      acceptedTerms: true,
    },
  });

  const accepted = form.watch("acceptedTerms");

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      await signUp(values.username, values.email, values.password);
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "bottom-right",
        });
      }
    }
  }

  async function handleGoogleSignIn() {
    await signInWithGoogle();
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-8 sm:w-10/12 w-full sm:p-8 sm:border-2 rounded-4xl">
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Sign up
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="FlowBit Tech" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@.com.br"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="@3ijai" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-between">
            <FormField
              control={form.control}
              name="acceptedTerms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormDescription>
                    I agree to the terms and conditions.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Link to="/">Already have an account?</Link>
          </div>
          <div className="flex sm:flex-row flex-col w-full gap-2">
            <Button
              disabled={!accepted}
              size="lg"
              className="sm:w-6/12 w-full cursor-pointer"
              type="submit"
            >
              Sign up
            </Button>
            <Button
              disabled={!accepted}
              onClick={handleGoogleSignIn}
              size="lg"
              className="sm:w-6/12 w-full cursor-pointer"
              variant="outline"
              type="button"
            >
              <FcGoogle />
              Google
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
