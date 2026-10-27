import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleWebhook } from '../lib/handle.js';

const rules = [{ keywords: ['링크'], message: 'DM 내용', publicReply: '보냈어요' }];

const payload = (from, text) => ({
  object: 'instagram',
  entry: [{
    id: 'ME',
    changes: [{ field: 'comments', value: { id: 'C1', text, from, media: { id: 'M1' } } }],
  }],
});

function fakeApi({ failDm = false } = {}) {
  const calls = [];
  return {
    calls,
    async sendPrivateReply(...args) {
      if (failDm) throw new Error('already sent');
      calls.push(['dm', ...args]);
    },
    async replyToComment(...args) { calls.push(['reply', ...args]); },
  };
}

test('키워드 댓글이면 DM과 공개 답글을 보낸다', async () => {
  const api = fakeApi();
  await handleWebhook(payload({ id: 'U1', username: 'fan' }, '링크 주세요'), rules, api);
  assert.deepEqual(api.calls, [['dm', 'ME', 'C1', 'DM 내용'], ['reply', 'C1', '보냈어요']]);
});

test('내 계정이 단 댓글은 무시한다', async () => {
  const api = fakeApi();
  await handleWebhook(payload({ id: 'ME', username: 'me' }, '링크 보냈어요'), rules, api);
  assert.deepEqual(api.calls, []);
});

test('키워드가 없으면 아무것도 안 한다', async () => {
  const api = fakeApi();
  await handleWebhook(payload({ id: 'U1' }, '예뻐요'), rules, api);
  assert.deepEqual(api.calls, []);
});

test('DM 실패 시 공개 답글도 달지 않고 에러를 던지지 않는다', async () => {
  const api = fakeApi({ failDm: true });
  const results = await handleWebhook(payload({ id: 'U1' }, '링크'), rules, api);
  assert.deepEqual(api.calls, []);
  assert.deepEqual(results, [{ commentId: 'C1', ok: false }]);
});
