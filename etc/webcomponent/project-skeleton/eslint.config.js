import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    './src/generated/locales',
    './src/generated/locale-codes.ts',
    '*.md',
  ],
})
