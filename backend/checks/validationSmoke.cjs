/** Run with: node backend/checks/validationSmoke.cjs (from project root). */
const assert = require('node:assert/strict');
const { validateUserDetails, validateNewPassword } = require('../src/utils/userInputValidation');
const valid = {
  firstName: 'Anisha', lastName: 'Khatri', age: 24,
  email: 'anisha@example.com', phoneNumber: '9801234567',
  address: 'Kathmandu, Nepal', gender: 'prefer-not-to-say',
};
const ok = validateUserDetails(valid);
assert.equal(ok.error, undefined);
assert.equal(ok.values.phoneNumber, '9801234567');
assert.equal(ok.values.email, 'anisha@example.com');
const bad = [
  [{ phoneNumber: '123456789' }, '10 digits'],
  [{ phoneNumber: '12345678901' }, '10 digits'],
  [{ phoneNumber: '98abc12345' }, '10 digits'],
  [{ phoneNumber: '+9779801234567' }, '10 digits'],
  [{ phoneNumber: '980 1234567' }, '10 digits'],
  [{ age: 15 }, '16 and 100'],
  [{ age: 101 }, '16 and 100'],
  [{ age: 25.5 }, '16 and 100'],
  [{ age: 'abc' }, '16 and 100'],
  [{ email: 'not-an-email' }, 'email'],
  [{ email: 'a@b' }, 'email'],
  [{ firstName: 'J' }, 'First name'],
  [{ firstName: '123John' }, 'First name'],
  [{ lastName: '!!' }, 'Last name'],
  [{ address: 'x' }, 'Address'],
  [{ gender: 'wrong' }, 'gender'],
];
for (const [overrides, message] of bad) {
  const result = validateUserDetails({ ...valid, ...overrides });
  assert.ok(result.error?.includes(message), `Expected '${message}' for ${JSON.stringify(overrides)}, got ${result.error}`);
}
assert.deepEqual(validateUserDetails({ phoneNumber: '9801234567' }, { partial: true }).values, { phoneNumber: '9801234567' });
assert.equal(validateUserDetails({ phoneNumber: '12x' }, { partial: true }).error?.includes('10 digits'), true);
assert.equal(validateNewPassword('StrongPassword123!'), '');
assert.ok(validateNewPassword('short').includes('12'));
assert.ok(validateNewPassword('alllowercase1234').includes('uppercase'));
assert.ok(validateNewPassword('ALLUPPERCASE123!').includes('lowercase'));
assert.ok(validateNewPassword('StrongPassword!').includes('number'));
assert.ok(validateNewPassword('StrongPassword123').includes('symbol'));
assert.ok(validateNewPassword('Strong Pass123!').includes('spaces'));
console.log(`Validation smoke checks passed: ${bad.length} bad user inputs, valid create/edit, and password policies.`);
