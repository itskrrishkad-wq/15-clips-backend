"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MultiSelect } from "../MultiSelectComp";
import { topCitiesInIndia } from "@/data/cities";
import { indianLanguages } from "@/data/languages";
import { Topprofessions } from "@/data/professions";
import { ReelStatus } from "@/generated/prisma";
import { Reel } from "@/generated/prisma";
import { commonInterests } from "@/data/intrests";

type Props = {
  open: boolean;
  onOpenChange: (open: Reel | null) => void;
  reel: Reel;
};

const UpdateReelDialog = ({ open, onOpenChange, reel }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);

  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [status, setStatus] = useState<ReelStatus>("DRAFT");

  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Prefill
  useEffect(() => {
    if (!reel) return;

    setLanguages(reel.languages || []);
    setLocations(reel.locations || []);
    setProfessions(reel.professions || []);
    setInterests(reel.interests || []);
    setSource(reel.source || "");
    setSourceUrl(reel.sourceUrl || "");
    setStatus(reel.status || "DRAFT");
    setVideoUrl(reel.reelUrl || "");
  }, [reel]);

  // ✅ Reset when closed
  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview(null);
    }
  }, [open]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // ✅ If file exists → use FormData
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
        }),
      );

      const response = await fetch("/api/reels/update", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const res = await response.json();

      if (!res.success) {
        console.log("error while updateing reel: ", res.message);
        return;
      }

      console.log("updated reel: ", res.data);
      onOpenChange(null); // close
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onOpenChange(null);
      }}
    >
      <DialogContent
        className="rounded-2xl !max-w-lg max-h-[80vh] overflow-y-auto"
        aria-description={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-base">Update Reel Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* FILE UPLOAD */}
          <input
            type="file"
            accept="video/*"
            id="update-file"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />

          <label
            htmlFor="update-file"
            className="flex h-32 cursor-pointer items-center justify-center border-2 border-dashed rounded-xl"
          >
            <div className="text-center text-[12px]">
              <Upload className="h-6 w-6 mx-auto mb-2" />
              {file ? file.name : "Upload new video (optional)"}
            </div>
          </label>

          {/* Preview */}
          {preview ? (
            <video
              src={preview}
              controls
              className="rounded-xl w-full max-h-60"
            />
          ) : (
            videoUrl && (
              <video
                src={videoUrl}
                controls
                className="rounded-xl w-full max-h-60"
              />
            )
          )}

          {/* URL */}
          <div>
            <Label>Video URL</Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* Source */}
          <div>
            <Label>Source</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} />
          </div>

          <div>
            <Label>Source URL</Label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>

          {/* Status */}
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ReelStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISH">Publish</SelectItem>
              <SelectItem value="REVIEW">Review</SelectItem>
            </SelectContent>
          </Select>

          {/* MultiSelects */}
          <div>
            <Label className="text-[12px]">Languages</Label>
            <MultiSelect
              options={indianLanguages.map((l) => ({
                label: l,
                value: l.toLowerCase(),
              }))}
              selected={languages}
              onChange={setLanguages}
              placeholder="Languages"
            />
          </div>

          {/* Interests */}
          <div>
            <Label className="text-[12px]">Interests</Label>
            <MultiSelect
              options={commonInterests.map((lang) => ({
                label: lang,
                value: lang.toLowerCase(),
              }))}
              selected={interests}
              onChange={setInterests}
              placeholder="Select interests"
            />
          </div>

          <div>
            <Label className="text-[12px]">Locations</Label>
            <MultiSelect
              options={topCitiesInIndia.map((c) => ({
                label: c,
                value: c.toLowerCase(),
              }))}
              selected={locations}
              onChange={setLocations}
              placeholder="Locations"
            />
          </div>

          <div>
            <Label className="text-[12px]">Professions</Label>
            <MultiSelect
              options={Topprofessions.map((p) => ({
                label: p,
                value: p.toLowerCase(),
              }))}
              selected={professions}
              onChange={setProfessions}
              placeholder="Professions"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Update Reel"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateReelDialog;
