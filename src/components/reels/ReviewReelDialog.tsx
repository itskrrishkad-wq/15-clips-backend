"use client";

import { Reel } from "@/generated/prisma/client";
import { ReelStatus } from "@/generated/prisma/enums";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

import { MultiSelect } from "@/components/MultiSelectComp";

import { topCitiesInIndia } from "@/data/cities";
import { commonInterests } from "@/data/intrests";
import { indianLanguages } from "@/data/languages";
import { Topprofessions } from "@/data/professions";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
    open: boolean;
    onClose: () => void;
    reel: Reel | null;
    onChange: (reel: Reel) => void;
};

function getYoutubeEmbedUrl(url: string) {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtube.com")) {
            const videoId = parsed.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (parsed.pathname.includes("/shorts/")) {
                const id =
                    parsed.pathname.split("/shorts/")[1];

                return `https://www.youtube.com/embed/${id}`;
            }
        }

        if (parsed.hostname.includes("youtu.be")) {
            const id = parsed.pathname.replace("/", "");

            return `https://www.youtube.com/embed/${id}`;
        }

        return url;
    } catch {
        return url;
    }
}

export default function ReviewReelModal({
    open,
    onClose,
    reel,
    onChange,
}: Props) {
    const [languages, setLanguages] = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [professions, setProfessions] = useState<string[]>([]);

    const [sourceUrl, setSourceUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);

    useEffect(() => {
        if (!reel) return;

        setLanguages(reel.languages || []);
        setLocations(reel.locations || []);
        setProfessions(reel.professions || []);
        setInterests(reel.interests || []);
        setSourceUrl(reel.sourceUrl || "");
    }, [reel]);

    if (!open || !reel) return null;

    const embedUrl = getYoutubeEmbedUrl(
        reel.sourceUrl
    );

    const update = (
        key: keyof Reel,
        value: any
    ) => {
        onChange({
            ...reel,
            [key]: value,
        });
    };


    const handle_review_reel = async (status: ReelStatus) => {
        try {
            setLoading(true);
            const response = await fetch("/api/reels/approve", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    id: reel.id,
                    languages,
                    locations,
                    professions,
                    interests,
                    reelUrl: sourceUrl,
                    status,
                })
            })

            const res = await response.json();

            if (!res.success) {
                console.log("error approving: ", res.message);
                return;
            }


        } catch (error) {
            console.log("error approving: ", error);
        } finally {
            setLoading(false);
            onClose()
        }
    }


    const handle_remove_reel = async () => {
        try {
            setDelLoading(true);
            const response = await fetch(`/api/reels/delete?id=${reel.id}`, {
                method: "DELETE",

                credentials: "include",

            })

            const res = await response.json();

            if (!res.success) {
                console.log("error removing: ", res.message);
                return;
            }


        } catch (error) {
            console.log("error removing: ", error);
        } finally {
            setDelLoading(false);
            onClose()
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
          h-[100dvh] max-h-[100dvh]
          w-full max-w-none overflow-hidden
          border-0 p-0
          sm:h-[92vh] sm:max-h-[92vh]
          sm:max-w-7xl sm:rounded-3xl
        "
                aria-describedby={undefined}
            >
                <DialogTitle className="hidden">Review Reel</DialogTitle>
                <div
                    className="
          relative flex h-[100dvh]
          w-full max-w-7xl
          flex-col overflow-hidden
          border border-border
          bg-background
          sm:h-[92vh]
          md:flex-row
        "
                >


                    {/* LEFT */}
                    <div
                        className="
              relative flex w-full
              items-center justify-center
              border-b border-border
              bg-black
              md:w-[38%]
              md:border-b-0 md:border-r
            "
                    >
                        <div
                            className="
                aspect-video w-full
                md:h-full md:aspect-auto
              "
                        >
                            <iframe
                                src={embedUrl}
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div
                        className="
              flex h-full flex-1
              flex-col overflow-hidden
            "
                    >
                        {/* HEADER */}
                        <div
                            className="
                border-b border-border
                px-5 py-5 sm:px-6
              "
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="
                    relative h-16 w-16
                    overflow-hidden rounded-2xl
                    border border-border
                    bg-muted
                  "
                                >
                                    <Image
                                        fill
                                        unoptimized
                                        alt={
                                            reel.channel ||
                                            "thumbnail"
                                        }
                                        src={
                                            reel.thumbnail ||
                                            reel.sourceThumbnail ||
                                            "https://placehold.co/300x300/png"
                                        }
                                        className="object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="
                      text-xs font-semibold uppercase
                      tracking-wider text-muted-foreground
                    "
                                    >
                                        Source
                                    </p>

                                    <h2
                                        className="
                      truncate text-2xl
                      font-bold text-foreground
                    "
                                    >
                                        {reel.source.slice(0, 1)}{reel.source.slice(1).toLowerCase()}
                                    </h2>

                                    <p
                                        className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                                    >
                                        {reel.channel ||
                                            "Unknown Channel"}
                                    </p>
                                </div>
                            </div>

                            <a
                                href={reel.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="
                  mt-5 inline-flex h-11
                  w-full items-center
                  justify-center gap-2
                  rounded-xl border
                  border-border
                  bg-secondary px-4
                  text-sm font-medium
                  text-secondary-foreground
                  transition-all
                  hover:bg-secondary/80
                "
                            >
                                Open Source
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        {/* SCROLLABLE */}
                        <div
                            className="
                flex-1 overflow-y-auto
              "
                        >
                            <div
                                className="
                  space-y-6
                  p-5 pb-24 sm:p-6
                "
                            >

                                {/* CHANNEL */}
                                <div className="space-y-2">
                                    <label
                                        className="
                      text-sm font-medium
                      text-foreground
                    "
                                    >
                                        Channel
                                    </label>

                                    <input
                                        value={
                                            reel.channel || ""
                                        }
                                        onChange={(e) =>
                                            update(
                                                "channel",
                                                e.target.value
                                            )
                                        }
                                        className="
                      flex h-11 w-full
                      rounded-xl border
                      border-input bg-background
                      px-4 py-2 text-sm
                      text-foreground
                      outline-none transition-all
                      placeholder:text-muted-foreground
                      focus:border-ring
                      focus:ring-2
                      focus:ring-ring/20
                    "
                                    />
                                </div>

                                {/* SOURCE URL */}
                                <div className="space-y-2">
                                    <label
                                        className="
                      text-sm font-medium
                      text-foreground
                    "
                                    >
                                        Source URL
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={
                                            reel.sourceUrl
                                        }
                                        onChange={(e) =>
                                            update(
                                                "sourceUrl",
                                                e.target.value
                                            )
                                        }
                                        className="
                      flex min-h-[90px]
                      w-full rounded-xl border
                      border-input bg-background
                      px-4 py-3 text-sm
                      text-foreground
                      outline-none transition-all
                      placeholder:text-muted-foreground
                      focus:border-ring
                      focus:ring-2
                      focus:ring-ring/20
                    "
                                    />
                                </div>



                                {/* MultiSelects */}
                                <div>
                                    <Label className="text-[12px]">
                                        Languages
                                    </Label>

                                    <MultiSelect
                                        options={indianLanguages.map(
                                            (l) => ({
                                                label: l.label,
                                                value:
                                                    l.value.toLowerCase(),
                                            })
                                        )}
                                        selected={languages}
                                        onChange={
                                            setLanguages
                                        }
                                        placeholder="Languages"
                                    />
                                </div>

                                {/* Interests */}
                                <div>
                                    <Label className="text-[12px]">
                                        Interests
                                    </Label>

                                    <MultiSelect
                                        options={commonInterests.map(
                                            (lang) => ({
                                                label:
                                                    lang,
                                                value:
                                                    lang.toLowerCase(),
                                            })
                                        )}
                                        selected={interests}
                                        onChange={
                                            setInterests
                                        }
                                        placeholder="Select interests"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[12px]">
                                        Locations
                                    </Label>

                                    <MultiSelect
                                        options={topCitiesInIndia.map(
                                            (c) => ({
                                                label: c,
                                                value:
                                                    c.toLowerCase(),
                                            })
                                        )}
                                        selected={locations}
                                        onChange={
                                            setLocations
                                        }
                                        placeholder="Locations"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[12px]">
                                        Professions
                                    </Label>

                                    <MultiSelect
                                        options={Topprofessions.map(
                                            (p) => ({
                                                label: p,
                                                value:
                                                    p.toLowerCase(),
                                            })
                                        )}
                                        selected={
                                            professions
                                        }
                                        onChange={
                                            setProfessions
                                        }
                                        placeholder="Professions"
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="h-20 flex items-center justify-end gap-4 border-t">
                            <Button
                                variant={"destructive"}
                                disabled={delLoading}
                                onClick={handle_remove_reel}
                            >
                                {delLoading ? "Removing..." : "Remove"}
                            </Button>

                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    handle_review_reel("DRAFT")
                                }}
                            >
                                Download and Draft
                            </Button>

                            <Button
                                variant={"default"}
                                className="mr-6"
                                disabled={loading}
                                onClick={() => {
                                    handle_review_reel("PUBLISH")
                                }}
                            >
                                {loading ? "Publishing..." : "Download and Publish"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}