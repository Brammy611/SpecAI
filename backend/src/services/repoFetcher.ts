import { Octokit } from "@octokit/rest";

/** A single fetched file from the repository */
export interface RepoFile {
  path: string;
  content: string;
}

/** Extensions that are considered non-textual and will be skipped */
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg", ".ico",
  ".pdf", ".zip", ".tar", ".gz", ".rar", ".7z",
  ".exe", ".dll", ".so", ".dylib", ".class", ".jar",
  ".mp4", ".mp3", ".wav", ".avi", ".mov",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".pyc", ".pyo",
]);

/** File size limit in bytes (200 KB) */
const MAX_FILE_SIZE = 200_000;

function isBinaryPath(filePath: string): boolean {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  if (BINARY_EXTENSIONS.has(ext)) return true;

  // Ignore noisy directories that poison the LLM context
  const parts = filePath.split("/");
  const ignoredDirs = new Set(["node_modules", "vendor", "dist", "build", ".git", ".next", "coverage"]);
  for (const part of parts) {
    if (ignoredDirs.has(part)) return true;
  }

  return false;
}

/**
 * Parse a GitHub URL into owner and repo.
 * Supports https://github.com/owner/repo and github.com/owner/repo.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.replace(/^https?:\/\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  const parts = cleaned.split("/");
  const githubIdx = parts.findIndex((p) => p === "github.com");
  if (githubIdx === -1 || parts.length < githubIdx + 3) {
    throw new Error(
      `Invalid GitHub URL: "${url}". Expected format: https://github.com/owner/repo`
    );
  }
  return { owner: parts[githubIdx + 1], repo: parts[githubIdx + 2] };
}

/**
 * Recursively fetch all text files from a GitHub repository using the REST API.
 * Returns an array of { path, content } objects ready for the RAG pipeline.
 */
export async function fetchRepositoryContent(
  repoUrl: string,
  githubToken?: string
): Promise<RepoFile[]> {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  const octokit = new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });

  // Verify repository is accessible
  await octokit.rest.repos.get({ owner, repo });

  // Use the git trees API with recursive=1 to get the full file tree in one call
  const { data: refData } = await octokit.rest.repos.get({ owner, repo });
  const defaultBranch = refData.default_branch;

  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: "1",
  });

  const textFiles = (treeData.tree || []).filter(
    (item) =>
      item.type === "blob" &&
      item.path &&
      !isBinaryPath(item.path) &&
      (item.size === undefined || item.size <= MAX_FILE_SIZE)
  );

  const results: RepoFile[] = [];

  // Fetch files in parallel with a concurrency limit
  const CONCURRENCY = 8;
  for (let i = 0; i < textFiles.length; i += CONCURRENCY) {
    const batch = textFiles.slice(i, i + CONCURRENCY);
    const fetched = await Promise.allSettled(
      batch.map(async (item) => {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: item.path!,
        });
        if (Array.isArray(data) || data.type !== "file") return null;
        // GitHub API returns content as base64
        const decoded = Buffer.from(data.content, "base64").toString("utf-8");
        return { path: item.path!, content: decoded } as RepoFile;
      })
    );

    for (const result of fetched) {
      if (result.status === "fulfilled" && result.value) {
        results.push(result.value);
      }
    }
  }

  return results;
}
