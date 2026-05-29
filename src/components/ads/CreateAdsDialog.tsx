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
import {
  Loader2,
  PlusCircle,
  Upload,
} from "lucide-react";
import { topCitiesInIndia } from "@/data/cities";
import { Textarea } from "../ui/textarea";
import { AdType } from "@/generated/prisma/enums";
import { indianLanguages } from "@/data/languages";
import { PROFESSIONS } from "@/data/professions";
import { INTERESTS } from "@/data/intrests";

const CreateAdsDialog = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [url, setUrl] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("DRAFT");
  const [type, setType] = useState<AdType>("VIDEO");

  const [ageMin, setAgeMin] = useState<number | "">("");
  const [ageMax, setAgeMax] = useState<number | "">("");

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (
    file: File | null
  ) => {
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));

    if (file.type.startsWith("image")) {
      setType("IMAGE");
    }

    if (file.type.startsWith("video")) {
      setType("VIDEO");
    }
  };

  const resetForm = () => {
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
  };

  const handleCreateAd = async () => {
    if (!file) {
      alert("Please upload an ad file");
      return;
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
        languages,
        gender,
        startAt,
        endAt,
        status,
        type,
        ageMin,
        ageMax,
      };

      formData.append("file", file);
      formData.append(
        "ads_info",
        JSON.stringify(payload)
      );

      const res = await fetch(
        "/api/ads/create",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!data.success) {
        console.log(
          "Error:",
          data.message
        );
        return;
      }

      console.log(
        "Ad Created:",
        data.data
      );

      resetForm();
    } catch (error) {
      console.log(
        "Error creating ad:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 rounded-xl border-0 gradient-primary text-[13px]">
          <PlusCircle className="h-4 w-4" />
          Create Ad
        </Button>
      </DialogTrigger>

      <DialogContent
        className="overflow-hidden rounded-3xl border-border/50 p-0 !max-w-6xl"
        aria-describedby={undefined}
      >
        <div className="grid max-h-[90vh] grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)]">
          {/* LEFT SIDE */}
          <div className="flex items-center justify-center border-r border-border/40 bg-black/80 p-4">
            <div className="w-full">
              {preview ? (
                <>
                  {type === "VIDEO" && (
                    <video
                      src={preview}
                      controls
                      className="max-h-[75vh] w-full rounded-2xl object-contain"
                    />
                  )}

                  {type === "IMAGE" && (
                    <img
                      src={preview}
                      alt="preview"
                      className="max-h-[75vh] w-full rounded-2xl object-contain"
                    />
                  )}
                </>
              ) : (
                <label
                  htmlFor="ad-upload"
                  className="flex h-[500px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-secondary/20 text-center"
                >
                  <Upload className="mb-4 h-10 w-10 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    Upload Ad Media
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Image or Video
                  </p>
                </label>
              )}

              {/* FILE INPUT */}
              <input
                type="file"
                accept="image/*,video/*"
                id="ad-upload"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(
                    e.target.files?.[0] ||
                    null
                  )
                }
              />

              {preview && (
                <label
                  htmlFor="ad-upload"
                  className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/50 bg-secondary/40 px-4 py-3 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  Change Media
                </label>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="overflow-y-auto overflow-x-hidden p-6">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Create Ad
              </DialogTitle>
            </DialogHeader>

            <div className="mt-6 grid gap-5">
              {/* TITLE */}
              <div>
                <Label className="text-[12px]">
                  Title
                </Label>

                <Input
                  className="mt-1.5 rounded-2xl"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label className="text-[12px]">
                  Description
                </Label>

                <Textarea
                  className="mt-1.5 min-h-28 rounded-2xl"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* URL */}
              <div>
                <Label className="text-[12px]">
                  Redirect URL
                </Label>

                <Input
                  className="mt-1.5 rounded-2xl"
                  value={url}
                  onChange={(e) =>
                    setUrl(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* INTERESTS */}
              <div>
                <Label className="text-[12px]">
                  Interests
                </Label>

                <MultiSelect
                  options={INTERESTS.map((lang) => ({
                    label: lang.label,
                    value: lang.id,
                  }))}
                  selected={interests}
                  onChange={setInterests}
                  placeholder="Select interests"
                />
              </div>

              {/* LOCATIONS */}
              <div>
                <Label className="text-[12px]">
                  Locations
                </Label>

                <MultiSelect
                  options={topCitiesInIndia.map(
                    (city) => ({
                      label: city,
                      value:
                        city.toLowerCase(),
                    })
                  )}
                  selected={locations}
                  onChange={setLocations}
                  placeholder="Select locations"
                />
              </div>

              {/* Languages */}
              <div>
                <Label className="text-[12px]">Languages</Label>
                <MultiSelect
                  options={indianLanguages.map((lang) => ({
                    label: lang.label,
                    value: lang.value.toLowerCase(),
                  }))}
                  selected={languages}
                  onChange={setLanguages}
                  placeholder="Select languages"
                />
              </div>

              {/* PROFESSIONS */}
              <div>
                <Label className="text-[12px]">
                  Professions
                </Label>

                <MultiSelect
                  options={PROFESSIONS.map(
                    (prof) => ({
                      label: prof.label,
                      value:
                        prof.id,
                    })
                  )}
                  selected={professions}
                  onChange={setProfessions}
                  placeholder="Select professions"
                />
              </div>

              {/* GENDER + TYPE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[12px]">
                    Gender
                  </Label>

                  <Select
                    value={gender}
                    onValueChange={
                      setGender
                    }
                  >
                    <SelectTrigger className="mt-1.5 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        All
                      </SelectItem>

                      <SelectItem value="male">
                        Male
                      </SelectItem>

                      <SelectItem value="female">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[12px]">
                    Ad Type
                  </Label>

                  <Select
                    value={type}
                    onValueChange={(
                      value
                    ) =>
                      setType(
                        value as AdType
                      )
                    }
                  >
                    <SelectTrigger className="mt-1.5 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="VIDEO">
                        VIDEO
                      </SelectItem>

                      <SelectItem value="IMAGE">
                        IMAGE
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* AGE RANGE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[12px]">
                    Min Age
                  </Label>

                  <Input
                    type="number"
                    className="mt-1.5 rounded-2xl"
                    value={ageMin}
                    onChange={(e) =>
                      setAgeMin(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="text-[12px]">
                    Max Age
                  </Label>

                  <Input
                    type="number"
                    className="mt-1.5 rounded-2xl"
                    value={ageMax}
                    onChange={(e) =>
                      setAgeMax(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[12px]">
                    Start Date
                  </Label>

                  <Input
                    type="date"
                    className="mt-1.5 rounded-2xl"
                    value={startAt}
                    onChange={(e) =>
                      setStartAt(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="text-[12px]">
                    End Date
                  </Label>

                  <Input
                    type="date"
                    className="mt-1.5 rounded-2xl"
                    value={endAt}
                    onChange={(e) =>
                      setEndAt(
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* STATUS */}
              <div>
                <Label className="text-[12px]">
                  Status
                </Label>

                <Select
                  value={status}
                  onValueChange={
                    setStatus
                  }
                >
                  <SelectTrigger className="mt-1.5 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACTIVE">
                      Active
                    </SelectItem>

                    <SelectItem value="PAUSED">
                      Paused
                    </SelectItem>

                    <SelectItem value="DRAFT">
                      Draft
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* BUTTON */}
              <Button
                className="mt-2 h-11 rounded-2xl border-0 gradient-primary"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdsDialog;