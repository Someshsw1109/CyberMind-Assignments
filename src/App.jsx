import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JobManagement from "./JobManagement";

// Create a React Query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <JobManagement />
  </QueryClientProvider>
);

export default App;