"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

type Props = {
  userName: string;
  newRole: string;
  onConfirm: () => void;
  open: boolean;
  openChange: (value: boolean) => void;
};

export function ConfirmRoleChangeDialog({
  userName,
  newRole,
  onConfirm,
  open,
  openChange,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={openChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Role?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to change{" "}
            <span className="font-medium text-foreground">{userName}</span> role
            to <span className="font-medium text-foreground">{newRole}</span>?
            This action will update their permissions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm} className="rounded-xl">
            Yes, Change Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
