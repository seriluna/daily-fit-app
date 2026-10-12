const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('앱 시작 화면과 목표 생성 폼 표시', async ({ page }) => {
  await expect(page.locator('#setup')).toBeVisible();
  await expect(page.locator('#goal-form')).toBeVisible();
  await expect(page.locator('#title')).toBeVisible();
  await expect(page.locator('#action')).toBeVisible();
});

test('목표를 생성하고 오늘 체크를 새로고침 후 유지', async ({ page }) => {
  await page.locator('#title').fill('자동 테스트 목표');
  await page.locator('#action').fill('작은 행동 테스트');
  await page.locator('#start').fill('2026-10-12');
  await page.locator('#goal-form button[type="submit"]').click();

  const card = page.locator('.goal-card').filter({ hasText: '자동 테스트 목표' });
  await expect(card).toBeVisible();
  await card.locator('button[data-check]').click();
  await expect(card.locator('button[data-check]')).toHaveClass(/done/);
  await page.reload();

  const reloaded = page.locator('.goal-card').filter({ hasText: '자동 테스트 목표' });
  await expect(reloaded).toBeVisible();
  await expect(reloaded.locator('button[data-check]')).toHaveClass(/done/);
});

test('식단·공복 체중 기록 저장 및 CSV 내보내기 기능 표시', async ({ page }) => {
  await page.locator('#title').fill('테스트 목표');
  await page.locator('#action').fill('테스트 행동');
  await page.locator('#start').fill('2026-10-12');
  await page.locator('#goal-form button[type="submit"]').click();

  page.on('dialog', dialog => dialog.accept());
  await page.locator('#log-date').fill('2026-10-12');
  await page.locator('#fasting-weight').fill('52.2');
  await page.locator('#breakfast').fill('자동 테스트 계란');
  await page.locator('#health-form button[type="submit"]').click();

  await expect(page.locator('#health-records')).toContainText('자동 테스트 계란');
  await expect(page.locator('#export-health')).toBeVisible();
});