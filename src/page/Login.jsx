import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage({ onLogin }) {
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (!agreed) e.agreed = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onLogin();
  };

  const inputCls = (field) =>
    `w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all border ${
      errors[field]
        ? "border-red-500 bg-red-500/5"
        : dark
        ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
        : "bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
    }`;

  return (
    <div className={`min-h-screen flex ${dark ? "bg-[#0F0F0F]" : "bg-[#F5F5F5]  "}`}>
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-all
          dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 bg-white text-zinc-500 hover:border-teal-500"
      >
        {dark ? "☀" : "☽"}
      </button>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#0A0A0A]">
        {/* Gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(88, 94, 93) 1px, transparent 1px), linear-gradient(90deg, rgb(12, 12, 12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-black font-black text-lg">
              LP
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Login Page</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Expert Level Cybersecurity<br />
              <span className="text-teal-400">in hours not weeks</span>
            </h1>
          
          </div>

          <div className="space-y-3">
            {[
              { icon: "1", label: "Effortlessly spider and map targets to uncover hidden security flaws" },
              { icon: "2", label: "Deliver high-quality, validated findings in hours, not weeks." },
              { icon: "3", label: "Generate professional, enterprise-grade security reports automatically." },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-zinc-300 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-zinc-600">
         <h2>Rate 4.5/5.0</h2> <p>(100k+ reviews)</p>
        </div>
      </div>

      {/* Right panel */}
      <div className={`flex-1 flex items-center justify-center p-6 lg:p-12 ${dark ? "bg-[#0F0F0F]" : "bg-gray-50"}`}>
        <div className={`w-full max-w-md rounded-2xl border p-8 shadow-2xl ${dark ? "bg-[#161616] border-zinc-800" : "bg-white border-zinc-200"}`}>
          <div className="mb-7">
            <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-zinc-900"}`}>Create your account</h2>
            {/* <p className="text-sm text-zinc-500 mt-1">Start today</p> */}
          </div>

          <div className="space-y-4">
            {/* Name row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>First name</label>
                <input
                  className={inputCls("firstName")}
                  placeholder="User-Name"
                  value={form.firstName}
                  onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: "" }); }}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>Last name</label>
                <input
                  className={inputCls("lastName")}
                  placeholder="lastName"
                  value={form.lastName}
                  onChange={(e) => { setForm({ ...form, lastName: e.target.value }); setErrors({ ...errors, lastName: "" }); }}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>Email address</label>
              <input
                type="email"
                className={inputCls("email")}
                placeholder="XYZ@gmail.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>Password</label>
              <input
                type="password"
                className={inputCls("password")}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors({ ...errors, agreed: "" }); }}
                  className="mt-0.5 w-4 h-4 accent-teal-500"
                />
                <span className="text-xs text-zinc-500 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-teal-400 hover:underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-teal-400 hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && <p className="text-red-400 text-xs mt-1">{errors.agreed}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-black font-semibold text-sm transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account →"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-1">
              <div className={`flex-1 h-px ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              <span className="text-xs text-zinc-500">or continue with</span>
              <div className={`flex-1 h-px ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
            </div>

            {/* Social buttons */}
            <div className="flex gap-2">
              {[
                {  label: "Apple" },
                {  label: "Google" },
                { label: "Meta" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={onLogin}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    dark
                      ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account?{" "}
            <span className="text-teal-400 hover:underline cursor-pointer" onClick={onLogin}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
