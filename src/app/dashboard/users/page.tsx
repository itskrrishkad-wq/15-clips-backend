"use client";

// import { users } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar";
import { User } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/zustand/userStore";
import { differenceInYears } from "date-fns";
import { MoreHorizontalIcon, Search } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function UserCard({
  user,
  onClick,
}: {
  user: User;
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
            {(user.name ?? "")
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
        {/* <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className="rounded-lg text-[9px] capitalize shrink-0"
        >
          {user.status}
        </Badge> */}
      </div>
      <div className="flex items-center gap-2 mt-2 pl-12 text-[10px] text-muted-foreground">
        <span>{user.location}</span>
        <span>•</span>
        <span>{user.profession}</span>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users } = useUserStore()
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const filtered = users.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()),
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
      <div className="rounded-2xl bg-card shadow-card hidden sm:block">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Daily time spend</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className="group cursor-pointer"
                >
                  <TableCell>
                    <div
                      className="flex items-center gap-3 min-w-0"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-[10px] font-semibold">
                          {(user.name ?? "")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-[12px] font-medium whitespace-nowrap">
                        {user.name} {user.lname}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px] text-muted-foreground">
                    {user.email}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px]">
                    {user.location}
                  </TableCell>

                  <TableCell className="text-[12px]">
                    {user.dob
                      ? differenceInYears(
                        new Date(),
                        new Date(user.dob)
                      )
                      : ""}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px]">
                    {user.gender}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px]">
                    {user.profession}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px]">
                    {user.languages[0]}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1 flex-wrap min-w-[180px]">
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
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[12px]">
                    {user.dailyTimeSpent}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        user.emailVerified
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-lg text-[9px] whitespace-nowrap"
                    >
                      {user.emailVerified
                        ? "Verified"
                        : "Not Verified"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Menubar className="border-none">
                      <MenubarMenu>
                        <MenubarTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontalIcon className="h-3.5 w-3.5" />
                          </Button>
                        </MenubarTrigger>

                        <MenubarContent>
                          <MenubarGroup className="space-y-0.5">
                            <MenubarItem>Edit</MenubarItem>

                            <MenubarItem
                              className={cn(
                                buttonVariants({
                                  variant: "destructive",
                                }),
                                "w-full justify-start"
                              )}
                            >
                              Delete
                            </MenubarItem>
                          </MenubarGroup>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-base">User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-base font-semibold">
                    {(selectedUser.name ?? "")
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
                    {selectedUser.profession} • {selectedUser.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email", value: selectedUser.email },
                  { label: "Phone", value: selectedUser.phoneNo },
                  { label: "City", value: selectedUser.location },
                  // { label: "Status", value: selectedUser.status },
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
