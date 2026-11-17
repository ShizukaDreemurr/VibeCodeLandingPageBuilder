// Kiểm thử firestore.rules bằng @firebase/rules-unit-testing. Cần Firestore emulator (và Java):
//   npm i -D @firebase/rules-unit-testing firebase
//   npx firebase-tools emulators:exec --only firestore --project demo-ep "node tests/firebase-rules.test.mjs"
// Không có emulator (FIRESTORE_EMULATOR_HOST trống) thì in lời nhắc và thoát 0, không làm hỏng CI.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.log('BỎ QUA firebase-rules.test: chưa có Firestore emulator (chạy qua `firebase emulators:exec`, cần Java).');
  process.exit(0);
}
const { initializeTestEnvironment, assertSucceeds, assertFails } = await import('@firebase/rules-unit-testing');
const here = dirname(fileURLToPath(import.meta.url));
const env = await initializeTestEnvironment({ projectId: 'demo-ep', firestore: { rules: readFileSync(join(here, '..', 'firestore.rules'), 'utf8') } });
let failed = 0;
const t = async (name, p) => { try { await p; console.log('  ok  ', name); } catch (e) { failed++; console.log('  FAIL', name, e.message); } };
const alice = env.authenticatedContext('alice').firestore();
const anon = env.unauthenticatedContext().firestore();
const row = (o) => Object.assign({ id: 'r1', createdAt: 1, title: 'x' }, o);

await t('chủ ghi được bản ghi của mình', assertSucceeds(alice.doc('users/alice/items/r1').set(row())));
await t('chủ đọc được', assertSucceeds(alice.doc('users/alice/items/r1').get()));
await t('chủ xoá được', assertSucceeds(alice.doc('users/alice/items/r1').delete()));
await t('người khác không đọc được', assertFails(env.authenticatedContext('bob').firestore().doc('users/alice/items/r1').get()));
await t('người khác không ghi được', assertFails(env.authenticatedContext('bob').firestore().doc('users/alice/items/r1').set(row())));
await t('khách (chưa đăng nhập) không đọc được', assertFails(anon.doc('users/alice/items/r1').get()));
await t('khách không ghi được', assertFails(anon.doc('users/alice/items/r1').set(row())));
await t('id trong dữ liệu phải khớp mã tài liệu', assertFails(alice.doc('users/alice/items/r2').set(row({ id: 'khac' }))));
await t('updatedAt phải là số', assertFails(alice.doc('users/alice/items/r3').set(row({ id: 'r3', updatedAt: 'hôm qua' }))));
await t('quá 60 trường bị từ chối', assertFails(alice.doc('users/alice/items/r4').set(Object.fromEntries([['id', 'r4']].concat(Array.from({ length: 61 }, (_, i) => ['f' + i, i]))))));
await t('đường dẫn khác bị từ chối', assertFails(alice.doc('public/x').set({ a: 1 })));
await t('đọc đường dẫn gốc khác bị từ chối', assertFails(alice.doc('users/alice').get()));

await env.cleanup();
console.log(failed ? '\n' + failed + ' lỗi' : '\nTất cả xanh');
process.exit(failed ? 1 : 0);
