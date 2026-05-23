"use client";

import { useState } from "react";

import {
    Globe,
    Layers3,
    Plus,
    PlusIcon,
    Radio,
    Tag
} from "lucide-react";

import { MultiSelect } from "@/components/MultiSelectComp";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSourceStore } from "@/zustand/sourceStore";
import { Button } from "../ui/button";

const categoriesOptions = [
    "Political",
    "Geopolitics",
    "Crime",
    "Business",
    "Sports",
    "Entertainment",
    "Technology",
    "Finance",
    "International",
    "Startup",
    "Education",
    "Health",
].map((item) => ({
    label: item,
    value: item,
}));

const sourceOptions = [
    "YOUTUBE",
    "INSTAGRAM",
].map((item) => ({
    label: item,
    value: item,
}));

const languageOptions = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Gujarati",
].map((item) => ({
    label: item,
    value: item,
}));

const CreateSourceDialog = () => {
    const { addSource } = useSourceStore()
    const [channelName, setChannelName] =
        useState("");

    const [categories, setCategories] =
        useState<string[]>([]);

    const [language, setLanguage] =
        useState("");

    const [source, setSource] =
        useState("");

    const [isCreating, setIsCreating] =
        useState(false);

    const handleCreate = async () => {
        try {
            setIsCreating(true);

            const payload = {
                channelName,
                categories,
                language,
                source,
            };

            console.log(
                "create source payload:",
                payload
            );

            const respnose = await fetch("/api/source/create", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(payload)
            })

            const res = await respnose.json();

            if (!res.success) {
                console.log("error creating source: ", res.message);
                return;
            }


            addSource(res.data);

        } catch (error) {
            console.log(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog
        >
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl gradient-primary border-0 shadow-glow h-10 text-[13px] w-full sm:w-auto">
                    <PlusIcon className="h-4 w-4" />
                    Create Source
                </Button>
            </DialogTrigger>
            <DialogContent
                className="
          overflow-hidden
          border-0 p-0
          sm:max-w-2xl
          sm:rounded-3xl
        "
                aria-describedby={undefined}
            >
                <DialogTitle className="hidden">
                    Create Source
                </DialogTitle>

                <div
                    className="
            flex flex-col
            bg-background
          "
                >
                    {/* HEADER */}
                    <div
                        className="
              border-b border-border
              px-6 py-6
            "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                  flex h-16 w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                "
                            >
                                <Plus
                                    className="
                    h-8 w-8
                    text-primary
                  "
                                />
                            </div>

                            <div className="flex-1">
                                <p
                                    className="
                    text-xs font-semibold
                    uppercase tracking-wider
                    text-muted-foreground
                  "
                                >
                                    Create Source
                                </p>

                                <h2
                                    className="
                    mt-1 text-2xl
                    font-bold
                  "
                                >
                                    Add New Source
                                </h2>

                                <p
                                    className="
                    mt-1 text-sm
                    text-muted-foreground
                  "
                                >
                                    Create a new news source
                                    with categories and
                                    language
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div
                        className="
              space-y-6
              p-6
            "
                    >
                        {/* CHANNEL NAME */}
                        <div className="space-y-2">
                            <label
                                className="
                  flex items-center gap-2
                  text-sm font-medium
                "
                            >
                                <Tag size={16} />
                                Channel Name
                            </label>

                            <input
                                value={channelName}
                                onChange={(e) =>
                                    setChannelName(
                                        e.target.value
                                    )
                                }
                                placeholder="@ndtv"
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

                        {/* CATEGORIES */}
                        <div>
                            <p
                                className="
                  mb-2 flex items-center
                  gap-2 text-sm
                  font-medium
                "
                            >
                                <Layers3 size={16} />
                                Categories
                            </p>

                            <MultiSelect
                                options={
                                    categoriesOptions
                                }
                                selected={categories}
                                onChange={
                                    setCategories
                                }
                                placeholder="Select categories"
                            />
                        </div>

                        {/* LANGUAGE */}
                        <div className="space-y-2">
                            <label
                                className="
                  flex items-center gap-2
                  text-sm font-medium
                "
                            >
                                <Globe size={16} />
                                Language
                            </label>

                            <select
                                value={language}
                                onChange={(e) =>
                                    setLanguage(
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
                            >
                                <option value="">
                                    Select language
                                </option>

                                {languageOptions.map(
                                    (item) => (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* SOURCE */}
                        <div className="space-y-2">
                            <label
                                className="
                  flex items-center gap-2
                  text-sm font-medium
                "
                            >
                                <Radio size={16} />
                                Source
                            </label>

                            <select
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
                            >
                                <option value="">
                                    Select source
                                </option>

                                {sourceOptions.map(
                                    (item) => (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* ACTIONS */}
                        <div
                            className="
                flex items-center
                justify-end gap-3
                border-t border-border
                pt-5
              "
                        >
                            <DialogClose asChild>
                                <button

                                    className="
                  h-11 rounded-xl
                  border border-border
                  px-5 text-sm
                  font-medium
                  transition-all
                  hover:bg-muted
                "
                                >
                                    Cancel
                                </button>
                            </DialogClose>

                            <button
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="
                  h-11 rounded-xl
                  bg-primary px-5
                  text-sm font-medium
                  text-primary-foreground
                  transition-all
                  hover:opacity-90
                  disabled:opacity-50
                "
                            >
                                {isCreating
                                    ? "Creating..."
                                    : "Create Source"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSourceDialog;