"use client";

import ReelCardPreview from "@/components/reels/ReelCard";
import UpdateReelDialog from "@/components/reels/UpdateReelDialog";
import UploadReelDialog from "@/components/reels/UploadReelDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reel } from "@/generated/prisma";
import { Film } from "lucide-react";
import { useEffect, useState } from "react";

function ReelTable({ reels }: { reels: Reel[] }) {
  const [updateReel, setUpdateReel] = useState<Reel | null>(null);
  console.log({ reels });
  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Film className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No reels found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="overflow-x-auto">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {reels.map((reel) => {
              return (
                <div
                  key={reel.id}
                  className="w-full h-full cursor-pointer"
                  onClick={() => setUpdateReel(reel)}
                >
                  <ReelCardPreview reel={reel} />
                </div>
              );
            })}
          </div>
          <UpdateReelDialog
            onOpenChange={setUpdateReel}
            open={!!updateReel}
            reel={updateReel!}
          />
        </div>
      </div>
    </>
  );
}

export default function ReelsPage() {
  const [reels, setReels] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // filter helper
  // const filtered = (lists: Reel[]) =>
  //   lists.filter((r) => r.source?.toLowerCase().includes(search.toLowerCase()));

  // derived lists
  const published = reels.filter((r) => r.status === "PUBLISH");

  const drafts = reels.filter((r) => r.status === "DRAFT");

  useEffect(() => {
    const fetch_reels = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reels/get-all", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          console.log("Failed to fetch reels");
          return;
        }

        setReels(data.data || []);
        console.log("reels data: ", data.data);
      } catch (error) {
        console.log("error while fetching reels", error);
      } finally {
        setLoading(false);
      }
    };

    fetch_reels();
  }, []);
  return (
    <>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <h2 className="text-2xl font-semibold">Reels</h2>
          </div>
        </div>

        <UploadReelDialog />
      </div>

      <div className="rounded-2xl bg-card shadow-card overflow-hidden">
        <Tabs defaultValue="all" className="w-full ">
          <TabsList className="flex w-max !h-auto gap-2 border-b border-border/50 bg-transparent px-4 pt-2 overflow-x-auto ">
            <TabsTrigger
              value="all"
              className="w-max h-auto px-3 py-2 text-xs font-medium rounded-t-lg border-x-0 border-t-0 border-b-2 border-transparent text-muted-foreground transition-all data-[state=active]:text-foreground data-[state=active]:border-blue-600 data-[state=active]:bg-blue-200/30"
            >
              All ({reels.length})
            </TabsTrigger>

            <TabsTrigger
              value="published"
              className="w-max h-auto px-3 py-2 text-xs font-medium rounded-t-lg border-x-0 border-t-0 border-b-2 border-transparent text-muted-foreground transition-all data-[state=active]:text-foreground data-[state=active]:border-blue-600 data-[state=active]:bg-blue-200/30"
            >
              Published ({published.length})
            </TabsTrigger>

            <TabsTrigger
              value="drafts"
              className="w-max h-auto px-3 py-2 text-xs font-medium rounded-t-lg border-x-0 border-t-0 border-b-2 border-transparent text-muted-foreground transition-all data-[state=active]:text-foreground data-[state=active]:border-blue-600 data-[state=active]:bg-blue-200/30"
            >
              Drafts ({drafts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 p-0 ">
            <ReelTable reels={reels} />
          </TabsContent>

          <TabsContent value="published" className="mt-0 p-0">
            <ReelTable reels={published} />
          </TabsContent>

          <TabsContent value="drafts" className="mt-0 p-0">
            <ReelTable reels={drafts} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
