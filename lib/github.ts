// Live GitHub org dashboard data for /admin. Unlike lib/data/generated/* (static
// marketing JSON written by scripts/sync-org.mjs), this is fetched at request
// time with short ISR — the admin page wants *fresh* org activity, not a
// build-time snapshot. One GraphQL query covers every repo's releases, open
// PRs, forks/stars and latest commit.

const ORG = "DisplayXR";
const ENDPOINT = "https://api.github.com/graphql";

// Read-only PAT scoped to the org. Falls back to the generic GITHUB_TOKEN used
// elsewhere so local `gh`-authenticated runs work without extra setup.
const TOKEN =
  process.env.GITHUB_DASHBOARD_TOKEN || process.env.GITHUB_TOKEN || "";

export interface Release {
  repo: string;
  tagName: string;
  name: string | null;
  url: string;
  publishedAt: string | null;
  isPrerelease: boolean;
}

export interface PullRequest {
  repo: string;
  title: string;
  url: string;
  author: string | null;
  createdAt: string;
}

export interface Commit {
  repo: string;
  messageHeadline: string;
  url: string;
  author: string | null;
  committedDate: string;
}

export interface RepoStat {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  openPRs: number;
  totalReleases: number;
  archived: boolean;
  pushedAt: string | null;
  latestRelease: Release | null;
  latestCommit: Commit | null;
}

export interface OrgDashboard {
  repos: RepoStat[];
  totals: {
    repos: number;
    stars: number;
    forks: number;
    openPRs: number;
    releases: number;
  };
  recentReleases: Release[];
  recentCommits: Commit[];
  openPRList: PullRequest[];
  error: string | null;
}

const QUERY = `
query OrgDashboard($org: String!) {
  organization(login: $org) {
    repositories(first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        name
        url
        description
        isArchived
        pushedAt
        stargazerCount
        forkCount
        releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
          totalCount
          nodes { tagName name url publishedAt isPrerelease }
        }
        pullRequests(states: OPEN, first: 5, orderBy: { field: CREATED_AT, direction: DESC }) {
          totalCount
          nodes { title url createdAt author { login } }
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 1) {
                nodes { messageHeadline url committedDate author { user { login } name } }
              }
            }
          }
        }
      }
    }
  }
}`;

const EMPTY: OrgDashboard = {
  repos: [],
  totals: { repos: 0, stars: 0, forks: 0, openPRs: 0, releases: 0 },
  recentReleases: [],
  recentCommits: [],
  openPRList: [],
  error: null,
};

function byDateDesc<T>(arr: T[], key: (t: T) => string | null): T[] {
  return [...arr].sort((a, b) => (key(b) ?? "").localeCompare(key(a) ?? ""));
}

export async function getOrgDashboard(): Promise<OrgDashboard> {
  if (!TOKEN) {
    return { ...EMPTY, error: "No GitHub token configured (GITHUB_DASHBOARD_TOKEN)." };
  }

  let json: { data?: unknown; errors?: { message: string }[] };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { org: ORG } }),
      // Revalidate every 5 minutes — fresh enough for a dashboard, easy on the
      // 5k/hr GraphQL rate limit.
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return { ...EMPTY, error: `GitHub API ${res.status} ${res.statusText}` };
    }
    json = await res.json();
  } catch (e) {
    return { ...EMPTY, error: `GitHub request failed: ${(e as Error).message}` };
  }

  if (json.errors?.length) {
    return { ...EMPTY, error: json.errors.map((e) => e.message).join("; ") };
  }

  type GqlRepo = {
    name: string;
    url: string;
    description: string | null;
    isArchived: boolean;
    pushedAt: string | null;
    stargazerCount: number;
    forkCount: number;
    releases: {
      totalCount: number;
      nodes: {
        tagName: string;
        name: string | null;
        url: string;
        publishedAt: string | null;
        isPrerelease: boolean;
      }[];
    };
    pullRequests: {
      totalCount: number;
      nodes: {
        title: string;
        url: string;
        createdAt: string;
        author: { login: string } | null;
      }[];
    };
    defaultBranchRef: {
      target: {
        history?: {
          nodes: {
            messageHeadline: string;
            url: string;
            committedDate: string;
            author: { user: { login: string } | null; name: string | null };
          }[];
        };
      };
    } | null;
  };

  const data = json.data as {
    organization: { repositories: { nodes: GqlRepo[] } } | null;
  };
  const nodes = data.organization?.repositories.nodes ?? [];

  const repos: RepoStat[] = [];
  const recentReleases: Release[] = [];
  const recentCommits: Commit[] = [];
  const openPRList: PullRequest[] = [];

  for (const r of nodes) {
    const rel = r.releases.nodes[0];
    const latestRelease: Release | null = rel
      ? {
          repo: r.name,
          tagName: rel.tagName,
          name: rel.name,
          url: rel.url,
          publishedAt: rel.publishedAt,
          isPrerelease: rel.isPrerelease,
        }
      : null;
    if (latestRelease) recentReleases.push(latestRelease);

    const c = r.defaultBranchRef?.target.history?.nodes[0];
    const latestCommit: Commit | null = c
      ? {
          repo: r.name,
          messageHeadline: c.messageHeadline,
          url: c.url,
          author: c.author.user?.login ?? c.author.name,
          committedDate: c.committedDate,
        }
      : null;
    if (latestCommit) recentCommits.push(latestCommit);

    for (const pr of r.pullRequests.nodes) {
      openPRList.push({
        repo: r.name,
        title: pr.title,
        url: pr.url,
        author: pr.author?.login ?? null,
        createdAt: pr.createdAt,
      });
    }

    repos.push({
      name: r.name,
      url: r.url,
      description: r.description,
      stars: r.stargazerCount,
      forks: r.forkCount,
      openPRs: r.pullRequests.totalCount,
      totalReleases: r.releases.totalCount,
      archived: r.isArchived,
      pushedAt: r.pushedAt,
      latestRelease,
      latestCommit,
    });
  }

  return {
    repos: byDateDesc(repos, (r) => r.pushedAt),
    totals: {
      repos: repos.length,
      stars: repos.reduce((s, r) => s + r.stars, 0),
      forks: repos.reduce((s, r) => s + r.forks, 0),
      openPRs: repos.reduce((s, r) => s + r.openPRs, 0),
      releases: repos.reduce((s, r) => s + r.totalReleases, 0),
    },
    recentReleases: byDateDesc(recentReleases, (r) => r.publishedAt).slice(0, 10),
    recentCommits: byDateDesc(recentCommits, (c) => c.committedDate).slice(0, 12),
    openPRList: byDateDesc(openPRList, (p) => p.createdAt).slice(0, 12),
    error: null,
  };
}
