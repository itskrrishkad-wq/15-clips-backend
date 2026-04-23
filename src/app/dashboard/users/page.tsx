"use client";

import { users } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

function UserCard({
  user,
  onClick,
}: {
  user: (typeof users)[0];
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="gradient-primary text-primary-foreground text-[10px] font-semibold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium truncate">{user.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
        <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className="rounded-lg text-[9px] capitalize shrink-0"
        >
          {user.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mt-2 pl-12 text-[10px] text-muted-foreground">
        <span>{user.city}</span>
        <span>•</span>
        <span>{user.profession}</span>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full sm:w-72 rounded-xl pl-10 bg-secondary/60 border-border/50 text-[13px] focus:bg-card focus:shadow-soft transition-all"
          />
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 sm:hidden">
        {filtered.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => setSelectedUser(user)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="rounded-2xl bg-card shadow-card overflow-hidden animate-fade-in hidden sm:block">
        <div className="px-5 pt-5 pb-2 overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[1fr_1fr_100px_80px_90px_100px_70px_40px] gap-3 border-b border-border/50 pb-2.5 px-2">
              {[
                "Name",
                "Email",
                "Phone",
                "City",
                "Profession",
                "Interests",
                "Status",
                "",
              ].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-4 overflow-x-auto">
          <div className="min-w-[700px]">
            {filtered.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="grid grid-cols-[1fr_1fr_100px_80px_90px_100px_70px_40px] gap-3 items-center py-3 border-b border-border/20 last:border-0 hover:bg-secondary/30 rounded-xl px-2 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-[10px] font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[12px] font-medium truncate">
                    {user.name}
                  </span>
                </div>
                <span className="text-[12px] text-muted-foreground truncate">
                  {user.email}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {user.phone}
                </span>
                <span className="text-[12px]">{user.city}</span>
                <span className="text-[12px]">{user.profession}</span>
                <div className="flex gap-1 flex-wrap">
                  {user.interests.map((i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-lg text-[9px]"
                    >
                      {i}
                    </Badge>
                  ))}
                </div>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  className="rounded-lg text-[9px] capitalize w-fit"
                >
                  {user.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-base font-semibold">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold truncate">
                    {selectedUser.name}
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    {selectedUser.profession} • {selectedUser.city}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email", value: selectedUser.email },
                  { label: "Phone", value: selectedUser.phone },
                  { label: "City", value: selectedUser.city },
                  { label: "Status", value: selectedUser.status },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-secondary/50 p-3"
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-[13px] font-medium mt-0.5 capitalize truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                  Interests
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedUser.interests.map((i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-lg text-[11px]"
                    >
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
