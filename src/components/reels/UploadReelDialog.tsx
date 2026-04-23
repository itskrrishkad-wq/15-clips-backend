"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { topCitiesInIndia } from "@/data/cities";
import { indianLanguages } from "@/data/languages";
import { Topprofessions } from "@/data/professions";
import { ReelStatus } from "@/generated/prisma";
import { Link2, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { MultiSelect } from "../MultiSelectComp";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { commonInterests } from "@/data/intrests";

const UploadReelDialog = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"file" | "url" | "">("");

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

  const [isUploading, setIsUploading] = useState(false);

  // const toggleValue = (
  //   value: string,
  //   list: string[],
  //   setList: (val: string[]) => void,
  // ) => {
  //   if (list.includes(value)) {
  //     setList(list.filter((v) => v !== value));
  //   } else {
  //     setList([...list, value]);
  //   }
  // };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadViaFile = async () => {
    setIsUploading(true);

    try {
      if (method === "file" && !file) {
        return alert("Please upload a video");
      }

      if (!file) {
        return alert("upload file");
      }
      const formData = new FormData();
      const file_reel_info = {
        languages: languages,
        locations: locations,
        professions: professions,
        interests,
        source: source,
        sourceUrl: sourceUrl,
        status: status,
      };
      formData.append("file", file);
      formData.append("form_data", JSON.stringify(file_reel_info));

      const response = await fetch("/api/reels/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const res = await response.json();

      if (!res.success) {
        console.log({ error: res.message });
        return;
      }

      console.log({ uploadReel: res.data });
    } catch (error) {
      console.log("error while uploading via file method: ", error);
    } finally {
      setIsUploading(false);
      setStep(1);
      setMethod("");
      setFile(null);
      setPreview(null);
      setLanguages([]);
      setInterests([]);
      setLocations([]);
      setProfessions([]);
      setSource("");
      setSourceUrl("");
      setStatus("DRAFT");
    }
  };

  const uploadViaurl = async () => {
    try {
      setIsUploading(true);
      const response = await fetch("/api/reels/create-via-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reelUrl: videoUrl,
          languages,
          professions,
          locations,
          status,
        }),
      });

      const res = await response.json();

      if (!res.success) {
        console.log("erro while uploading via url: ", res.message);
      }

      console.log({ uploadRes: res.data });
    } catch (error) {
      console.log("error while uploading via url: ", error);
    } finally {
      setIsUploading(false);
      setStep(1);
      setMethod("");
      setVideoUrl("");
      setLanguages([]);
      setLocations([]);
      setProfessions([]);
      setStatus("DRAFT");
    }
  };
  return (
    <Dialog
      onOpenChange={() => {
        setStep(1);
        setMethod("");
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl gradient-primary border-0 shadow-glow h-10 text-[13px] w-full sm:w-auto">
          <Upload className="h-4 w-4" />
          Upload Reel
        </Button>
      </DialogTrigger>

      <DialogContent
        className="rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[80vh] overflow-y-auto"
        aria-description={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-base">
            {step === 1 ? "Choose Upload Method" : "Reel Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid gap-3">
              <Button
                variant={method === "file" ? "default" : "outline"}
                className="rounded-xl justify-start gap-2"
                onClick={() => setMethod("file")}
              >
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>

              <Button
                variant={method === "url" ? "default" : "outline"}
                className="rounded-xl justify-start gap-2"
                onClick={() => setMethod("url")}
              >
                <Link2 className="h-4 w-4" />
                Upload via URL
              </Button>

              <div className="flex justify-end pt-2">
                <Button
                  className="rounded-xl text-[12px]"
                  disabled={!method}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* FILE METHOD */}
              {method === "file" ? (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    id="video-upload"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                  />

                  <label
                    htmlFor="video-upload"
                    className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 text-[12px]"
                  >
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2" />
                      {file ? file.name : "Click to upload video"}
                    </div>
                  </label>

                  {preview && (
                    <video
                      src={preview}
                      controls
                      className="rounded-xl w-full max-h-60"
                    />
                  )}

                  {/* Source */}
                  <div>
                    <Label className="text-[12px]">Source</Label>
                    <Input
                      className="mt-1.5 rounded-xl"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="Instagram / YouTube / Original"
                    />
                  </div>

                  {/* Source URL */}
                  <div>
                    <Label className="text-[12px]">Source URL</Label>
                    <Input
                      className="mt-1.5 rounded-xl"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://youtube.com/VIDEO_ID"
                    />
                  </div>
                </>
              ) : (
                /* URL METHOD */
                <div>
                  <Label className="text-[12px]">Video URL</Label>
                  <Input
                    className="mt-1.5 rounded-xl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/VIDEO_ID"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <Label className="text-[12px]">Status</Label>
                <Select
                  onValueChange={(value) => setStatus(value as ReelStatus)}
                  value={status}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISH">Published</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Languages */}
              <div>
                <Label className="text-[12px]">Languages</Label>
                <MultiSelect
                  options={indianLanguages.map((lang) => ({
                    label: lang,
                    value: lang.toLowerCase(),
                  }))}
                  selected={languages}
                  onChange={setLanguages}
                  placeholder="Select languages"
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

              {/* Locations */}
              <div>
                <Label className="text-[12px]">Locations</Label>
                <MultiSelect
                  options={topCitiesInIndia.map((city) => ({
                    label: city,
                    value: city.toLowerCase(),
                  }))}
                  selected={locations}
                  onChange={setLocations}
                  placeholder="Select locations"
                />
              </div>

              {/* Professions */}
              <div>
                <Label className="text-[12px]">Professions</Label>
                <MultiSelect
                  options={Topprofessions.map((prof) => ({
                    label: prof,
                    value: prof.toLowerCase(),
                  }))}
                  selected={professions}
                  onChange={setProfessions}
                  placeholder="Select professions"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl text-[12px]"
                  onClick={() => setStep(1)}
                  disabled={isUploading}
                >
                  Back
                </Button>

                <Button
                  className="rounded-xl gradient-primary border-0 text-[12px]"
                  onClick={() => {
                    if (method === "file") {
                      uploadViaFile();
                    } else {
                      uploadViaurl();
                    }
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadReelDialog;
