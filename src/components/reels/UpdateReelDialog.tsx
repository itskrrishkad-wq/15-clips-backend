"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import {
  ExternalLink,
  Upload
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { MultiSelect } from "@/components/MultiSelectComp";

import { Reel } from "@/generated/prisma/client";
import { ReelStatus } from "@/generated/prisma/enums";

import { topCitiesInIndia } from "@/data/cities";
import { commonInterests } from "@/data/intrests";
import { indianLanguages } from "@/data/languages";
import { PROFESSIONS } from "@/data/professions";
import { Button } from "../ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: Reel | null) => void;
  reel: Reel;
};

// function getYoutubeEmbedUrl(url: string) {
//   try {
//     const parsed = new URL(url);

//     if (parsed.hostname.includes("youtube.com")) {
//       const videoId =
//         parsed.searchParams.get("v");

//       if (videoId) {
//         return `https://www.youtube.com/embed/${videoId}`;
//       }

//       if (
//         parsed.pathname.includes("/shorts/")
//       ) {
//         const id =
//           parsed.pathname.split(
//             "/shorts/"
//           )[1];

//         return `https://www.youtube.com/embed/${id}`;
//       }
//     }

//     if (
//       parsed.hostname.includes("youtu.be")
//     ) {
//       const id =
//         parsed.pathname.replace("/", "");

//       return `https://www.youtube.com/embed/${id}`;
//     }

//     return url;
//   } catch {
//     return url;
//   }
// }

