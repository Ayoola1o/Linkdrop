"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser, useCurrentUserStore } from "@/hooks/useCurrentUser"; // Import the store directly for login action
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Mock user for demonstration purposes
const mockUser = {
  id: 'user_123',
  name: 'Alex Linkdropper',
  email: 'alex@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Sharing cool links and discovering new things!',
  interests: ['technology', 'ai', 'nextjs', 'design thinking'],
  location: 'Cyber City',
};


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const loginUser = useCurrentUserStore((state) => state.login);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Mock login logic
    console.log("Login attempt with:", values);
    if (values.email === "user@example.com" && values.password === "password") {
      loginUser({ ...mockUser, email: values.email }); // Use the mock user data
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/");
    } else if (values.email === mockUser.email && values.password === "password") {
      // Allow login with the predefined mockUser's email
      loginUser(mockUser);
      toast({ title: "Login Successful", description: `Welcome back, ${mockUser.name}!` });
      router.push("/");
    }
    else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary">
          <LayoutGrid className="h-7 w-7" />
          <span className="text-xl font-bold">Linkdrop</span>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Login to continue to Linkdrop.</CardDescription>
          <CardDescription className="text-xs pt-2">Demo: user@example.com / password OR alex@example.com / password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4"/>
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
           <Button variant="link" className="text-xs text-muted-foreground" asChild>
             <Link href="#">Forgot password?</Link>
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
