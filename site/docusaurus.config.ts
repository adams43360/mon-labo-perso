import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const REPO_URL = "https://github.com/adams43360/mon-labo-perso";

const config: Config = {
  title: "Mon labo personnel",
  tagline: "Un carnet de bord public d'expérimentations avec l'IA et les architectures modernes",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://adams43360.github.io",
  baseUrl: "/mon-labo-perso/",

  organizationName: "adams43360",
  projectName: "mon-labo-perso",

  onBrokenLinks: "warn",

  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: `${REPO_URL}/tree/main/site/`,
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: "Toutes les expériences",
          blogSidebarCount: "ALL",
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: `${REPO_URL}/tree/main/site/`,
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Mon labo personnel",
      items: [
        { to: "/", label: "Accueil", position: "left" },
        { to: "/blog", label: "Expériences", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: REPO_URL,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Le labo",
          items: [
            { label: "Vision", to: "/docs/vision" },
            { label: "Roadmap", to: "/docs/roadmap" },
            { label: "Expériences", to: "/blog" },
          ],
        },
        {
          title: "Liens",
          items: [
            { label: "GitHub", href: REPO_URL },
            {
              label: "Issues / nouvelle expérience",
              href: `${REPO_URL}/issues/new?template=nouvelle-experience.md`,
            },
          ],
        },
      ],
      copyright: `Mon labo personnel — construit avec Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
