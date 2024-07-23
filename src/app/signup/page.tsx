"use client";
// import Button from "@/components/Button";
import useFetcher from "@/hooks/useFetcher";
// import useInput from "@/hooks/useInput";
import UserService, { SignUpResponse } from "@/services/User";
// import { Field, Input, Label, Select } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GiHospital } from "react-icons/gi";

// import Navbar from "@/components/Navbar";

const formSchema = z.object({
  lastname: z
    .string({ required_error: "Last name is required" })
    .min(2, "Lastname is too short"),
  firstname: z
    .string({ required_error: "First name is required" })
    .min(2, "Firstname is too short"),
  email: z.string({ required_error: "Email is required" }).email(),
  phoneNo: z
    .string({ required_error: "Phone number is required" })
    .length(11, "Invalid phone number"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password should be at least 6 characters"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
});

export default function SignupPage() {
  const { wrapper, data, loading, error } = useFetcher<SignUpResponse>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      email: "",
      phoneNo: "",
      password: "",
      gender: "male",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userService = new UserService();
    await wrapper(() =>
      userService.signUp({
        displayName: `${values.lastname} ${values.firstname}`,
        email: values.email,
        phoneNo: values.phoneNo,
        password: values.password,
        gender: values.gender,
      })
    );
  }

  useEffect(() => {
    if (data) {
      router.replace("/");
      toast.success("Signup complete");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {/* <Navbar /> */}

      <main className="max-w mt-16 pb-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 max-w-md mx-auto"
          >
            <div className="flex flex-col items-center">
              <GiHospital className="size-16 text-primary" />
              <h1 className="text-4xl mt-3">Signup</h1>
            </div>

            <p className="font-bold -mb-4">Personal information</p>

            {/* lastname */}
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  {form.formState.errors["lastname"]?.message && (
                    <FormMessage>
                      {form.formState.errors["lastname"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* firstname */}
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  {form.formState.errors["firstname"]?.message && (
                    <FormMessage>
                      {form.formState.errors["firstname"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@bookz.com"
                    />
                  </FormControl>
                  {form.formState.errors["email"]?.message && (
                    <FormMessage>
                      {form.formState.errors["email"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* phone No */}
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+234" />
                  </FormControl>
                  {form.formState.errors["phoneNo"]?.message && (
                    <FormMessage>
                      {form.formState.errors["phoneNo"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">male</SelectItem>
                      <SelectItem value="female">female</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors["gender"]?.message && (
                    <FormMessage>
                      {form.formState.errors["gender"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <p className="font-bold -mb-4">Security information</p>

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} />
                  </FormControl>
                  {form.formState.errors["password"]?.message && (
                    <FormMessage>
                      {form.formState.errors["password"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              Signup
            </Button>

            <p className="text-center">
              already have an account?{" "}
              <Link href="/" className="text-hover-focus underline">
                login
              </Link>
            </p>
          </form>
        </Form>
      </main>
    </>
  );
}
