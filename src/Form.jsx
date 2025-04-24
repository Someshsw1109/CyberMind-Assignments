import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React, { useState, useRef } from "react";
import axios from "axios";
import { config } from "./config/config";

export default function Form({ onClose, onJobSubmit }) {
  const [jobData, setJobData] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "",
    salaryRange: "",
    description: "",
    requirements: "",
    responsibilities: "",
    applicationDeadline: "",
  });

  const [companyProfilePhoto, setCompanyProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setJobData({ ...jobData, jobType: value });
  };

  const handleFileChange = (e) => {
    setCompanyProfilePhoto(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!jobData.title) newErrors.title = "Job title is required";
    if (!jobData.companyName) newErrors.companyName = "Company name is required";
    if (!jobData.location) newErrors.location = "Location is required";
    if (!jobData.jobType) newErrors.jobType = "Job type is required";
    if (!jobData.salaryRange) newErrors.salaryRange = "Salary range is required";
    if (!jobData.description) newErrors.description = "Description is required";
    if (!jobData.requirements) newErrors.requirements = "Requirements are required";
    if (!jobData.responsibilities) newErrors.responsibilities = "Responsibilities are required";
    if (!jobData.applicationDeadline) newErrors.applicationDeadline = "Application deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(jobData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (companyProfilePhoto) {
      formData.append("companyProfilePhoto", companyProfilePhoto);
    }

    try {
      const response = await axios.post(
        `${config.backend.baseUrl}/jobs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newJob = response.data;
      onJobSubmit(newJob);
      onClose();
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickOutside = (event) => {
    if (
      formRef.current &&
      !formRef.current.contains(event.target) &&
      !event.target.closest(".select-content")
    ) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card
        ref={formRef}
        className="w-full max-w-4xl rounded-2xl overflow-y-auto max-h-[90vh]"
      >
        <CardContent className="relative w-full h-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-center text-xl md:text-2xl font-bold text-[#222222] mb-6 md:mb-8">
            Create Job Opening
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
            {/* Job Title - Full width on all screens */}
            <div className="md:col-span-2">
              <Input
                name="title"
                value={jobData.title}
                onChange={handleInputChange}
                placeholder="Job Title"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Company Name */}
            <div>
              <Input
                name="companyName"
                value={jobData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>
            
            {/* Location (Replaced Input with Select) */}
            <div>
              <Select onValueChange={(value) => handleInputChange({ target: { name: 'location', value } })}>
                <SelectTrigger className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="Austin">Austin</SelectItem>
                  <SelectItem value="Seattle">Seattle</SelectItem>
                  {/* Add other locations as needed */}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            {/* Job Type */}
            <div>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="Full Time">Full Time</SelectItem>
                  <SelectItem value="Part Time">Part Time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              {errors.jobType && (
                <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
              )}
            </div>
            
            {/* Salary Range */}
            <div>
              <Input
                name="salaryRange"
                value={jobData.salaryRange}
                onChange={handleInputChange}
                placeholder="Salary Range"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.salaryRange && (
                <p className="text-red-500 text-sm mt-1">{errors.salaryRange}</p>
              )}
            </div>
            
            {/* Application Deadline */}
            <div>
              <Input
                name="applicationDeadline"
                value={jobData.applicationDeadline}
                onChange={handleInputChange}
                type="datetime-local"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.applicationDeadline && (
                <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline}</p>
              )}
            </div>
            
            {/* Job Description - Full width on all screens */}
            <div className="md:col-span-2">
              <Textarea
                name="description"
                value={jobData.description}
                onChange={handleInputChange}
                placeholder="Job Description"
                className="w-full h-32 md:h-[120px] rounded-lg md:rounded-[10px] border-[#bcbcbc] font-medium text-[#bcbcbc] p-3 md:p-4 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            {/* Requirements */}
            <div>
              <Input
                name="requirements"
                value={jobData.requirements}
                onChange={handleInputChange}
                placeholder="Requirements"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
              )}
            </div>
            
            {/* Responsibilities */}
            <div>
              <Input
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleInputChange}
                placeholder="Responsibilities"
                className="w-full h-12 md:h-[58px] rounded-lg md:rounded-[10px] border-[#222222] font-bold text-base md:text-lg px-4 py-3 md:py-4"
              />
              {errors.responsibilities && (
                <p className="text-red-500 text-sm mt-1">{errors.responsibilities}</p>
              )}
            </div>

            {/* File Upload - Full width on all screens */}
            <div className="flex flex-col gap-1.5 mt-2 md:mt-4 md:col-span-2">
              <label className="font-bold text-lg md:text-xl text-[#636363]">
                Company Profile Photo
              </label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Action Buttons - Stacked vertically on small screens, side by side on larger screens */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 md:mt-8 md:col-span-2">
              <Button
                type="button"
                variant="lightBlue"
                className="w-full md:w-auto px-4 md:px-[60px] py-3 md:py-4 rounded-lg md:rounded-[10px] border-[1.5px] border-[#222222] font-bold text-lg md:text-xl shadow-[0px_0px_4px_#00000040]"
                onClick={onClose}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                variant="lightBlue"
                className="w-full md:w-auto px-4 md:px-[60px] py-3 md:py-4 rounded-lg md:rounded-[10px] bg-[#00aaff] font-bold text-lg md:text-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
