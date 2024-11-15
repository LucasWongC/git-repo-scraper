import { z } from "zod";
import { cloneAndAnalyzeRepository, getGitHubProfileByEmail } from "@/lib/git";
import { procedure, router } from "..";

type Response = {
  success: boolean;
  data?: {
    repository: string;
    top_contributors: {
      username: string;
      profile_url?: string;
      commit_count: number;
      email: string;
    }[];
    error?: unknown;
  };
};
export const leaderboardRouter = router({
  getLeaderboard: procedure
    .input(z.object({ repoUrl: z.string().url() }))
    .query(async ({ input }) => {
      try {
        const contributors = await cloneAndAnalyzeRepository(input.repoUrl);

        const leaderboard = await Promise.all(
          contributors.map(async ({ email, name, count }) => {
            const userProfile = await getGitHubProfileByEmail(email);
            return {
              username: userProfile?.username ?? name,
              profile_url: userProfile?.profileUrl,
              commit_count: count,
              email,
            };
          })
        );

        return {
          success: true,
          data: { repository: input.repoUrl, top_contributors: leaderboard },
        } as Response;
      } catch (err: unknown) {
        console.log(err);
        throw "Repository url is invalid";
        return {
          success: false,
          error: "Repository url is invalid",
        } as Response;
      }
    }),
});
