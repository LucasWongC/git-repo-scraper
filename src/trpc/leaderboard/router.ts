import { z } from "zod";
import { cloneAndAnalyzeRepository, getGitHubProfileByEmail } from "@/lib/git";
import { procedure, router } from "..";

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

        const commitCounts: Record<
          string,
          {
            username: string;
            profile_url?: string;
            commit_count: number;
            email: string;
          }
        > = {};

        leaderboard.forEach((item) => {
          const { username, profile_url, email, commit_count } = item;
          if (!commitCounts[username]) {
            commitCounts[username] = {
              username: username,
              profile_url: profile_url,
              commit_count: 0,
              email: email,
            };
          }
          commitCounts[username].commit_count += commit_count;
        });

        const top_contributors = Object.values(commitCounts)
          .map(({ username, profile_url, email, commit_count }) => ({
            username,
            profile_url,
            email,
            commit_count,
          }))
          .sort((a, b) => b.commit_count - a.commit_count);

        return { repository: input.repoUrl, top_contributors };
      } catch (err: unknown) {
        console.log(err);
        throw "Repository url is invalid";
      }
    }),
});
