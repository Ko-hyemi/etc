import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRule } from '../lib/rules.js';

const rules = [
  { mediaId: '111', keywords: ['쿠폰'], message: 'coupon' },
  { keywords: ['링 크', 'LINK'], message: 'link' },
];

test('키워드가 포함되면 규칙을 찾는다 (대소문자·띄어쓰기 무시)', () => {
  assert.equal(findRule(rules, { mediaId: '999', text: '저도 링크 주세요!' })?.message, 'link');
  assert.equal(findRule(rules, { mediaId: '999', text: 'link pls' })?.message, 'link');
});

test('mediaId가 지정된 규칙은 그 게시물에만 적용된다', () => {
  assert.equal(findRule(rules, { mediaId: '111', text: '쿠폰!' })?.message, 'coupon');
  assert.equal(findRule(rules, { mediaId: '222', text: '쿠폰!' }), undefined);
});

test('맞는 키워드가 없거나 텍스트가 없으면 undefined', () => {
  assert.equal(findRule(rules, { mediaId: '111', text: '예뻐요' }), undefined);
  assert.equal(findRule(rules, { mediaId: '111', text: undefined }), undefined);
});
