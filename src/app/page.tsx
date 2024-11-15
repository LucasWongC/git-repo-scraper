"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/server/trpcClient";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@uidotdev/usehooks";

const LeaderboardPage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState<string>();

  const debouncedRepoUrl = useDebounce(repoUrl, 1000);

  const { data, refetch, isError, isLoading } =
    trpc.leaderboard.getLeaderboard.useQuery(
      { repoUrl: debouncedRepoUrl },
      {
        enabled: repoUrl?.indexOf("https://github.com/") == 0, // Only call the query when repoUrl is set,
        onError: (err) => {
          console.log({ err });
          setError(err?.message);
        },
        onSuccess: () => {
          setError(undefined);
        },
        retry: false,
        refetchOnWindowFocus: false,
      }
    );

  const fetchLeaderboard = () => {
    refetch();
  };

  console.log(isError);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          GitHub Repository Leaderboard
        </h1>
        <p className="text-gray-600 mt-2">
          Enter a GitHub repository URL to fetch and analyze the most frequent
          contributors.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Input
          type="text"
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full max-w-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 rounded-md"
        />
        <Button
          onClick={fetchLeaderboard}
          className={`px-6 py-2 font-medium rounded-md ${
            isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-all`}
        >
          {isLoading ? "Loading..." : "Fetch Leaderboard"}
        </Button>
        {error && !isLoading ? (
          <div className="text-sm text-red-400">{error}</div>
        ) : (
          <></>
        )}
      </div>

      {data && (
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Leaderboard
            </h2>
            <Table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-100 text-gray-700">
                <TableRow>
                  <TableHead className="px-4 py-2">Contributor</TableHead>
                  <TableHead className="px-4 py-2">Commits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.top_contributors.map((contributor, idx: number) => (
                  <TableRow
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-all`}
                  >
                    <TableCell className="px-4 py-2 text-blue-600">
                      {contributor.profile_url ? (
                        <a
                          href={contributor.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          {contributor.username}
                        </a>
                      ) : (
                        <span className="text-gray-800">
                          {contributor.username}({contributor.email})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-800">
                      {contributor.commit_count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardPage;
