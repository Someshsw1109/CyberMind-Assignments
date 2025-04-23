import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBarSection from "./NavigationBarSection";
import SearchBarSection from "./SearchBarSection";
import JobListingsSection from "./JobListingsSection";
import Loader from "./Loader";
import { config } from "./config/config";

const JobManagement = () => {
  const [jobListings, setJobListings] = useState([]); // Initialize as an array
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    jobType: "",
    salaryRange: "",
  });

  // Fetch jobs from API
  const fetchJobs = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
     
      const response = await axios.get(`${config.backend.baseUrl}/jobs`, {
        params: filters, // Send filters as query parameters
      });
      setJobListings(response.data || []); // Ensure an array
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNewJob = (newJob) => {
    fetchJobs();
  };

  // Fetch jobs when the component mounts and when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]); // Refetch when filters change

  // Handle filter change from SearchBarSection
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching job listings</div>;

  return (
    <main className="bg-[#fbfbff] flex flex-col items-center w-full min-h-screen">
      <div className="bg-[#fbfbff] w-full max-w-[1440px] flex flex-col items-center">
        <header className="w-full">
          <NavigationBarSection onJobSubmit={handleNewJob} />
        </header>

        <section className="w-full mt-4">
          <SearchBarSection onFilterChange={handleFilterChange} />
        </section>

        <section className="w-full mt-4 flex justify-center">
          <JobListingsSection jobListings={jobListings} />
        </section>
      </div>
    </main>
  );
};

export default JobManagement;
