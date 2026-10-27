import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { GET, POST } from '../api/webhook.js';

process.env.WEBHOOK_VERIFY_TOKEN = 'verify-me';
process.env.IG_APP_SECRET = 'secret';

test('GET: 토큰이 맞으면 challenge를 돌려준다', async () => {
  const res = GET(new Request('https://x/api/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42'));
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '42');
});

test('GET: 토큰이 틀리면 403', () => {
  const res = GET(new Request('https://x/api/webhook?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=42'));
  assert.equal(res.status, 403);
});

test('POST: 서명이 틀리면 401', async () => {
  const res = await POST(new Request('https://x/api/webhook', {
    method: 'POST', body: '{}', headers: { 'x-hub-signature-256': 'sha256=bad' },
  }));
  assert.equal(res.status, 401);
});

test('POST: 서명이 맞으면 200', async () => {
  const body = JSON.stringify({ object: 'instagram', entry: [] });
  const sig = `sha256=${createHmac('sha256', 'secret').update(body).digest('hex')}`;
  const res = await POST(new Request('https://x/api/webhook', {
    method: 'POST', body, headers: { 'x-hub-signature-256': sig },
  }));
  assert.equal(res.status, 200);
});
