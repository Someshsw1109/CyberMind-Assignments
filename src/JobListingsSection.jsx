import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BriefcaseIcon,
  DollarSignIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";

// Company logos mapping
const companyLogos = {
  Amazon: "https://www.pngmart.com/files/23/Amazon-Logo-White-PNG-File.png",
  Tesla: "https://th.bing.com/th/id/OIP.QZRUtEA8SeOZrUtbE7XCegHaHa?rs=1&pid=ImgDetMain",
  Microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  Google: "https://static.vecteezy.com/system/resources/previews/011/598/471/non_2x/google-logo-icon-illustration-free-vector.jpg",
  Apple: "https://th.bing.com/th/id/OIP.9g4dkKVAUyciOuDI9_vEYQHaHa?rs=1&pid=ImgDetMain",
  Facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  Spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
};

export default function JobListingsSection({ jobListings }) {
  const getDisplayTime = (createdAt) => {
    if (!createdAt) return "Today";

    const createdDate = new Date(createdAt);
    if (isNaN(createdDate.getTime())) return "Today";

    const now = new Date();

    // Strip time to compare just the date
    const created = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = today - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
      {jobListings.map((job) => (
        <Card
          key={job.id}
          className="w-full h-auto min-h-[400px] max-w-[400px] mx-auto relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
        >
          <CardContent className="p-4 md:p-6">
            {/* Logo, Company Name and Title */}
            <div className="flex flex-col sm:flex-row mb-4 gap-4">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
                <img
                  className="w-full h-full object-contain p-2"
                  alt="Company logo"
                  src={companyLogos[job.company_name] || "/default-company.png"}
                  onError={(e) => {
                    e.target.src = "/default-company.png";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {job.title}
                </h3>
                <span className="text-sm text-gray-600 font-medium">
                  {job.company_name || "Unknown Company"}
                </span>
              </div>

              <Badge
                variant="lightBlue"
                className="absolute top-4 right-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-2 py-0.5 rounded-full text-xs"
              >
                {getDisplayTime(job.created_at)}
              </Badge>
            </div>

            {/* Job Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm md:text-base text-gray-700">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{job.experience || "1–3 yr Exp"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{job.location || "Onsite"}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSignIcon className="h-4 w-4" />
                <span>{job.salary_range || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{job.job_type || "Full-time"}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 line-clamp-3">
              {job.description}
            </div>

            {/* Apply Button */}
            <Button
              variant="lightBlue"
              className="w-full text-sm md:text-base py-2 md:py-2.5"
            >
              Apply Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
