// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/logo.webp";
import { useLogin } from "@/features/authApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
   const [formData, setFormData] = useState({
      userEmail: "",
      userPassword: ""
   });
   const [error, setError] = useState<string>("");
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const message = searchParams.get('message');

   const loginMutation = useLogin();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
      setError("");
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      try {
         await loginMutation.mutateAsync(formData);
         navigate("/admin/dashboard");
      } catch (err: any) {
         setError(err.response?.data?.message || "Login failed. Please try again.");
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            <div className="flex items-center space-x-4 mb-8">
               <Link to="/" className="inline-block">
                  <img src={logo} alt="Majestic Vacations" className="h-16 w-auto" />
               </Link>
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
                  <p className="text-gray-600 mt-2">Enter your credentials to access the dashboard</p>
               </div>
            </div>

            {message && (
               <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{decodeURIComponent(message)}</AlertDescription>
               </Alert>
            )}

            <Card className="border-0 shadow-xl">
               <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                     Enter your email and password to access the admin panel
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {error && (
                     <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <Input
                              id="userEmail"
                              name="userEmail"
                              type="email"
                              placeholder="admin@example.com"
                              className="pl-10"
                              value={formData.userEmail}
                              onChange={handleChange}
                              required
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="userPassword">Password</Label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                           <Input
                              id="userPassword"
                              name="userPassword"
                              type="password"
                              placeholder="Enter your password"
                              className="pl-10"
                              value={formData.userPassword}
                              onChange={handleChange}
                              required
                           />
                        </div>
                     </div>

                     <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90"
                        disabled={loginMutation.isPending}
                     >
                        {loginMutation.isPending ? (
                           <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Logging in...
                           </>
                        ) : (
                           <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Login
                           </>
                        )}
                     </Button>

                     <div className="text-center text-sm text-gray-600">
                        <p>
                           Demo credentials:{" "}
                           <span className="font-medium text-accent">umerkhayam1717@gmail.com</span> /{" "}
                           <span className="font-medium text-accent">umer@1234</span>
                        </p>
                        <p className="mt-2">
                           Or return to{" "}
                           <Link
                              to="/"
                              className="text-accent hover:text-accent/80 font-medium"
                           >
                              homepage
                           </Link>
                        </p>
                     </div>
                  </form>
               </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
               <p>© {new Date().getFullYear()} Majestic Vacations. All rights reserved.</p>
               <p className="mt-2 text-xs">
                  Admin Panel - For authorized personnel only
               </p>
            </div>
         </div>
      </div>
   );
};

export default Login;