import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, DollarSignIcon, MapPinIcon } from "lucide-react";
import React from "react";

export default function JobListingsSection({ jobListings }) {
  // Function to calculate time difference
  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);

    // If the createdAt date is in the future, treat it as "just created"
    if (createdDate > now) {
      return "Just now";
    }

    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m Ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h Ago`;
    } else {
      return `${diffInDays}d Ago`;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
      {jobListings.map((job) => (
        <Card
          key={job.id}
          className="w-full h-auto min-h-[400px] max-w-[400px] mx-auto relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
        >
          <CardContent className="p-4 md:p-6">
            {/* Company Logo and Title Section */}
            <div className="flex flex-col sm:flex-row mb-4 gap-4">
              {/* Company Logo */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
                <img
                  className="w-full h-full object-contain p-2"
                  alt="Company logo"
                  src={job.companyProfilePhoto || "/default-company.png"}
                  onError={(e) => {
                    e.target.src = "/default-company.png";
                  }}
                />
              </div>

              {/* Title and Time Badge - now in a column below the image on mobile */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Job Title - full width on mobile, then flex on sm+ */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {job.title}
                </h3>

                {/* Posted Time Badge - aligned to right on all screens */}
                <Badge
                  variant="lightBlue"
                  className="flex-shrink-0 bg-blue-100 text-blue-800 hover:bg-blue-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm sm:self-center"
                >
                  {getTimeDifference(job.createdAt)}
                </Badge>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-col gap-2 mb-4 text-sm md:text-base">
              <div className="flex items-center gap-2 text-gray-700">
                <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.jobType}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <DollarSignIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.salaryRange}</span>
              </div>
            </div>

            {/* Job Description */}
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
