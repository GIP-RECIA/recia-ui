import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  formatters: true,
  ignores: [
    'src/assets/scss/core/_variables.scss',
  ],
})
