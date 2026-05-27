"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../MultiSelectComp";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { topCitiesInIndia } from "@/data/cities";
import { Topprofessions } from "@/data/professions";
import { AdType } from "@/generated/prisma/enums";
import { Ad } from "@/generated/prisma/client";
import { indianLanguages } from "@/data/languages";

// type Ad = {
//     id: string;
//     title: string;
//     description: string;
//     url: string;
//     interests: string[];
//     locations: string[];
//     professions: string[];
//     gender: string;
//     status: string;
//     type: AdType;
//     ageMin?: number;
//     ageMax?: number;
//     startAt?: string;
//     endAt?: string;
//     mediaUrl: string;
// };

type Props = {
    ad: Ad | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setUpdateAd: (value: Ad | null) => void;
};

const UpdateAdDialog = ({
    ad,
    open,
    onOpenChange,
    setUpdateAd
}: Props) => {
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

    useEffect(() => {
        if (!ad) return;

        setTitle(ad.title || "");
        setDescription(ad.description || "");
        setUrl(ad.url || "");

        setInterests(ad.interests || []);
        setLocations(ad.locations || []);
        setProfessions(ad.professions || []);
        setLanguages(ad.languages)

        setGender(ad.gender || "all");
        setStatus(ad.status || "DRAFT");
        setType(ad.type || "VIDEO");

        setAgeMin(ad.ageMin || "");
        setAgeMax(ad.ageMax || "");

        setStartAt(
            ad.startAt
                ? new Date(ad.startAt).toISOString().split("T")[0]
                : ""
        );

        setEndAt(
            ad.endAt
                ? new Date(ad.endAt).toISOString().split("T")[0]
                : ""
        );

        setPreview(ad.url || null);
    }, [ad]);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdateAd = async () => {
        if (!ad) return;

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
                status,
                type,
                ageMin,
                ageMax,
                startAt,
                endAt,
            };

            formData.append("ad_info", JSON.stringify(payload));

            if (file) {
                formData.append("file", file);
            }

            const res = await fetch(`/api/ads/update?id=${ad.id}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();

            if (!data.success) {
                console.log(data.message);
                return;
            }

            console.log("Ad updated:", data.data);

            onOpenChange(false);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setUpdateAd(null)

        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            onOpenChange(open);
            setUpdateAd(null)
        }}>
            <DialogContent
                className="!max-w-6xl rounded-3xl border-border/50 p-0 overflow-hidden"
                aria-describedby={undefined}
            >
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] max-h-[90vh]">
                    {/* LEFT MEDIA */}
                    <div className="border-r border-border/40 bg-black flex items-center justify-center p-4">
                        <div className="w-full">
                            {preview ? (
                                <>
                                    {(file?.type.startsWith("video") ||
                                        (!file && type === "VIDEO")) && (
                                            <video
                                                src={preview}
                                                controls
                                                className="w-full rounded-2xl max-h-[75vh] object-contain"
                                            />
                                        )}

                                    {(file?.type.startsWith("image") ||
                                        (!file && type === "IMAGE")) && (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="w-full rounded-2xl max-h-[75vh] object-cover"
                                            />
                                        )}
                                </>
                            ) : (
                                <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-border/50 text-sm text-muted-foreground">
                                    No Preview
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*,video/*"
                                id="update-ad-upload"
                                className="hidden"
                                onChange={(e) =>
                                    handleFileChange(
                                        e.target.files?.[0] || null
                                    )
                                }
                            />

                            <label
                                htmlFor="update-ad-upload"
                                className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/50 bg-secondary/40 px-4 py-3 text-sm"
                            >
                                <Upload className="h-4 w-4" />
                                Change Media
                            </label>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="overflow-y-auto p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                Update Ad
                            </DialogTitle>
                        </DialogHeader>

                        <div className="mt-6 grid gap-5">
                            {/* TITLE */}
                            <div>
                                <Label className="text-[12px]">
                                    Title
                                </Label>

                                <Input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="mt-1.5 rounded-2xl"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <Label className="text-[12px]">
                                    Description
                                </Label>

                                <Textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="mt-1.5 rounded-2xl min-h-28"
                                />
                            </div>

                            {/* URL */}
                            <div>
                                <Label className="text-[12px]">
                                    Redirect URL
                                </Label>

                                <Input
                                    value={url}
                                    onChange={(e) =>
                                        setUrl(e.target.value)
                                    }
                                    className="mt-1.5 rounded-2xl"
                                />
                            </div>

                            {/* INTERESTS */}
                            <div>
                                <Label className="text-[12px]">
                                    Interests
                                </Label>

                                <MultiSelect
                                    options={[
                                        {
                                            label: "Tech",
                                            value: "tech",
                                        },
                                        {
                                            label: "Fashion",
                                            value: "fashion",
                                        },
                                        {
                                            label: "Sports",
                                            value: "sports",
                                        },
                                    ]}
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
                                    options={Topprofessions.map(
                                        (prof) => ({
                                            label: prof,
                                            value:
                                                prof.toLowerCase(),
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
                                        onValueChange={setGender}
                                    >
                                        <SelectTrigger className="mt-1.5 rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>

                                            <SelectItem value="Male">
                                                Male
                                            </SelectItem>

                                            <SelectItem value="Female">
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-[12px]">
                                        Type
                                    </Label>

                                    <Select
                                        value={type}
                                        onValueChange={(v) =>
                                            setType(v as AdType)
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

                            {/* AGE */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-[12px]">
                                        Min Age
                                    </Label>

                                    <Input
                                        type="number"
                                        value={ageMin}
                                        onChange={(e) =>
                                            setAgeMin(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="mt-1.5 rounded-2xl"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[12px]">
                                        Max Age
                                    </Label>

                                    <Input
                                        type="number"
                                        value={ageMax}
                                        onChange={(e) =>
                                            setAgeMax(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="mt-1.5 rounded-2xl"
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
                                        value={startAt}
                                        onChange={(e) =>
                                            setStartAt(
                                                e.target.value
                                            )
                                        }
                                        className="mt-1.5 rounded-2xl"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[12px]">
                                        End Date
                                    </Label>

                                    <Input
                                        type="date"
                                        value={endAt}
                                        onChange={(e) =>
                                            setEndAt(
                                                e.target.value
                                            )
                                        }
                                        className="mt-1.5 rounded-2xl"
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
                                    onValueChange={setStatus}
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
                                onClick={handleUpdateAd}
                                disabled={isLoading}
                                className="mt-2 h-11 rounded-2xl gradient-primary border-0"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    "Update Ad"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAdDialog;