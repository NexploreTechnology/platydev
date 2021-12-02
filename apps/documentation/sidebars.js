// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  main: [
    'introduction',
    {
      'Getting started': [
        'getting-started/installation',
        'getting-started/configuration'
      ]
    },
    'comparison',
    'roadmap'
  ],
  artifacts: [
    'artifacts/index',
    {
      type: 'category',
      label: 'NPM packages',
      items: [{ type: 'autogenerated', dirName: 'artifacts/js' }]
    },
    {
      type: 'category',
      label: 'Helm Charts',
      items: [{ type: 'autogenerated', dirName: 'artifacts/charts' }]
    },
    {
      type: 'category',
      label: 'Docker',
      items: [
        {
          type: 'autogenerated',
          dirName: 'artifacts/docker'
        }
      ]
    },
    'artifacts/tilt',
    'artifacts/pulumi'
  ]
}

module.exports = sidebars
