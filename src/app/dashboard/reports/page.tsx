"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Download, Megaphone, User } from "lucide-react";
import { useEffect, useState } from "react";

function SettingCard({
    icon: Icon,
    title,
    children,
}: {
    icon: any;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-card animate-fade-in">
            <div className="mb-4 sm:mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shrink-0">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function ReportsPage() {

    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/report/get-all", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!data.success) return;

                setReports(data.data || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);


    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) {
        return null;
    }
    return (
        <>
            <div className="grid max-w-3xl gap-4 sm:gap-6">
                <SettingCard icon={Megaphone} title="Ads Settings">
                    <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3 sm:p-4">
                        <div className="min-w-0 mr-3">
                            <p className="text-[13px] font-medium">Ad Frequency Control</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Limit how often ads are shown
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <Label className="text-[12px]">Max ads per session</Label>
                        <Input
                            type="number"
                            defaultValue="3"
                            className="mt-1.5 w-32 rounded-xl"
                        />
                    </div>
                </SettingCard>

                <SettingCard icon={Download} title="Reports">
                    <div className="flex flex-wrap gap-2.5">
                        {["User Report", "Reels Report", "Ads Report"].map((r) => (
                            <Button
                                key={r}
                                variant="outline"
                                className="gap-2 rounded-xl text-[12px] border-border/60 hover:bg-secondary hover:shadow-soft transition-all"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {r}
                            </Button>
                        ))}
                    </div>
                </SettingCard>

                <SettingCard icon={Bell} title="Notification Settings">
                    <div className="space-y-3">
                        {[
                            "Email notifications",
                            "Push notifications",
                            "Weekly summary",
                            "New user alerts",
                        ].map((label) => (
                            <div
                                key={label}
                                className="flex items-center justify-between rounded-xl bg-secondary/40 px-3 sm:px-4 py-3"
                            >
                                <span className="text-[13px] mr-3">{label}</span>
                                <Switch defaultChecked />
                            </div>
                        ))}
                    </div>
                </SettingCard>

                <SettingCard icon={User} title="Account Settings">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[12px]">Name</Label>
                                <Input
                                    defaultValue="Alex Holland"
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>
                            <div>
                                <Label className="text-[12px]">Email</Label>
                                <Input
                                    defaultValue="alex@admin.com"
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>
                        </div>
                        <Button className="w-fit rounded-xl gradient-primary border-0 text-[12px]">
                            Save Changes
                        </Button>
                    </div>
                </SettingCard>
            </div>
        </>
    );
}
