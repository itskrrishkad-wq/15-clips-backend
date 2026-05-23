"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Clock3,
  Copyright,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ConfirmReportStatusDialog } from "./ConfirmReportStatusDialog";

type ReportReason =
  | "SPAM"
  | "INAPPROPRIATE"
  | "VIOLENCE"
  | "COPYRIGHT"
  | "OTHER";

type ReportStatus = "PENDING" | "RESOLVED";

interface ReportCardProps {
  report: {
    id: string;
    reason: ReportReason;
    note?: string | null;
    status: ReportStatus;
    createdAt: string | Date;

    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      image?: string | null;
    };

    reel: {
      id: string;
      thumbnailUrl?: string | null;
    };
  };
}

const reasonConfig: Record<
  ReportReason,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
  }
> = {
  SPAM: {
    label: "Spam",
    icon: <Sparkles className="size-4" />,
    color:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },

  INAPPROPRIATE: {
    label: "Inappropriate",
    icon: <AlertTriangle className="size-4" />,
    color:
      "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },

  VIOLENCE: {
    label: "Violence",
    icon: <ShieldAlert className="size-4" />,
    color:
      "bg-red-500/10 text-red-400 border-red-500/20",
  },

  COPYRIGHT: {
    label: "Copyright",
    icon: <Copyright className="size-4" />,
    color:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },

  OTHER: {
    label: "Other",
    icon: <MessageSquareText className="size-4" />,
    color:
      "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  },
};

export default function ReportCard({
  report,
}: ReportCardProps) {
  const reason = reasonConfig[report.reason];


  // ==============================
  // REPORT CARD STATUS SELECT
  // ==============================

  const [status, setStatus] = useState(report.status);

  const [newStatus, setNewStatus] =
    useState<ReportStatus>("PENDING");

  const [confirmDialogOpen, setConfirmDialogOpen] =
    useState(false);

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(
        `/api/report/update-status`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: report.id,
            status: newStatus,
          }),
        }
      );

      const res = await response.json();

      if (!res.success) {
        console.log(res.message);
        return;
      }

      setStatus(newStatus);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="overflow-hidden border-white/10 bg-secondary text-foreground py-0">
      <div className="flex flex-col gap-4 p-4">
        {/* top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-white/5">
              {report.reel.thumbnailUrl ? (
                <img
                  src={report.reel.thumbnailUrl}
                  alt="reel"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 text-xs text-zinc-500">
                  No Image
                </div>
              )}
            </div>

            <div className="space-y-1">

              <p className="text-xs text-zinc-500">
                Reported by{" "}
                <span className="font-medium text-zinc-600">
                  {report.user.username ||
                    report.user.name ||
                    "Unknown User"}
                </span>
              </p>

              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock3 className="size-3.5" />

                {formatDistanceToNow(
                  new Date(report.createdAt),
                  {
                    addSuffix: true,
                  }
                )}
              </div>
            </div>
          </div>

          {/* status */}
          <Select
            value={status}
            onValueChange={(val) => {
              setNewStatus(val as ReportStatus);
              setConfirmDialogOpen(true);
            }}
          >
            <SelectTrigger className="h-8 min-w-[90px] text-[11px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PENDING">
                Pending
              </SelectItem>

              <SelectItem value="RESOLVED">
                Resolved
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* reason */}
        <div>
          <Badge
            variant="outline"
            className={`gap-1.5 px-3 py-1 ${reason.color}`}
          >
            {reason.icon}
            {reason.label}
          </Badge>
        </div>

        {/* note */}
        {report.note && (
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <p className="mb-1 text-xs font-medium text-zinc-400">
              Additional Note
            </p>

            <p className="text-sm leading-relaxed text-zinc-600">
              {report.note}
            </p>
          </div>
        )}
      </div>
      <ConfirmReportStatusDialog
        reportId={report.id}
        newStatus={newStatus}
        open={confirmDialogOpen}
        openChange={setConfirmDialogOpen}
        onConfirm={handleUpdateStatus}
      />
    </Card>
  );
}