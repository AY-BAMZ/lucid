import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient as any}>
      <>{children}</>
    </QueryClientProvider>
  );
}

export default Providers;
