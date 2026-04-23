"use client";

import { ConfirmRoleChangeDialog } from "@/components/admin/AlertDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser, AdminUserRole } from "@/generated/prisma/client";
import { Shield, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function AdminCard({ admin }: { admin: AdminUser }) {
  return (
    <div className="rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="gradient-primary text-primary-foreground text-[10px] font-semibold">
            {admin.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium truncate">{admin.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {admin.email}
          </p>
        </div>

        {/* <Badge
          variant={admin.status === "active" ? "default" : "secondary"}
          className="rounded-lg text-[9px] capitalize shrink-0"
        >
          {admin.status}
        </Badge> */}
      </div>

      <div className="flex items-center justify-between mt-2 pl-12">
        <Badge variant="secondary" className="rounded-lg text-[10px]">
          {admin.role}
        </Badge>

        {/* <span className="text-[10px] text-muted-foreground">
          {admin.lastLogin}
        </span> */}
      </div>
    </div>
  );
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [newRole, setNewRole] = useState<AdminUserRole>("GUEST");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  // ✅ fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/super-user/get-all", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) return;

        setAdmins(data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ dynamic role stats
  const roleStats = useMemo(() => {
    return [
      {
        role: "ADMIN",
        count: admins?.filter((a) => a.role === "ADMIN").length,
        gradient: "gradient-primary",
        desc: "Full system access",
      },
      {
        role: "Manager",
        count: admins?.filter((a) => a.role === "MANAGER").length,
        gradient: "gradient-info",
        desc: "Manage reels & content",
      },
      {
        role: "Guest",
        count: admins?.filter((a) => a.role === "GUEST").length,
        gradient: "gradient-warning",
        desc: "Manage campaigns",
      },
    ];
  }, [admins]);

  // ✅ role update handler
  const handleRoleChange = (id: string, role: AdminUser["role"]) => {
    // optional API call here
  };

  const handle_update_admin_role = async () => {
    if (!newRole || !id) return;
    try {
      const response = await fetch(`/api/super-user/update`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ role: newRole, id }),
      });

      const res = await response.json();

      if (!res.success) {
        console.log("error while updating role: ", res.message);
        return;
      }

      console.log("admin role Updated: ", res.data);
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, role: newRole } : a)),
      );
    } catch (error) {
      console.log("error while updating admin role: ", error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* HEADER */}
      <div className="mb-4 sm:mb-6 flex flex-col justify-center items-start">
        <h1 className="text-2xl font-semibold">Admins</h1>
        <p className="text-[12px] text-muted-foreground">
          Manage admin users and their roles & permissions
        </p>
      </div>

      {/* ROLE STATS */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roleStats?.map((r) => (
          <div key={r.role} className="rounded-2xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.gradient}`}
              >
                <Shield className="h-4 w-4 text-white" />
              </div>

              <div>
                <p className="text-[13px] font-semibold">{r.role}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
            </div>

            <p className="text-2xl font-bold">{r.count}</p>
          </div>
        ))}
      </div>

      {/* LOADING */}

      {/* MOBILE */}
      <div className="space-y-2 sm:hidden">
        {admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block rounded-2xl bg-card shadow-card overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <div className="grid grid-cols-4 gap-3 border-b pb-2 text-[10px] uppercase text-muted-foreground">
            <span>Admin</span>
            <span>Email</span>
            <span>Role</span>
          </div>
        </div>

        <div className="px-5 pb-4">
          {loading && (
            <div className="text-sm text-muted-foreground">
              Loading admins...
            </div>
          )}
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="grid grid-cols-4 gap-3 items-center py-3 border-b hover:bg-secondary/30 rounded-xl px-2"
            >
              {/* NAME */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[12px]">{admin.name}</span>
              </div>

              {/* EMAIL */}
              <span className="text-[12px] text-muted-foreground">
                {admin.email}
              </span>

              {/* ROLE (DYNAMIC) */}
              <Select
                value={admin.role}
                onValueChange={(val) => {
                  handleRoleChange(admin.id, val as AdminUser["role"]);
                  setName(admin.name);
                  setNewRole(val as AdminUser["role"]);
                  setId(admin.id);
                  setConfirmDialogOpen(true);
                }}
              >
                <SelectTrigger className="h-8 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="GUEST">Guest</SelectItem>
                </SelectContent>
              </Select>

              {/* LAST LOGIN */}

              {/* ACTION */}
              {/* <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button> */}
            </div>
          ))}
        </div>
      </div>
      <ConfirmRoleChangeDialog
        newRole={newRole}
        userName={name}
        open={confirmDialogOpen}
        openChange={setConfirmDialogOpen}
        onConfirm={handle_update_admin_role}
      />
    </>
  );
}
