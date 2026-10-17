import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Building2, Lock, Radar, Truck, User, UserRound } from "lucide-react";
import { AuroraBackground } from "@/components/fx/aurora-background";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { fadeUp, stagger } from "@/lib/motion-presets";
import type { Role } from "@/data/fleet";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth.service";
import { toast } from "sonner";

const roles: { value: Role; label: string; icon: typeof User; hint: string; defaultEmail: string; defaultPass: string }[] = [
  {
    value: "manager",
    label: "Fleet Manager",
    icon: Radar,
    hint: "Assign, monitor & analyze fleet ops",
    defaultEmail: "amit.rao@fleethub.io",
    defaultPass: "ManagerPass123!",
  },
  {
    value: "driver",
    label: "Driver",
    icon: Truck,
    hint: "Schedule, routes & safety performance",
    defaultEmail: "rahul.sharma@fleethub.io",
    defaultPass: "DriverPass123!",
  },
  {
    value: "client",
    label: "Client",
    icon: Building2,
    hint: "Create shipments & track live progress",
    defaultEmail: "contact@acmecorp.com",
    defaultPass: "ClientPass123!",
  },
];

export function LoginPage() {
  const [role, setRole] = useState<Role>("manager");
  const [email, setEmail] = useState("amit.rao@fleethub.io");
  const [password, setPassword] = useState("ManagerPass123!");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const activeRoleObj = roles.find((r) => r.value === role)!;

  useEffect(() => {
    setEmail(activeRoleObj.defaultEmail);
    setPassword(activeRoleObj.defaultPass);
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authData = await login(email, password);
      const userRole = authData.user.role || role;
      toast.success(`Welcome back, ${authData.user.fullName}!`);
      navigate({ to: "/welcome/$role", params: { role: userRole } });
    } catch (err: any) {
      toast.error(err.message || "Failed to log in with provided credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10 sm:px-6">
      <AuroraBackground />

      <motion.div
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <motion.div variants={fadeUp} className="mb-6 flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] border border-primary-foreground/20"
          >
            <Radar className="size-7" />
          </motion.div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to <span className="text-gradient">FleetHub</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
            The operating system for modern delivery fleets.
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="rounded-3xl glass-strong border border-border/80 p-6 sm:p-7 shadow-2xl space-y-6"
        >
          {/* Role Picker (3 Evenly Aligned Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Workspace Role
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {roles.map((r) => {
                const active = r.value === role;
                return (
                  <motion.button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "relative flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 text-center transition-all duration-300 cursor-pointer",
                      active
                        ? "border-primary/60 bg-primary/14 text-primary font-bold shadow-[var(--shadow-glow)]"
                        : "border-border/70 bg-surface/30 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="role-pick"
                        className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-primary/40"
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center gap-1.5">
                      <r.icon className="size-5 shrink-0 text-current" />
                      <span className="text-xs font-semibold leading-tight">{r.label}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-center text-[11px] font-medium text-muted-foreground min-h-[16px] pt-1">
              {activeRoleObj.hint}
            </p>
          </div>

          {/* Form Fields with Structured Vertical Spacing */}
          <div className="space-y-4">
            <InputField
              id="email"
              label="Username / Email"
              icon={<UserRound className="size-4" />}
              value={email}
              onChange={setEmail}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              icon={<Lock className="size-4" />}
              value={password}
              onChange={setPassword}
            />
          </div>

          {/* Action Buttons with Clean Vertical Gap & Matching Widths */}
          <div className="flex flex-col gap-3.5 pt-2">
            <MagneticButton
              variant="primary"
              className="w-full justify-center py-3.5 text-sm font-bold shadow-[var(--shadow-glow)]"
              icon={<ArrowRight className="size-4" />}
              type="submit"
              disabled={loading}
            >
              {loading ? "Authenticating..." : `Sign In as ${activeRoleObj.label}`}
            </MagneticButton>

            <Link
              to="/welcome/$role"
              params={{ role: "client" }}
              className="block w-full rounded-2xl border border-border/80 bg-surface/30 py-3.5 text-center text-sm font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-surface/50 hover:text-foreground"
            >
              Create Client Account
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

/** Structured Input Field component ensuring distinct label, icon, and input spacing */
function InputField({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-center rounded-2xl border bg-surface/40 px-4 py-2.5 transition-all duration-300",
        focused
          ? "border-primary/70 bg-surface/70 ring-2 ring-primary/20 shadow-[var(--shadow-glow)]"
          : "border-border/80 hover:border-border",
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 mb-1 select-none",
          focused ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        <span className={cn("shrink-0 transition-colors duration-200", focused ? "text-primary" : "text-muted-foreground")}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none border-none p-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
