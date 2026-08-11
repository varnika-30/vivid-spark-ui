import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock, Radar, Truck, User, UserRound, Building2 } from "lucide-react";
import { AuroraBackground } from "@/components/fx/aurora-background";
import { MagneticButton } from "@/components/fx/magnetic-button";
import { fadeUp, stagger } from "@/lib/motion-presets";
import type { Role } from "@/data/fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fleetline — Sign in to your fleet workspace" },
      {
        name: "description",
        content:
          "Sign in to Fleetline to manage drivers, deliveries and trip intelligence across your fleet.",
      },
      { property: "og:title", content: "Fleetline — Sign in to your fleet workspace" },
      {
        property: "og:description",
        content: "AI-assisted fleet operations for managers, drivers and clients.",
      },
    ],
  }),
  component: LoginPage,
});

const roles: { value: Role; label: string; icon: typeof User; hint: string }[] = [
  { value: "manager", label: "Fleet Manager", icon: Radar, hint: "Assign, monitor, report" },
  { value: "driver", label: "Driver", icon: Truck, hint: "Schedule & performance" },
  { value: "client", label: "Client", icon: Building2, hint: "Create & track shipments" },
];

function LoginPage() {
  const [role, setRole] = useState<Role>("manager");
  const navigate = useNavigate();

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <AuroraBackground />

      <motion.div
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            <Radar className="size-7" />
          </motion.div>
          <h1 className="mt-5 text-3xl font-semibold">
            Welcome to <span className="text-gradient">Fleetline</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The operating system for modern delivery fleets.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/welcome/$role", params: { role } });
          }}
          className="rounded-3xl glass-strong p-6"
        >
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const active = r.value === role;
              return (
                <motion.button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "relative rounded-xl border p-3 text-center transition-colors duration-300",
                    active
                      ? "border-primary/50 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="role-pick"
                      className="absolute inset-0 rounded-xl bg-primary/12 glow-ring"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    />
                  )}
                  <span className="relative flex flex-col items-center gap-1.5">
                    <r.icon className="size-4.5" />
                    <span className="text-[11px] font-medium leading-tight">{r.label}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {roles.find((r) => r.value === role)?.hint}
          </p>

          <div className="mt-6 space-y-4">
            <FloatingField
              id="email"
              label="Username / Email"
              icon={<UserRound className="size-4" />}
              defaultValue="amit.rao@fleetline.io"
            />
            <FloatingField
              id="password"
              label="Password"
              type="password"
              icon={<Lock className="size-4" />}
              defaultValue="fleetline"
            />
          </div>

          <MagneticButton
            variant="primary"
            className="mt-6 w-full"
            float
            float
            icon={<ArrowRight className="size-4" />}
            type="submit"
          >
            Login
          </MagneticButton>

          <Link
            to="/welcome/$role"
            params={{ role: "client" }}
            className="mt-3 block rounded-xl border border-border py-2.5 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Create Client Account
          </Link>
        </motion.form>
      </motion.div>
    </div>
  );
}

function FloatingField({
  id,
  label,
  icon,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <motion.div
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "relative rounded-xl border bg-surface/40 px-3 pb-2 pt-5 transition-colors duration-300",
        focused ? "border-primary/60 shadow-[var(--shadow-glow)]" : "border-border",
      )}
    >
      <motion.label
        htmlFor={id}
        animate={{
          y: floated ? -10 : 4,
          scale: floated ? 0.82 : 1,
          opacity: floated ? 0.85 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="pointer-events-none absolute left-9 origin-left text-sm text-muted-foreground"
      >
        {label}
      </motion.label>
      <div className="flex items-center gap-2">
        <span className={cn("transition-colors", focused ? "text-primary" : "text-muted-foreground")}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </motion.div>
  );
}
