import { router } from ".";
import { leaderboardRouter } from "./leaderboard/router";

export const runtime = "edge";

export const appRouter = router({
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
