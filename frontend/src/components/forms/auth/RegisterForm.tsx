"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    id_number: "",
    contact_number: "",
    password1: "",
    password2: "",
  });

  const navigate = useNavigate()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData,
        first_name: capitalize(formData.first_name),
        last_name: capitalize(formData.last_name),
      };

      await register(formattedData);
      toast.success("Registration successful. You are now logged in.");
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } catch (error: any) {
      console.error("Registration error:", error);

      let message = "Registration failed.";

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === "object") {
          message = Object.entries(data)
            .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
            .join("\n");
        } else {
          message = data;
        }
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-card text-foreground shadow p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center text-gradient-maroon">
        Create an Account
      </h2>

      {/* First and Last Name side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-sm font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">ID Number</label>
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Contact Number <span className="text-foreground/50">(optional)</span>
        </label>
        <input
          type="text"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Password</label>
        <input
          type="password"
          name="password1"
          value={formData.password1}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 font-semibold rounded-md bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90 transition hover:cursor-pointer"
      >
        Register
      </button>
    </form>
  );
}
