import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NavigationBarSection from "./NavigationBarSection";
import SearchBarSection from "./SearchBarSection";
import JobListingsSection from "./JobListingsSection";
import Loader from "./Loader";
import { config } from "./config/config";

const JobManagement = () => {
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    jobType: "",
    salaryRange: "",
  });

  // ✅ Memoize fetchJobs so it's stable across renders
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axios.get(`${config.backend.baseUrl}/jobs`, {
        params: filters,
      });
      setJobListings(response.data || []);
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const handleNewJob = () => {
    fetchJobs();
  };

  // ✅ useEffect now depends on stable fetchJobs
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
