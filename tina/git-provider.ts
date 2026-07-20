import { purgeCache } from '@netlify/functions'
import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'
import type { GitProvider } from '@tinacms/datalayer'

// Must match CACHE_TAG_CONTENT in src/utils/url.ts (not importable here — it uses astro:env).
const CACHE_TAG_CONTENT = 'tina-content'

// Purge every CDN-cached page tagged with the content tag so a publish is visible
// immediately, regardless of the site's CACHE_CDN_MAX_AGE. A failed purge must never
// fail the content save — stale pages still expire via the normal TTL.
const purgeContentCache = async () => {
  try {
    await purgeCache({ tags: [CACHE_TAG_CONTENT] })
  } catch (e) {
    console.error('Cache purge failed (content saved; pages refresh on TTL expiry):', e)
  }
}

type OctokitOptions = ConstructorParameters<typeof Octokit>[0]
export interface GitHubProviderOptions {
  owner: string
  repo: string
  token: string
  branch: string
  commitMessage?: string
  rootPath?: string
  octokitOptions?: OctokitOptions
}

export class GitHubProvider implements GitProvider {
  octokit: Octokit
  owner: string
  repo: string
  branch: string
  rootPath?: string
  commitMessage?: string

  constructor(args: GitHubProviderOptions) {
    this.owner = args.owner
    this.repo = args.repo
    this.branch = args.branch
    this.commitMessage = args.commitMessage
    this.rootPath = args.rootPath
    this.octokit = new Octokit({
      auth: args.token,
      ...(args.octokitOptions || {}),
    })
  }

  async onPut(key: string, value: string) {
    let sha
    const path = this.rootPath ? `${this.rootPath}/${key}` : key
    try {
      const {
        // @ts-ignore
        data: { sha: existingSha },
      } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      })
      sha = existingSha
    } catch (e) {}

    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: path,
      message: this.commitMessage || 'Edited with TinaCMS',
      content: Base64.encode(value),
      branch: this.branch,
      sha,
    })

    await purgeContentCache()
  }

  async onDelete(key: string) {
    let sha
    const path = this.rootPath ? `${this.rootPath}/${key}` : key
    try {
      const {
        // @ts-ignore
        data: { sha: existingSha },
      } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      })
      sha = existingSha
    } catch (e) {}

    if (sha) {
      await this.octokit.repos.deleteFile({
        owner: this.owner,
        repo: this.repo,
        path: path,
        message: this.commitMessage || 'Edited with TinaCMS',
        branch: this.branch,
        sha,
      })

      await purgeContentCache()
    } else {
      throw new Error(
        `Could not find file ${path} in repo ${this.owner}/${this.repo}`
      )
    }
  }
}