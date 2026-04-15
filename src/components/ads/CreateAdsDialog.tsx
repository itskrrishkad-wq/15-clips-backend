"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MultiSelect } from "../MultiSelectComp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle, Upload } from "lucide-react";
import { topCitiesInIndia } from "@/data/cities";
import { Topprofessions } from "@/data/professions";
import { Textarea } from "../ui/textarea";
import { AdType } from "@/generated/prisma";

const CreateAdsDialog = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [url, setUrl] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);

  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("DRAFT");
  const [type, setType] = useState<AdType>("VIDEO");

  const [ageMin, setAgeMin] = useState<number | "">("");
  const [ageMax, setAgeMax] = useState<number | "">("");

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreateAd = async () => {
    if (!file) {
      return alert("Please upload an ad file");
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      const payload = {
        title,
        description,
        url,
        interests,
        locations,
        professions,
        gender,
        startAt,
        endAt,
        status,
        type,
        ageMin,
        ageMax,
      };

      formData.append("file", file);
      formData.append("ads_info", JSON.stringify(payload));

      const res = await fetch("/api/ads/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        console.log("Error:", data.message);
        return;
      }

      console.log("Ad Created:", data.data);
    } catch (error) {
      console.log("Error creating ad:", error);
    } finally {
      setIsLoading(false);

      // reset
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      setUrl("");
      setInterests([]);
      setLocations([]);
      setProfessions([]);
      setGender("all");
      setStatus("DRAFT");
      setType("VIDEO");
      setAgeMin("");
      setAgeMax("");
      setStartAt("");
      setEndAt("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl gradient-primary border-0 h-10 text-[13px]">
          <PlusCircle className="h-4 w-4" />
          Create Ad
        </Button>
      </DialogTrigger>

      <DialogContent
        className="rounded-2xl !max-w-lg max-h-[80vh] overflow-y-auto"
        aria-description={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-base">Create Ad</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div>
            <Label className="text-[12px]">Title</Label>
            <Input
              className="mt-1.5 rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-[12px]">Description</Label>
            <Textarea
              className="mt-1.5 rounded-xl"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept="image/*,video/*"
            id="ad-upload"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />

          <label
            htmlFor="ad-upload"
            className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 text-[12px]"
          >
            <div className="text-center">
              <Upload className="h-6 w-6 mx-auto mb-2" />
              {file ? file.name : "Click to upload ad (image/video)"}
            </div>
          </label>

          {preview && file?.type.startsWith("video") && (
            <video
              src={preview}
              controls
              className="rounded-xl w-full max-h-60"
            />
          )}

          {preview && file?.type.startsWith("image") && (
            <img
              src={preview}
              alt="preview"
              className="rounded-xl w-full max-h-60 object-cover"
            />
          )}

          {/* URL */}
          <div>
            <Label className="text-[12px]">Target URL</Label>
            <Input
              className="mt-1.5 rounded-xl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {/* Interests */}
          <div>
            <Label className="text-[12px]">Interests</Label>
            <MultiSelect
              options={[
                { label: "Tech", value: "tech" },
                { label: "Fashion", value: "fashion" },
                { label: "Sports", value: "sports" },
              ]}
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

          {/* Gender */}
          <div>
            <Label className="text-[12px]">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[12px]">Min Age</Label>
              <Input
                type="number"
                className="mt-1.5 rounded-xl"
                value={ageMin}
                onChange={(e) => setAgeMin(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[12px]">Max Age</Label>
              <Input
                type="number"
                className="mt-1.5 rounded-xl"
                value={ageMax}
                onChange={(e) => setAgeMax(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <Label className="text-[12px]">Start Date</Label>
            <Input
              type="date"
              className="mt-1.5 rounded-xl"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-[12px]">End Date</Label>
            <Input
              type="date"
              className="mt-1.5 rounded-xl"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <Label className="text-[12px]">Ad Type</Label>
            <Select value={type} onValueChange={(value) => setType("VIDEO")}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="IMAGE">IMAGE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label className="text-[12px]">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action */}
          <Button
            className="rounded-xl gradient-primary border-0 text-[12px]"
            onClick={handleCreateAd}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Ad"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdsDialog;
