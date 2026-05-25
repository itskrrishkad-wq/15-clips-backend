"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdStatus } from "@/generated/prisma/enums";


type Props = {
  adId: string;
  adTitle: string;
  newStatus: AdStatus;
  open: boolean;
  openChange: (value: boolean) => void;
  onConfirm: () => void;
};

const statusConfig: Record<
  AdStatus,
  {
    label: string;
    color: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    color: "text-emerald-500",
  },

  PAUSED: {
    label: "Paused",
    color: "text-yellow-500",
  },

  SCHEDULED: {
    label: "Scheduled",
    color: "text-blue-500",
  },

  COMPLETED: {
    label: "Completed",
    color: "text-violet-500",
  },

  CANCELED: {
    label: "Canceled",
    color: "text-red-500",
  },
};

export function ConfirmAdStatusDialog({
  adId,
  adTitle,
  newStatus,
  onConfirm,
  open,
  openChange,
}: Props) {
  const status = statusConfig[newStatus];

  return (
    <AlertDialog
      open={open}
      onOpenChange={openChange}
    >
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Update Ad Status?
          </AlertDialogTitle>

          <AlertDialogDescription className="leading-relaxed">
            Are you sure you want to change the status of{" "}
            <span className="font-medium text-foreground">
              {adTitle}
            </span>{" "}
            to{" "}
            <span
              className={`font-semibold ${status.color}`}
            >
              {status.label}
            </span>
            ?
            <br />
            <br />
            <span className="text-xs">
              Ad ID:
              <span className="ml-1 font-medium text-foreground">
                {adId}
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl"
          >
            Yes, Update Status
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}