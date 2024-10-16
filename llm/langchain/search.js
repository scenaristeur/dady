import { search, Separator } from '@inquirer/prompts'
// Or
// import search, { Separator } from '@inquirer/search';

const answer = await search({
  message: 'Select an npm package',
  source: async (input, { signal }) => {
    if (!input) {
      return []
    }

    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(input)}&size=20`,
      { signal }
    )
    const data = await response.json()

    return data.objects.map((pkg) => ({
      name: pkg.package.name,
      value: pkg.package.name,
      description: pkg.package.description
    }))
  }
})
