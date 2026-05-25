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
import { Ad } from "@/generated/prisma/client";

type Props = {
    adTitle: string | undefined;
    onConfirm: () => void;
    open: boolean;
    openChange: (value: boolean) => void;
    setDeleteAd: (value: Ad | null) => void;
    isLoading?: boolean;
};

export function DeleteAdDialog({
    adTitle,
    onConfirm,
    open,
    openChange,
    isLoading,
    setDeleteAd
}: Props) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                openChange(open);
                setDeleteAd(null);
            }}
        >
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Ad?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {adTitle}
                        </span>
                        ?
                        <br />
                        <br />
                        This action cannot be undone
                        and the ad will be permanently
                        removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    >
                        {isLoading
                            ? "Deleting..."
                            : "Yes, Delete Ad"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}