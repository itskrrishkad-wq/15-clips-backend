import { Reel } from "@/generated/prisma";
import { BookmarkIcon, EyeIcon } from "lucide-react";
import { Badge } from "../ui/badge";

const ReelCardPreview = ({ reel }: { reel: Reel }) => {
  return (
    <div className="relative w-full max-w-52 aspect-9/16 rounded-sm overflow-hidden">
      <video src={reel.reelUrl} className="w-full h-full aspect-9/16" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent p-3">
        <div className="flex h-full w-full items-end justify-start gap-3">
          <div className="flex gap-1 items-center">
            <EyeIcon className="w-3 h-3 shrink-0 text-gray-200" />
            <span className="text-gray-200 text-xs">{reel.viewCount}</span>
          </div>

          <div className="flex gap-1 items-center">
            <BookmarkIcon className="w-3 h-3 shrink-0 text-gray-200" />
            <span className="text-gray-200 text-xs">{reel.saveCount}</span>
          </div>
          <div className="flex gap-1 items-center">
            <Badge
              className="text-xs py-0.5 "
              variant={
                reel.status === "DRAFT"
                  ? "secondary"
                  : reel.status === "PUBLISH"
                    ? "default"
                    : "ghost"
              }
            >
              <span className="text-xs">{reel.status}</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCardPreview;
