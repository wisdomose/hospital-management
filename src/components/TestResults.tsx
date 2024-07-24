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
  temprature: z.string().optional(),
  pulse: z.string().optional(),
  respiration: z.string().optional(),
  blood_pressure: z.string().optional(),
  oxygen_saturation: z.string().optional(),
});

export default function TestResults({
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
      temprature: tests?.temprature ?? "",
      pulse: tests?.pulse ?? "",
      respiration: tests?.respiration ?? "",
      blood_pressure: tests?.blood_pressure ?? "",
      oxygen_saturation: tests?.oxygen_saturation ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bookingService = new BookingService();
    await wrapper(() =>
      bookingService.tests(id, {
        temprature: values.temprature,
        pulse: values.pulse,
        respiration: values.respiration,
        blood_pressure: values.blood_pressure,
        oxygen_saturation: values.oxygen_saturation,
      })
    );
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
        <Button className="w-fit">Upload result</Button>
      </DialogTrigger>
      <DialogContent className="bg-transparent p-0 px-6 border-0">
        <div className="bg-white">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Upload test results</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 w-full px-6 pb-6"
            >
              {/* temprature */}
              <FormField
                control={form.control}
                name="temprature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Temprature (<sup>o</sup>C)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    {form.formState.errors["temprature"]?.message && (
                      <FormMessage>
                        {form.formState.errors["temprature"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* pulse */}
              <FormField
                control={form.control}
                name="pulse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    {form.formState.errors["pulse"]?.message && (
                      <FormMessage>
                        {form.formState.errors["pulse"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* respiration */}
              <FormField
                control={form.control}
                name="respiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respiration</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    {form.formState.errors["respiration"]?.message && (
                      <FormMessage>
                        {form.formState.errors["respiration"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* bloodPressure */}
              <FormField
                control={form.control}
                name="blood_pressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood pressure</FormLabel>
                    <FormControl>
                      <Input placeholder="0/0" {...field} />
                    </FormControl>
                    {form.formState.errors["blood_pressure"]?.message && (
                      <FormMessage>
                        {form.formState.errors["blood_pressure"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* oxygenSaturation */}
              <FormField
                control={form.control}
                name="oxygen_saturation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oxygen saturation</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    {form.formState.errors["oxygen_saturation"]?.message && (
                      <FormMessage>
                        {form.formState.errors["oxygen_saturation"]?.message}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
