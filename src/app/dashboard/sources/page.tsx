"use client"

import CreateSourceDialog from "@/components/source/CreateSourceDialog";
import UpdateSourceDialog from "@/components/source/UpdateSourceDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Source } from "@/generated/prisma/browser";
import { useSourceStore } from "@/zustand/sourceStore";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";



function SourceCard({
    img,
    title,
    children,
    source
}: {
    img: string;
    title: string;
    children: React.ReactNode;
    source: Source
}) {
    const { removeSource } = useSourceStore()
    const [isDeleting, setIsDeleting] = useState(false);
    const [updateSource, setupdateSource] = useState<Source | null>(null)

    const handleDelete = async (
        sourceId: string
    ) => {
        try {
            setIsDeleting(true);

            console.log(
                "deleting source:",
                sourceId
            );

            const response = await fetch(
                `/api/source/delete?id=${sourceId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const res =
                await response.json();

            if (!res.success) {
                console.log(
                    "error deleting source:",
                    res.message
                );

                return;
            }

            removeSource(sourceId);

            console.log(
                "source deleted successfully"
            );
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div
            className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/[0.06]
        bg-white
        p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.12]
        w-full
      "
        >

            {/* subtle glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)] pointer-events-none" />

            {/* top section */}
            <div className="flex items-center justify-between">
                <div className="relative flex items-center gap-4">
                    {/* image */}
                    <div
                        className="
            relative
            h-14 w-14 shrink-0 overflow-hidden
            rounded-full
            ring-1 ring-white/10
          "
                    >
                        <img
                            src={img}
                            alt={title}
                            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-110 rounded-full
            "
                        />

                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* title */}
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[15px] font-semibold">
                            {title}
                        </h3>

                        <p className="mt-1 text-[12px] text-zinc-500">
                            Content Source
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"destructive"} size={"icon"}>
                                <Trash2Icon />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to
                                    delete this source?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    This action cannot be
                                    undone. The source and all
                                    related data will be
                                    permanently removed from
                                    our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={() =>
                                        handleDelete(source.id)
                                    }
                                    className="
                bg-destructive!
                text-destructive-foreground
                hover:bg-destructive/80!
            "
                                >
                                    {isDeleting ? "Deleting..." : "Delete Source"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <UpdateSourceDialog
                        sourceData={{
                            id: source.id,
                            channelName:
                                source.channelName,
                            categories:
                                source.categories,
                            language: source.language,
                            source: source.source,
                            profileImg: source.profileImg ?? ""
                        }}
                    >
                        <Button
                            variant={"secondary"}
                            size={"icon"}
                        >
                            <EditIcon />
                        </Button>
                    </UpdateSourceDialog>
                </div>
            </div>
            {/* content */}
            <div className="relative mt-5">
                {children}
            </div>
        </div>
    );
}

export default function SourcesPage() {
    const { sources } = useSourceStore();
    const [mounted, setMounted] = useState(false);




    useEffect(() => {
        setMounted(true);
    }, []);





    if (!mounted) {
        return null;
    }
    return (
        <>
            <div className="w-full gap-4 sm:gap-6">
                <div className="w-full">
                    {/* {loading ? <div>
                        <h2 className="text-sm font-semibold text-gray-500">loading...</h2>
                    </div> : sources.length <= 0 ? <div>
                        <h2 className="text-2xl font-semibold">No sources yet</h2>
                    </div> : */}
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative">
                                <h2 className="text-2xl font-semibold">Sources</h2>
                            </div>
                        </div>

                        <CreateSourceDialog />
                    </div>


                    <div className="w-full grid grid-cols-3 gap-4">
                        {sources.map((source) => {
                            return <SourceCard
                                key={source.channelId}
                                img={source.profileImg ?? ""}
                                title={source.channelName}
                                source={source}
                            >
                                <div
                                    className="
      relative overflow-hidden
      rounded-3xl
      border border-zinc-100
      bg-zinc-950/5
      p-5
      transition-all duration-300
      hover:border-zinc-1-0
      hover:bg-zinc-900/5
    "
                                >
                                    {/* glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent pointer-events-none" />

                                    {/* TOP */}
                                    <div className="relative flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`h-1.5 w-1.5 rounded-full ${source.source === "YOUTUBE"
                                                        ? "bg-red-500"
                                                        : "bg-pink-500"
                                                        }`}
                                                />

                                                <span className="text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
                                                    {source.source}
                                                </span>
                                            </div>

                                            <h2 className="text-[15px] font-semibold truncate">
                                                {source.channelName}
                                            </h2>
                                        </div>

                                        <div className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 px-3 py-1.5">
                                            <p className="text-[10px] font-medium text-zinc-700">
                                                {source.language}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CATEGORY SECTION */}
                                    <div className="relative mt-5">
                                        <p className="mb-3 text-[11px] font-medium text-zinc-500">
                                            Categories
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {source.categories.map((category) => (
                                                <div
                                                    key={category}
                                                    className="
              rounded-full
        border border-zinc-200
        bg-zinc-50
        px-3 py-1.5
        text-[11px]
        font-medium
        text-zinc-700
        transition-all duration-200
        hover:border-zinc-300
        hover:bg-zinc-100
            "
                                                >
                                                    {category}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BOTTOM */}
                                    <div className="relative mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <p className="text-[11px] text-zinc-500">
                                                Connected
                                            </p>
                                        </div>

                                        <div className="text-[11px] text-zinc-600">
                                            Source Channel
                                        </div>
                                    </div>
                                </div>
                            </SourceCard>
                        })}
                    </div>
                    {/* } */}
                </div>


            </div>
        </>
    );
}
