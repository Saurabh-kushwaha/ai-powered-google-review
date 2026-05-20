"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  User, Lock, Trash2, Save, Loader2, ShieldCheck,
  Mail, AlertTriangle, CheckCircle2, Bell, Moon, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description }: {
  icon: React.ElementType; title: string; description: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession();

  // Profile state — initialized from session; updates when session loads
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Keep in sync if session loads after first render
  const sessionName = session?.user?.name ?? "";
  const sessionEmail = session?.user?.email ?? "";
  if (name === "" && sessionName) setName(sessionName);
  if (email === "" && sessionEmail) setEmail(sessionEmail);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);


  // ── Save profile ────────────────────────────────────────────────────────────
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error ?? "Failed to update password");
      } else {
        toast.success("Password changed successfully!");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted.");
        signOut({ callbackUrl: "/" });
      } else {
        toast.error("Failed to delete account.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account preferences and security.</p>
      </div>

      {/* ── Account Info Banner ── */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-700 text-white">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold shrink-0">
          {name ? name[0].toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{name || "Your Name"}</p>
          <p className="text-sm text-zinc-400 truncate">{email || "your@email.com"}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active
        </div>
      </div>

      {/* ── Profile Section ── */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={User}
            title="Profile Information"
            description="Update your display name and email address."
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-zinc-50 dark:bg-zinc-900/50"
                />
              </Field>
              <Field label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50"
                  />
                </div>
              </Field>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={profileLoading} className="gap-2">
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Password Section ── */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={Lock}
            title="Change Password"
            description="Use a strong password you don't use elsewhere."
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSave} className="space-y-5">
            <Field label="Current Password">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zinc-50 dark:bg-zinc-900/50"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="New Password">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="bg-zinc-50 dark:bg-zinc-900/50"
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="bg-zinc-50 dark:bg-zinc-900/50"
                />
              </Field>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-sm text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Password must be at least 8 characters long.
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={passwordLoading} className="gap-2">
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Preferences Section ── */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={Bell}
            title="Preferences"
            description="Manage notification and display preferences."
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: Bell,
                label: "Email Notifications",
                description: "Receive a daily digest of new feedback.",
                enabled: true,
              },
              {
                icon: Moon,
                label: "Dark Mode",
                description: "Toggle between light and dark interface.",
                enabled: false,
              },
              {
                icon: Globe,
                label: "Public Review Page",
                description: "Allow your QR link to be publicly accessible.",
                enabled: true,
              },
            ].map(({ icon: Icon, label, description, enabled }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                    <p className="text-xs text-zinc-500">{description}</p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  type="button"
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"}`}
                  title={enabled ? "Enabled" : "Disabled"}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Plan / Account Info ── */}
      <Card>
        <CardHeader>
          <SectionHeader
            icon={ShieldCheck}
            title="Account Details"
            description="Your plan and account information."
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Plan", value: "Free" },
              { label: "Role", value: session?.user?.role ?? "OWNER" },
              { label: "Account Status", value: "Active" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <SectionHeader
            icon={AlertTriangle}
            title="Danger Zone"
            description="Irreversible actions — proceed with caution."
          />
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-4">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Delete Account</p>
              <p className="text-xs text-red-500 dark:text-red-500/80 mt-0.5">
                This will permanently delete your account, business, QR codes, and all feedback. This action cannot be undone.
              </p>
            </div>
            <div className="space-y-3">
              <Field label='Type "DELETE" to confirm'>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900/50 focus-visible:ring-red-400"
                />
              </Field>
              <Button
                variant="destructive"
                className="gap-2 w-full sm:w-auto"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirm !== "DELETE"}
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete My Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
