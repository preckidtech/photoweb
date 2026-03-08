import { test, expect } from '@playwright/test';

test('Gallery Vault E2E Flow', async ({ page }) => {
  // 1. Navigate to a test gallery (Replace with a real ID from your Supabase)
  await page.goto('http://localhost:3000/gallery/test-id');

  // 2. Check if the AI button exists
  const aiButton = page.getByRole('button', { name: /AI Face Search/i });
  await expect(aiButton).toBeVisible();

  // 3. Test the Download All button
  const downloadBtn = page.getByRole('button', { name: /Download Vault/i });
  await expect(downloadBtn).toBeEnabled();

  // 4. Verify AI Modal opens
  await aiButton.click();
  await expect(page.getByText(/AI Visual Search/i)).toBeVisible();
});