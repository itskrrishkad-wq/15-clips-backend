// ==============================
// REPORT STATUS ALERT DIALOG
// ==============================

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

type Props = {
    reportId: string;
    newStatus: string;
    open: boolean;
    openChange: (value: boolean) => void;
    onConfirm: () => void;
};

export function ConfirmReportStatusDialog({
    reportId,
    newStatus,
    onConfirm,
    open,
    openChange,
}: Props) {
    return (
        <AlertDialog open={open} onOpenChange={openChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Update Report Status?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to change this report status to{" "}
                        <span className="font-medium text-foreground">
                            {newStatus}
                        </span>
                        ?
                        <br />
                        <br />
                        Report ID:
                        <span className="ml-1 font-medium text-foreground">
                            {reportId}
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
                        Yes, Update
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}