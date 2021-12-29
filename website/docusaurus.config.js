// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  url: 'https://niqdev.github.io',
  baseUrl: '/strawhatsec/',
  organizationName: 'niqdev',
  projectName: 'strawhatsec',
  deploymentBranch: 'gh-pages',

  trailingSlash: false,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // reference folder in root path, equivalent to 'customDocsPath'
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
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
      navbar: {
        title: 'StrawHatSec',
        logo: {
          alt: 'StrawHatSec Logo',
          src: 'img/logo.svg',
          href: 'docs/home'
        },
        items: [
          {
            href: 'https://github.com/niqdev/strawhatsec',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Contribute',
                to: '/docs/contribute',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} niqdev`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
