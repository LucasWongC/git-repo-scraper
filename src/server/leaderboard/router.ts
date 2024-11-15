import { z } from "zod";
import { cloneAndAnalyzeRepository, fetchGitHubUser } from "@/lib/git";
import { procedure, router } from "..";

export const leaderboardRouter = router({
  getLeaderboard: procedure
    .input(z.object({ repoUrl: z.string().url() }))
    .query(async ({ input }) => {
      try {
        const contributors = await cloneAndAnalyzeRepository(input.repoUrl);

        const leaderboard = await Promise.all(
          contributors.map(async ({ email, count }) => {
            const user = await fetchGitHubUser(email);
            return {
              username: user?.username || email,
              profile_url: user?.profile_url || null,
              commit_count: count,
              email,
            };
          })
        );

        return { repository: input.repoUrl, top_contributors: leaderboard };
      } catch (err) {
        console.log(err);
        throw "url is invalid or is not public";
      }
    }),
});
