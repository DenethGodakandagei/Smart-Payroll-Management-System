"use client";

import { useForm } from "react-hook-form";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (data: Form) => {
    try {
      const res = await api.post("/auth/login", data);
      saveToken(res.data.token);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
        <input {...register("password")} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
