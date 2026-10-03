export const site = {
  name: "Serve",
  tagline: "Your own cloud for apps, databases and services.",
  description: "Serve is an open source platform for your own servers. Push to deploy, get a domain with HTTPS and manage it all from one dashboard.",
  url: "https://serve.bd",
  contact: "contact@serve.bd",
  github: "https://github.com/serve-bd/serve",
  releases: "https://github.com/serve-bd/serve/releases",
  license: "Apache 2.0",
  version: "v0.2.7",
  // serve.bd/install.sh redirects here (see "Hosting" in README.md), so the short command always gets the latest script.
  installScript: "https://serve.bd/install.sh",
  install: "curl -fsSL https://serve.bd/install.sh | bash",
};

/** Where people ask, report and contribute, on the Serve repository. */
export const community = {
  discussions: `${site.github}/discussions`,
  templateRequest: `${site.github}/issues/new?template=template_request.yml`,
  securityReport: `${site.github}/security/advisories/new`,
  contributing: `${site.github}/blob/main/CONTRIBUTING.md`,
  templatesGuide: `${site.github}/blob/main/templates/README.md`,
};

/** The feature pages, for the Features menu, the features page and the mobile menu. */
export const featurePages = [
  { href: "/features/git-to-production/", label: "Git to production", text: "Push code and it builds, deploys and goes live." },
  { href: "/features/pull-request-previews/", label: "Pull request previews", text: "Every pull request as its own live app." },
  { href: "/features/database-branching/", label: "Database branching", text: "A full copy of a database, for migrations and previews." },
  { href: "/features/one-click-services/", label: "One-click services", text: "n8n, Plausible, Ghost and more, with secrets set for you." },
  { href: "/features/domains-and-https/", label: "Domains and HTTPS", text: "Add a domain and get a certificate that renews itself." },
  { href: "/features/servers-without-public-ip/", label: "Servers without a public IP", text: "Run apps on a machine behind your router." },
  { href: "/features/teams/", label: "Teams", text: "Roles, project access and an activity log." },
];

export const nav = [
  { href: "/features/", label: "Features" },
  { href: "/templates/", label: "Templates" },
  { href: "/docs/", label: "Docs" },
  { href: site.releases, label: "Changelog", external: true },
];
