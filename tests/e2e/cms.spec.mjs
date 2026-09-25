// Nghiệm thu Phase CMS (S10): đăng nhập, sửa nội dung, danh sách, giá server tính, form Hero, fallback.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared/defaultContent.json'), 'utf8'));
const PASSWORD = process.env.E2E_ADMIN_PASSWORD;

const HERO_TITLE = 'E2E Tiêu Đề Mới';
const HOTLINE = '0909 000 111';
const SVC = {
  slug: 'e2e-dich-vu', title: 'Dịch Vụ E2E', subtitle: 'E2E', description: 'Dịch vụ tạo bởi kiểm thử',
  pricePerM2: 1000, basePrice: 50000, icon: 'Trees', features: ['Đặc điểm E2E'],
  calcName: 'Calc E2E', heroEmoji: '🧪', heroLabel: 'Hero E2E', footerLabel: 'Footer E2E', isActive: true,
};
const HERO_PHONE = '0911222333';

test.describe.configure({ mode: 'serial' });

// Ô nhập trong form CMS nằm ngay sau nhãn của nó.
const field = (page, label) => page.locator(`xpath=//label[normalize-space()="${label}"]/following-sibling::*[self::input or self::textarea][1]`);

async function login(page, username, password) {
  await page.goto('/admin');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

async function saveSetting(page, section, values) {
  await page.goto(`/admin/content/${section}`);
  for (const [label, value] of Object.entries(values)) await field(page, label).fill(value);
  await page.getByRole('button', { name: 'Save changes' }).first().click();
  await expect(page.getByText('Saved.')).toBeVisible();
}

test('API quản trị trả 401 khi chưa đăng nhập', async ({ request }) => {
  for (const p of ['/api/admin/me', '/api/admin/quotes', '/api/admin/contacts', '/api/admin/settings']) {
    expect((await request.get(p)).status(), p).toBe(401);
  }
  expect((await request.get('/api/quotes')).status(), 'GET /api/quotes công khai đã gỡ').toBe(404);
});

test('Luồng quản trị đầy đủ', async ({ page, browser }) => {
  await test.step('Đăng nhập sai bị chặn', async () => {
    await login(page, 'admin1', 'sai-mat-khau');
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
  });

  await test.step('Đăng nhập đúng (admin1)', async () => {
    await login(page, 'admin1', PASSWORD);
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });

  await test.step('Sửa tiêu đề Hero và hotline → trang chủ hiện đúng', async () => {
    await saveSetting(page, 'hero', { 'Title – line 1': HERO_TITLE });
    await saveSetting(page, 'contact', { 'Hotline (displayed text)': HOTLINE, 'Hotline (number to dial)': HOTLINE.replace(/\s/g, '') });
    await page.goto('/');
    await expect(page.getByText(HERO_TITLE)).toBeVisible();
    await expect(page.locator(`a[href="tel:${HOTLINE.replace(/\s/g, '')}"]`, { hasText: HOTLINE })).toBeVisible();
  });

  await test.step('Mục Về chúng tôi: sửa trong CMS, bấm menu cuộn đúng mục', async () => {
    const ABOUT_TITLE = 'E2E Về Chúng Tôi';
    await saveSetting(page, 'about', { 'Title': ABOUT_TITLE });
    await page.goto('/');
    await expect(page.locator('#about').getByText(ABOUT_TITLE)).toBeVisible();
    await page.locator('nav a[href="#about"]').first().click();
    await expect.poll(async () => Math.abs(await page.locator('#about').evaluate((el) => el.getBoundingClientRect().top))).toBeLessThan(150);
  });

  await test.step('Thêm dịch vụ có ảnh upload → hiện ở Dịch vụ, Calculator, Hero, Footer', async () => {
    const up = await page.request.post('/api/admin/upload', {
      headers: { 'X-Requested-With': 'fetch' },
      multipart: { file: { name: 'e2e.png', mimeType: 'image/png', buffer: fs.readFileSync(path.join(ROOT, 'public/images/lawn_care.png')) } },
    });
    expect(up.ok(), await up.text()).toBeTruthy();
    const image = (await up.json()).data.url;
    expect((await page.request.get(image)).status()).toBe(200);

    const created = await page.request.post('/api/admin/content/services', { data: { ...SVC, image } });
    expect(created.ok(), await created.text()).toBeTruthy();

    await page.goto('/');
    await expect(page.getByRole('heading', { name: SVC.title })).toBeVisible();
    await expect(page.locator(`img[src="${image}"]`)).toHaveCount(1);
    await expect(page.getByText(SVC.calcName).first()).toBeVisible();
    await expect(page.locator('option', { hasText: `${SVC.heroEmoji} ${SVC.heroLabel}` })).toHaveCount(1);
    await expect(page.getByRole('link', { name: SVC.footerLabel })).toBeVisible();
  });

  await test.step('Ẩn 1 đánh giá → không còn trên trang chủ', async () => {
    const list = (await (await page.request.get('/api/admin/content/testimonials')).json()).data;
    const target = list[0];
    await page.goto('/');
    await expect(page.getByText(target.name)).toBeVisible();
    expect((await page.request.put(`/api/admin/content/testimonials/${target.id}`, { data: { isActive: false } })).ok()).toBeTruthy();
    await page.goto('/');
    await expect(page.getByText(SVC.title).first()).toBeVisible(); // trang đã tải xong nội dung CMS
    await expect(page.getByText(target.name)).toHaveCount(0);
  });

  await test.step('Báo giá gửi giá giả → DB lưu giá server tính', async () => {
    const site = (await (await page.request.get('/api/site')).json()).data;
    const freq = site.frequencyOptions.find((f) => f.discountPct > 0);
    const area = 100;
    const expected = Math.round((SVC.basePrice + area * SVC.pricePerM2) * (100 - freq.discountPct)) / 100;
    const r = await page.request.post('/api/quotes', {
      data: { fullName: 'Khách E2E', phone: '0900000000', address: 'Địa chỉ E2E', serviceId: SVC.slug, gardenArea: area, frequencyId: freq.id, estimatedCost: 1 },
    });
    expect(r.ok(), await r.text()).toBeTruthy();
    const { quoteId, estimatedCost } = await r.json();
    expect(estimatedCost).toBe(expected);
    const quotes = (await (await page.request.get('/api/admin/quotes')).json()).data;
    expect(quotes.find((q) => q.id === quoteId).estimatedCost).toBe(expected);
  });

  await test.step('Form Hero lưu số điện thoại vào Liên hệ', async () => {
    await page.goto('/');
    const form = page.locator('form', { has: page.locator('select') }).first();
    const phone = form.locator('input[type="tel"]');
    await phone.fill(HERO_PHONE);
    const saved = page.waitForResponse((res) => res.url().endsWith('/api/leads') && res.ok());
    await phone.press('Enter'); // nút gửi có hiệu ứng chuyển động liên tục nên không "click" ổn định được
    await saved;
    const contacts = (await (await page.request.get('/api/admin/contacts')).json()).data;
    expect(contacts.some((c) => c.phone === HERO_PHONE && c.source === 'hero')).toBeTruthy();
  });

  await test.step('Đăng xuất', async () => {
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    expect((await page.request.get('/api/admin/me')).status()).toBe(401);
  });

  await test.step('Admin thứ 2 đăng nhập được', async () => {
    const ctx = await browser.newContext();
    const p2 = await ctx.newPage();
    await login(p2, 'admin2', PASSWORD);
    await expect(p2.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await ctx.close();
  });
});

test('Đổi giao diện (theme) trong CMS', async ({ page, browser }) => {
  await login(page, 'admin1', PASSWORD);
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  await test.step('Theme không có trong danh sách bị server từ chối', async () => {
    const r = await page.request.put('/api/admin/settings/theme', { data: { active: 'khong-co' } });
    expect(r.status()).toBe(400);
  });

  await test.step('Xem trước ?theme=light không đổi giao diện của khách', async () => {
    const guest = await (await browser.newContext()).newPage();
    await guest.goto('/?theme=light');
    await expect(guest.locator('body')).toHaveAttribute('data-theme', 'light');
    await expect(guest.getByText(HERO_TITLE)).toBeVisible();
    await guest.goto('/');
    await expect(guest.locator('body')).toHaveAttribute('data-theme', 'classic');
    await guest.context().close();
  });

  await test.step('Chọn Light trong CMS → trang chủ đổi giao diện, nội dung giữ nguyên', async () => {
    await page.goto('/admin/content/theme');
    await page.getByRole('radio', { name: /Light/ }).check();
    await page.getByRole('button', { name: 'Save changes' }).first().click();
    await expect(page.getByText('Saved.')).toBeVisible();
    await page.goto('/');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByText(HERO_TITLE)).toBeVisible();
    await expect(page.locator(`a[href="tel:${HOTLINE.replace(/\s/g, '')}"]`, { hasText: HOTLINE })).toBeVisible();
    for (const id of ['about', 'services', 'calculator', 'portfolio', 'testimonials', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  await test.step('Theme Light: form Liên hệ lưu được', async () => {
    const form = page.locator('#contact form');
    const inputs = form.locator('input');
    await inputs.nth(0).fill('Khách Light');
    await inputs.nth(1).fill('0922333444');
    await form.locator('textarea').fill('Tin nhắn từ theme light');
    const saved = page.waitForResponse((res) => res.url().endsWith('/api/contact') && res.ok());
    await form.locator('button[type="submit"]').click();
    await saved;
    const contacts = (await (await page.request.get('/api/admin/contacts')).json()).data;
    expect(contacts.some((c) => c.phone === '0922333444')).toBeTruthy();
  });

  await test.step('Chọn lại Classic', async () => {
    const r = await page.request.put('/api/admin/settings/theme', { data: { active: 'classic' } });
    expect(r.ok()).toBeTruthy();
    await page.goto('/');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'classic');
  });
});

test('Backend không phản hồi → trang chủ hiện nội dung mặc định', async ({ page }) => {
  // Mô phỏng API chết bằng cách chặn mọi request /api (ảnh + JS vẫn tải từ bản build).
  await page.route('**/api/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText(DEFAULTS.settings.hero.title_line1)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(HERO_TITLE)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: DEFAULTS.services[0].title })).toBeVisible();
});
