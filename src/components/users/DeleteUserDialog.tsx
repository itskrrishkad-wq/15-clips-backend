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
import { Button } from "@/components/ui/button"

import { User } from "@/generated/prisma/client";

type Props = {
    userName?: string;
    onConfirm: () => void;

    open: boolean;

    openChange: (value: boolean) => void;

    setDeleteUser: (value: User | null) => void;

    isLoading?: boolean;
};

export function DeleteUserDialog({
    userName,
    onConfirm,
    open,
    openChange,
    setDeleteUser,
    isLoading,
}: Props) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                openChange(open);
                setDeleteUser(null);
            }}
        >
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete User?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {userName}
                        </span>
                        ?
                        <br />
                        <br />
                        This action cannot be undone and
                        the user will be permanently
                        removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    >
                        {isLoading
                            ? "Deleting..."
                            : "Yes, Delete User"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}