// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '2025 AWS STEM Cloud Day',
  tagline: '서울금융고등학교 학생 개발자들과 함께하는 AI Agent 만들기',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://minseo.awskorea.kr',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          exclude: ['**/archive/**'],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/thumbnail.png',
      navbar: {
        title: 'AWS Korea',
        logo: {
          alt: 'AWS Korea',
          src: 'img/thumbnail.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'exploreSidebar',
            position: 'left',
            label: 'Step 1',
          },
          {
            type: 'docSidebar',
            sidebarId: 'bedrockSidebar',
            position: 'left',
            label: 'Step 2',
          },
          {
            type: 'docSidebar',
            sidebarId: 'projectSidebar',
            position: 'left',
            label: 'Step 3',
          },
          {
            href: 'https://docs.google.com/spreadsheets/d/1Qvs_3Zu_6ymP9Nk_V8dLCpyhzPR7UUJ9NCGUh0nbywY/edit?usp=sharing',
            label: 'Account',
            position: 'left',
            target: '_blank',
          },
        ],
      },
      footer: {
        style: 'dark',
        // links: [
        //   {
        //     title: 'Docs',
        //     items: [
        //       {
        //         label: 'Tutorial',
        //         to: '/docs/intro',
        //       },
        //     ],
        //   },
        //   {
        //     title: 'Community',
        //     items: [
        //       {
        //         label: 'Stack Overflow',
        //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //       },
        //     ],
        //   },
        //   {
        //     title: 'More',
        //     items: [
        //       {
        //         label: 'Blog',
        //         to: '/blog',
        //       },
        //     ],
        //   },
        // ],
        copyright: `© ${new Date().getFullYear()} | AWS KOREA, MINSEO KIM | ALL RIGHTS RESERVED`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;