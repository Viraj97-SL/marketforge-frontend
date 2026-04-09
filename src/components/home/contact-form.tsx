"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, Mail, User, MessageSquare, Briefcase } from "lucide-react";

type Field = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

const INTERESTS = [
  "Hiring Trends",
  "Salary Benchmarks",
  "Skill Intelligence",
  "Visa Sponsorship",
  "CV / Career Analysis",
  "API Access",
  "Partnership",
  "Other",
];

export function ContactForm() {
  const [form, setForm] = useState<Field>({
    name: "", email: "", company: "", interest: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update(k: keyof Field, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    // Simulate submit (wire to backend or Formspree endpoint as needed)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-ok/10 border border-ok/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-ok" />
        </div>
        <h3 className="text-xl font-black text-t1">Message received!</h3>
        <p className="text-t2 text-sm max-w-xs leading-relaxed">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", company: "", interest: "", message: "" }); }}
          className="mt-2 text-xs text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t3 pointer-events-none" />
          <input
            type="text"
            placeholder="Your name *"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full bg-s2 border border-b1 rounded-xl pl-10 pr-4 py-3 text-sm text-t1
                       placeholder:text-t3 focus:outline-none focus:border-accent/50 focus:bg-s3 transition-all"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t3 pointer-events-none" />
          <input
            type="email"
            placeholder="Email address *"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="w-full bg-s2 border border-b1 rounded-xl pl-10 pr-4 py-3 text-sm text-t1
                       placeholder:text-t3 focus:outline-none focus:border-accent/50 focus:bg-s3 transition-all"
          />
        </div>
      </div>

      {/* Company + Interest */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t3 pointer-events-none" />
          <input
            type="text"
            placeholder="Company (optional)"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className="w-full bg-s2 border border-b1 rounded-xl pl-10 pr-4 py-3 text-sm text-t1
                       placeholder:text-t3 focus:outline-none focus:border-accent/50 focus:bg-s3 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={form.interest}
            onChange={(e) => update("interest", e.target.value)}
            className="w-full bg-s2 border border-b1 rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-accent/50 focus:bg-s3 transition-all
                       appearance-none cursor-pointer
                       text-t3 [&:not(:placeholder-shown)]:text-t1"
            style={{ color: form.interest ? "#E2E8F2" : "#334155" }}
          >
            <option value="" disabled>Area of interest</option>
            {INTERESTS.map((i) => (
              <option key={i} value={i} style={{ background: "#0F1520", color: "#E2E8F2" }}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="relative">
        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-t3 pointer-events-none" />
        <textarea
          placeholder="Your message *"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
          rows={4}
          className="w-full bg-s2 border border-b1 rounded-xl pl-10 pr-4 py-3 text-sm text-t1
                     placeholder:text-t3 focus:outline-none focus:border-accent/50 focus:bg-s3 transition-all
                     resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                   bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm
                   hover:opacity-90 hover:shadow-[0_0_28px_rgba(0,198,167,0.3)]
                   disabled:opacity-60 transition-all duration-300"
      >
        {status === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="w-4 h-4" /> Send Message</>
        )}
      </button>

      {status === "error" && (
        <p className="text-xs text-err text-center">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
