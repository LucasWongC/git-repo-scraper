import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs";
import path from "path";
import GitHub from "github-api";

const TEMP_REPO_PATH = path.join(process.cwd(), "temp_repo");

export async function cloneAndAnalyzeRepository(repoUrl: string) {
  const git: SimpleGit = simpleGit();

  // Clean up any previous cloned repo
  if (fs.existsSync(TEMP_REPO_PATH)) {
    fs.rmdirSync(TEMP_REPO_PATH, { recursive: true });
  }

  // Clone the repository
  await git.clone(repoUrl, TEMP_REPO_PATH);

  // Analyze commits
  const log = await git.cwd(TEMP_REPO_PATH).log();
  const commitCounts: Record<
    string,
    { count: number; email: string; name: string }
  > = {};

  // Count commits by each contributor
  log.all.forEach((commit) => {
    const { author_email, author_name } = commit;
    if (!commitCounts[author_email]) {
      commitCounts[author_email] = {
        count: 0,
        email: author_email,
        name: author_name,
      };
    }
    commitCounts[author_email].count += 1;
  });

  // Sort contributors by commit count
  const contributors = Object.entries(commitCounts)
    .map(([email, { count, name }]) => ({ email, count, name }))
    .sort((a, b) => b.count - a.count);

  return contributors;
}

export async function fetchGitHubUser(email: string) {
  const gh = new GitHub({
    token: process.env.GITHUB_TOKEN,
  });

  const userData = await gh.getUser(email);

  console.log(userData);

  return userData;
}
