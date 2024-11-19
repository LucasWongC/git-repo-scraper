"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { trpc } from "./trpcClient";
import { httpBatchLink } from "@trpc/client";

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
          }),
        ],
      }),
    []
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