const UpdateReelDialog = ({
  open,
  onOpenChange,
  reel,
}: Props) => {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [videoUrl, setVideoUrl] =
    useState("");

  const [languages, setLanguages] =
    useState<string[]>([]);

  const [interests, setInterests] =
    useState<string[]>([]);

  const [locations, setLocations] =
    useState<string[]>([]);

  const [professions, setProfessions] =
    useState<string[]>([]);

  const [source, setSource] =
    useState("");

  const [sourceUrl, setSourceUrl] =
    useState("");

  const [status, setStatus] =
    useState<ReelStatus>("DRAFT");

  const [isUpdating, setIsUpdating] =
    useState(false);

  useEffect(() => {
    if (!reel) return;

    setLanguages(reel.languages || []);
    setLocations(reel.locations || []);
    setProfessions(
      reel.professions || []
    );

    setInterests(reel.interests || []);

    setSource(reel.source || "");
    setSourceUrl(reel.sourceUrl || "");

    setStatus(
      reel.status || "DRAFT"
    );

    setVideoUrl(reel.reelUrl || "");
  }, [reel]);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview(null);
    }
  }, [open]);

  const handleFileChange = (
    file: File | null
  ) => {
    if (!file) return;

    setFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }

      formData.append(
        "update_info",
        JSON.stringify({
          languages,
          locations,
          professions,
          interests,
          source,
          sourceUrl,
          status,
          id: reel.id,
        })
      );

      const response = await fetch(
        "/api/reels/update",
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const res = await response.json();

      if (!res.success) {
        console.log(
          "error while updating reel:",
          res.message
        );

        return;
      }

      console.log(
        "updated reel:",
        res.data
      );

      onOpenChange(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  };


  const handle_remove_reel = async () => {
    try {
      // setDelLoading(true);
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
      // setDelLoading(false);
    }
  }

  // const embedUrl =
  //   getYoutubeEmbedUrl(sourceUrl);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onOpenChange(null);
        }
      }}
    >
      <DialogContent
        className="
          h-[100dvh] max-h-[100dvh]
          w-full max-w-none
          overflow-hidden
          border-0 p-0
          sm:h-[92vh]
          sm:max-h-[92vh]
          sm:max-w-7xl
          sm:rounded-3xl
        "
        aria-describedby={undefined}
      >
        <DialogTitle className="hidden">Update reel</DialogTitle>
        <div
          className="
            flex h-full w-full
            flex-col overflow-hidden
            bg-background
            md:flex-row
          "
        >
          {/* LEFT */}

          {/* PREVIEW */}
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
      flex h-full w-full
      items-center justify-center
      bg-black
    "
            >
              {preview ? (
                <video
                  src={preview}
                  controls
                  playsInline
                  className="
          h-full w-full
          object-contain
        "
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="
          h-full w-full
          object-contain
        "
                />
              )}
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
                px-5 py-5
                sm:px-6
              "
            >
              <div className="flex items-start gap-4">
                {reel?.thumbnail && <div
                  className="
                    relative h-16 w-16
                    overflow-hidden
                    rounded-2xl
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
                      "https://placehold.co/300x300/png"
                    }
                    className="object-cover"
                  />
                </div>}

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      text-xs font-semibold
                      uppercase tracking-wider
                      text-muted-foreground
                    "
                  >
                    Update Reel
                  </p>

                  <h2
                    className="
                      truncate text-2xl
                      font-bold
                      text-foreground
                    "
                  >
                    {source}
                  </h2>

                  <p
                    className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                  >
                    {
                      reel?.channel ?? "Channel Unknown"
                    }
                  </p>
                </div>
              </div>

              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-5 inline-flex
                  h-11 w-full
                  items-center
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
                <ExternalLink
                  size={16}
                />
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
                  p-5 pb-24
                  sm:p-6
                "
              >
                {/* FILE */}
                <div className="space-y-2">
                  <label
                    htmlFor="update-file"
                    className="
                      flex h-32
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border border-dashed
                      border-border
                      bg-muted/30
                      transition-all
                      hover:bg-muted/50
                    "
                  >
                    <Upload className="mb-3 h-6 w-6" />

                    <p className="text-sm font-medium">
                      {file
                        ? file.name
                        : "Upload new reel"}
                    </p>

                    <p
                      className="
                        mt-1 text-xs
                        text-muted-foreground
                      "
                    >
                      MP4, MOV, WEBM
                    </p>
                  </label>

                  <input
                    id="update-file"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(
                        e.target
                          .files?.[0] ||
                        null
                      )
                    }
                  />
                </div>

                {/* VIDEO URL */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm font-medium
                    "
                  >
                    Video URL
                  </label>

                  <input
                    value={videoUrl}
                    onChange={(e) =>
                      setVideoUrl(
                        e.target.value
                      )
                    }
                    className="
                      flex h-11
                      w-full rounded-xl
                      border border-input
                      bg-background
                      px-4 py-2
                      text-sm
                      outline-none
                      transition-all
                      focus:border-ring
                      focus:ring-2
                      focus:ring-ring/20
                    "
                  />
                </div>

                {/* SOURCE */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm font-medium
                    "
                  >
                    Source
                  </label>

                  <input
                    value={source}
                    onChange={(e) =>
                      setSource(
                        e.target.value
                      )
                    }
                    className="
                      flex h-11
                      w-full rounded-xl
                      border border-input
                      bg-background
                      px-4 py-2
                      text-sm
                      outline-none
                      transition-all
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
                    "
                  >
                    Source URL
                  </label>

                  <textarea
                    rows={3}
                    value={sourceUrl}
                    onChange={(e) =>
                      setSourceUrl(
                        e.target.value
                      )
                    }
                    className="
                      min-h-[90px]
                      w-full rounded-xl
                      border border-input
                      bg-background
                      px-4 py-3
                      text-sm
                      outline-none
                      transition-all
                      focus:border-ring
                      focus:ring-2
                      focus:ring-ring/20
                    "
                  />
                </div>

                {/* STATUS */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm font-medium
                    "
                  >
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target
                          .value as ReelStatus
                      )
                    }
                    className="
                      flex h-11
                      w-full rounded-xl
                      border border-input
                      bg-background
                      px-4 py-2
                      text-sm
                      outline-none
                      transition-all
                      focus:border-ring
                      focus:ring-2
                      focus:ring-ring/20
                    "
                  >
                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="PUBLISH">
                      Publish
                    </option>

                    <option value="REVIEW">
                      Review
                    </option>
                  </select>
                </div>

                {/* LANGUAGES */}
                <div>
                  <p
                    className="
                      mb-2 text-xs
                      font-medium
                    "
                  >
                    Languages
                  </p>

                  <MultiSelect
                    options={indianLanguages.map(
                      (l) => ({
                        label:
                          l.label,
                        value:
                          l.value.toLowerCase(),
                      })
                    )}
                    selected={
                      languages
                    }
                    onChange={
                      setLanguages
                    }
                    placeholder="Languages"
                  />
                </div>

                {/* INTERESTS */}
                <div>
                  <p
                    className="
                      mb-2 text-xs
                      font-medium
                    "
                  >
                    Interests
                  </p>

                  <MultiSelect
                    options={commonInterests.map(
                      (i) => ({
                        label: i,
                        value:
                          i.toLowerCase(),
                      })
                    )}
                    selected={
                      interests
                    }
                    onChange={
                      setInterests
                    }
                    placeholder="Select interests"
                  />
                </div>

                {/* LOCATIONS */}
                <div>
                  <p
                    className="
                      mb-2 text-xs
                      font-medium
                    "
                  >
                    Locations
                  </p>

                  <MultiSelect
                    options={topCitiesInIndia.map(
                      (c) => ({
                        label: c,
                        value:
                          c.toLowerCase(),
                      })
                    )}
                    selected={
                      locations
                    }
                    onChange={
                      setLocations
                    }
                    placeholder="Locations"
                  />
                </div>

                {/* PROFESSIONS */}
                <div>
                  <p
                    className="
                      mb-2 text-xs
                      font-medium
                    "
                  >
                    Professions
                  </p>

                  <MultiSelect
                    options={PROFESSIONS.map(
                      (p) => ({
                        label: p.label,
                        value:
                          p.id.toLowerCase(),
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

                {/* ACTION */}
                <div className="h-20 flex items-center justify-end gap-4 border-t">
                  <Button
                    variant={"destructive"}
                    // disabled={delLoading}
                    onClick={handle_remove_reel}
                  >
                    {false ? "Removing..." : "Remove"}
                  </Button>



                  <Button
                    variant={"default"}
                    className="mr-0"
                    disabled={isUpdating}
                    onClick={() => {
                      handleUpdate()
                    }}
                  >
                    {false ? "Publishing..." : "Update"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateReelDialog;