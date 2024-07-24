"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import useFetcher from "@/hooks/useFetcher";
import BookingService from "@/services/Booking";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Booking } from "@/types";

const formSchema = z.object({
  pcv: z.string().optional(),
});

export default function LabResults({
  id,
  tests = {},
}: {
  id: string;
  tests: Booking["tests"];
}) {
  const { wrapper, data, loading, error } = useFetcher(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pcv: tests?.pcv ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bookingService = new BookingService();
    const update = tests;
    update["pcv"] = values.pcv;
    await wrapper(() => bookingService.tests(id, update));
  }

  useEffect(() => {
    if (data) {
      toast.success("Results uploaded");
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">Upload lab results</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Upload lab results</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full px-6 pb-6 mx-6"
          >
            {/* pcv */}
            <FormField
              control={form.control}
              name="pcv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCV</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  {form.formState.errors["pcv"]?.message && (
                    <FormMessage>
                      {form.formState.errors["pcv"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="mt-4">
              Upload
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
