import React, { useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function SearchBarSection({ onFilterChange }) {
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    jobType: "",
    salaryRange: [30, 70],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSliderChange = (value) => {
    setFilters({ ...filters, salaryRange: value });
  };

  const handleSearch = () => {
    const formattedFilters = {
      ...filters,
      salaryRange: filters.salaryRange.join(","),
    };
    onFilterChange(formattedFilters);
  };

  return (
    <Card className="w-full py-4 md:py-6 px-4 md:px-8 bg-white shadow-md rounded-none">
      <div className="flex flex-col gap-4">
        {/* Main Row - Search Inputs, Salary Range and Button */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side - Search Inputs */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-2 lg:gap-4">
            {/* Search Term */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleInputChange}
                className="pl-10 h-12 text-sm md:text-base font-medium placeholder:text-[#686868] border-none bg-gray-50 rounded-md"
                placeholder="Search By Job Title, Role"
              />
            </div>

            {/* Location */}
            <div className="hidden md:block">
              <Separator orientation="vertical" className="h-12" />
            </div>
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <Select onValueChange={(value) => handleSelectChange("location", value)}>
                <SelectTrigger className="pl-10 h-12 text-sm md:text-base font-medium text-[#686868] border-none bg-gray-50 rounded-md">
                  <SelectValue placeholder="Preferred Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div className="hidden md:block">
              <Separator orientation="vertical" className="h-12" />
            </div>
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Briefcase className="h-5 w-5 text-gray-500" />
              </div>
              <Select onValueChange={(value) => handleSelectChange("jobType", value)}>
                <SelectTrigger className="pl-10 h-12 text-sm md:text-base font-medium text-[#686868] border-none bg-gray-50 rounded-md">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Side - Salary Range and Button (only on large screens) */}
          <div className="hidden lg:flex items-end gap-4 w-[400px]">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm md:text-base text-[#222222]">Salary Per Month</span>
                <span className="font-bold text-sm md:text-base text-[#222222]">
                  ${filters.salaryRange[0]}k - ${filters.salaryRange[1]}k
                </span>
              </div>
              <div className="px-2 py-1 relative">
                <Slider
                  defaultValue={filters.salaryRange}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleSliderChange}
                />
                <div className="absolute left-0 top-1/2 w-[15px] h-[15px] bg-white rounded-full border-[5px] border-solid border-black -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-[15px] h-[15px] bg-white rounded-full border-[5px] border-solid border-black -translate-y-1/2"></div>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              variant="lightBlue"
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Bottom Row - Salary Range and Button (mobile/tablet) */}
        <div className="flex flex-col sm:flex-row gap-4 items-center lg:hidden">
          {/* Salary Range */}
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm md:text-base text-[#222222]">Salary Per Month</span>
              <span className="font-bold text-sm md:text-base text-[#222222]">
                ${filters.salaryRange[0]}k - ${filters.salaryRange[1]}k
              </span>
            </div>
            <div className="px-2 py-1 relative">
              <Slider
                defaultValue={filters.salaryRange}
                max={100}
                step={1}
                className="w-full"
                onValueChange={handleSliderChange}
              />
              <div className="absolute left-0 top-1/2 w-[15px] h-[15px] bg-white rounded-full border-[5px] border-solid border-black -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 w-[15px] h-[15px] bg-white rounded-full border-[5px] border-solid border-black -translate-y-1/2"></div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            variant="lightBlue"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:py-3"
          >
            Search
          </Button>
        </div>

        {/* Mobile-only filters */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="h-5 w-5 text-gray-500" />
            </div>
            <Select onValueChange={(value) => handleSelectChange("location", value)}>
              <SelectTrigger className="pl-10 h-12 text-sm font-medium text-[#686868] border-none bg-gray-50 rounded-md">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="California">California</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <Select onValueChange={(value) => handleSelectChange("jobType", value)}>
              <SelectTrigger className="pl-10 h-12 text-sm font-medium text-[#686868] border-none bg-gray-50 rounded-md">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="parttime">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}