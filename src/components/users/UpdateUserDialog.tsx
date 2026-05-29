"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { MultiSelect } from "@/components/MultiSelectComp";

import { Loader2 } from "lucide-react";

import { topCitiesInIndia } from "@/data/cities";
import { indianLanguages } from "@/data/languages";

import { User } from "@/generated/prisma/client";
import { PROFESSIONS } from "@/data/professions";
import { INTERESTS } from "@/data/intrests";

type Props = {
    user: User | null;

    open: boolean;

    onOpenChange: (open: boolean) => void;

    setUpdateUser: (value: User | null) => void;
};

const UpdateUserDialog = ({
    user,
    open,
    onOpenChange,
    setUpdateUser,
}: Props) => {
    const [name, setName] = useState("");
    const [lname, setLname] = useState("");

    const [email, setEmail] = useState("");

    const [location, setLocation] = useState("");

    const [interests, setInterests] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);

    const [profession, setProfession] = useState("");

    const [phoneNo, setPhoneNo] = useState("");

    const [gender, setGender] = useState("");



    const [dailyTimeSpent, setDailyTimeSpent] = useState<
        number | ""
    >("");


    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setLname(user.lname || "");

        setEmail(user.email || "");

        setLocation(user.location || "");

        setInterests(user.interests || []);
        setLanguages(user.languages || []);

        setProfession(user.profession || "");



        setPhoneNo(user.phoneNo || "");

        setGender(user.gender || "");


        setDailyTimeSpent(user.dailyTimeSpent || "");

    }, [user]);

    const handleUpdateUser = async () => {
        if (!user) return;

        try {
            setIsLoading(true);

            const payload = {
                name,
                lname,
                email,
                location,
                interests,
                languages,
                profession,
                phoneNo,
                gender,
                dailyTimeSpent,
            };

            const res = await fetch(
                `/api/users/update?id=${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!data.success) {
                console.log(data.message);
                return;
            }

            console.log("User updated:", data.data);

            onOpenChange(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setUpdateUser(null);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                onOpenChange(open);
                setUpdateUser(null);
            }}
        >
            <DialogContent
                className="!max-w-4xl rounded-3xl border-border/50 p-0 overflow-hidden"
                aria-describedby={undefined}
            >
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Update User
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 grid gap-5">
                        {/* NAME */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-[12px]">
                                    First Name
                                </Label>

                                <Input
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    className="mt-1.5 rounded-2xl"
                                />
                            </div>

                            <div>
                                <Label className="text-[12px]">
                                    Last Name
                                </Label>

                                <Input
                                    value={lname}
                                    onChange={(e) =>
                                        setLname(e.target.value)
                                    }
                                    className="mt-1.5 rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <Label className="text-[12px]">
                                Email
                            </Label>

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="mt-1.5 rounded-2xl"
                            />
                        </div>

                        {/* LOCATION */}
                        <div>
                            <Label className="text-[12px]">
                                Location
                            </Label>

                            <Select
                                value={location}
                                onValueChange={setLocation}
                            >
                                <SelectTrigger className="mt-1.5 rounded-2xl">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>

                                <SelectContent>
                                    {topCitiesInIndia.map(
                                        (city) => (
                                            <SelectItem
                                                key={city}
                                                value={city}
                                            >
                                                {city}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
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

                        {/* LANGUAGES */}
                        <div>
                            <Label className="text-[12px]">
                                Languages
                            </Label>

                            <MultiSelect
                                options={indianLanguages.map(
                                    (lang) => ({
                                        label: lang.label,
                                        value:
                                            lang.label,
                                    })
                                )}
                                selected={languages}
                                onChange={setLanguages}
                                placeholder="Select languages"
                            />
                        </div>

                        {/* PROFESSION */}
                        <div>
                            <Label className="text-[12px]">
                                Profession
                            </Label>

                            <Select
                                value={profession}
                                onValueChange={setProfession}
                            >
                                <SelectTrigger className="mt-1.5 rounded-2xl">
                                    <SelectValue placeholder="Select profession" />
                                </SelectTrigger>

                                <SelectContent>
                                    {PROFESSIONS.map((prof) => (
                                        <SelectItem
                                            key={prof.id}
                                            value={prof.id}
                                        >
                                            {prof.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* DOB + PHONE */}
                        {/* <div className="grid grid-cols-2 gap-3">


                            <div>
                                <Label className="text-[12px]">
                                    Phone Number
                                </Label>

                                <Input
                                    value={phoneNo}
                                    onChange={(e) =>
                                        setPhoneNo(
                                            e.target.value
                                        )
                                    }
                                    className="mt-1.5 rounded-2xl"
                                />
                            </div>
                        </div> */}

                        {/* GENDER + ACCOUNT TYPE */}
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
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Male">
                                            Male
                                        </SelectItem>

                                        <SelectItem value="Female">
                                            Female
                                        </SelectItem>

                                        <SelectItem value="Other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* DAILY TIME */}
                        <div>
                            <Label className="text-[12px]">
                                Daily Time Spent (minutes)
                            </Label>

                            <Input
                                type="number"
                                value={dailyTimeSpent}
                                onChange={(e) =>
                                    setDailyTimeSpent(
                                        Number(e.target.value)
                                    )
                                }
                                className="mt-1.5 rounded-2xl"
                            />
                        </div>

                        {/* BUTTON */}
                        <Button
                            onClick={handleUpdateUser}
                            disabled={isLoading}
                            className="mt-2 h-11 rounded-2xl gradient-primary border-0"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating...
                                </span>
                            ) : (
                                "Update User"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;