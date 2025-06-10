export const MYCOOLPAY_CONFIG = {
  PUBLIC_KEY: '203615db-f5f6-4c9a-b3ca-40300701b1f3',
  PRIVATE_KEY: 'ZAHwE5vPVYu26V6bXctZXLaHKxq13hwbeWFTGXZo5cYNirZjZ8hl1tYIurNIKKdt',
  BASE_URL: 'https://my-coolpay.com/api',
  CURRENCY: 'XAF',
  LANG: 'fr'
} as const;

export const PETAL_PACKAGES = [
  { id: 'basic', amount: 100, petals: 100, price: 500 },
  { id: 'popular', amount: 500, petals: 550, price: 2500 },
  { id: 'premium', amount: 1000, petals: 1200, price: 5000 }
] as const;