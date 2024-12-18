import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs";
import path from "path";

const TEMP_REPO_PATH = path.join(process.cwd(), "temp_repo");

export async function cloneAndAnalyzeRepository(repoUrl: string) {
  const git: SimpleGit = simpleGit();

  if (fs.existsSync(TEMP_REPO_PATH)) {
    fs.rmdirSync(TEMP_REPO_PATH, { recursive: true });
  }

  await git.clone(repoUrl, TEMP_REPO_PATH);

  const log = await git.cwd(TEMP_REPO_PATH).log();
  const commitCounts: Record<
    string,
    { count: number; email: string; name: string }
  > = {};

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

  const contributors = Object.entries(commitCounts).map(
    ([email, { count, name }]) => ({ email, count, name })
  );

  fs.rmSync(TEMP_REPO_PATH, { recursive: true, force: true });

  return contributors;
}

export const getGitHubProfileByEmail = async (email: string) => {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/search/commits?q=author-email:${email}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.cloak-preview",
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        if (!item.author) {
          continue;
        }
        const { login, html_url } = item.author;
        return {
          username: login,
          profileUrl: html_url,
        };
      }
    } else {
      console.log("No profile found for this email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
