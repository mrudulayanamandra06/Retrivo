// RETRIVO COMPREHENSIVE AUTOMATED VERIFICATION SUITE
import { calculateMatchScore, findMatchesForItem } from './src/services/matchService.js';
import { INITIAL_USERS, INITIAL_ITEMS, INITIAL_MATCHES, INITIAL_CLAIMS } from './src/services/seedData.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log('\n==================================================');
console.log('RETRIVO TEST SUITE: CORE ENGINES & DATA INTEGRITY');
console.log('==================================================\n');

// 1. SMART MATCHING ENGINE TESTS
console.log('--- 1. Testing Smart Matching Engine Algorithm ---');

const sampleLost = {
  id: 'item-lost-test',
  item_type: 'lost',
  title: 'Space Gray MacBook Pro 14"',
  category: 'Electronics',
  location: 'Main Library 2nd Floor',
  event_date: '2026-11-04',
  description: 'Left on quiet study table. Has dark matte case.',
  distinguishing_features: 'React sticker on bottom corner, tiny scratch.'
};

const sampleFoundHigh = {
  id: 'item-found-test-1',
  item_type: 'found',
  title: 'Apple MacBook Pro in Gray Case',
  category: 'Electronics',
  location: 'Main Library 2nd Floor East',
  event_date: '2026-11-04',
  description: 'Found unattended on desk in Main Library study zone.',
  distinguishing_features: 'Dark protective case and tech sticker on bottom.'
};

const highMatchResult = calculateMatchScore(sampleLost, sampleFoundHigh);
assert(highMatchResult.score >= 80, `High match score is >= 80% (Actual: ${highMatchResult.score}%)`);
assert(highMatchResult.classification === 'Strong potential match', 'Classification is Strong potential match');
assert(highMatchResult.matched_attributes.category === 25, 'Exact category awards 25 points');
assert(highMatchResult.matched_attributes.date === 15, 'Same date awards 15 points');
assert(highMatchResult.matched_attributes.location >= 18, 'Same building zone awards >= 18 points');

// Test incompatible category
const sampleFoundDifferentCat = {
  id: 'item-found-test-2',
  item_type: 'found',
  title: 'Space Gray MacBook Pro 14"',
  category: 'Clothing',
  location: 'Gymnasium',
  event_date: '2026-10-01',
  description: 'A blue jacket found in gym lockers.',
  distinguishing_features: 'None'
};
const lowMatchResult = calculateMatchScore(sampleLost, sampleFoundDifferentCat);
assert(lowMatchResult.matched_attributes.category === 0, 'Incompatible category awards 0 points');
assert(lowMatchResult.score < 60, `Low match score is < 60% (Actual: ${lowMatchResult.score}%)`);

// Test candidate matching function
const candidates = findMatchesForItem(sampleLost, [sampleFoundHigh, sampleFoundDifferentCat]);
assert(candidates.length === 1, 'Only high-confidence candidates (>=50%) retained in results');
assert(candidates[0].counterpart.id === sampleFoundHigh.id, 'Top candidate is correct high match');

// 2. SEED DATA INTEGRITY TESTS
console.log('\n--- 2. Testing Starter Dataset & Accounts ---');
assert(INITIAL_USERS.length >= 3, `Initial users count is at least 3 (Found: ${INITIAL_USERS.length})`);
const lalli = INITIAL_USERS.find(u => u.id === 'user-lalli');
const maya = INITIAL_USERS.find(u => u.id === 'user-maya');
const admin = INITIAL_USERS.find(u => u.id === 'user-admin');

assert(lalli && lalli.full_name === 'Lalli' && lalli.role === 'student', 'Primary sample student (Lalli) configured');
assert(lalli.country === 'India', 'Primary sample profile country defaults to India');
assert(maya && maya.role === 'student', 'Student B (Maya Patel) configured');
assert(admin && admin.role === 'admin', 'Campus Admin (Inspector Rajesh Sharma) configured');

assert(INITIAL_ITEMS.length >= 6, `Initial items count >= 6 (Found: ${INITIAL_ITEMS.length})`);
const lostItems = INITIAL_ITEMS.filter(i => i.item_type === 'lost');
const foundItems = INITIAL_ITEMS.filter(i => i.item_type === 'found');
const recoveredItems = INITIAL_ITEMS.filter(i => i.status === 'recovered');

assert(lostItems.length >= 3, `Initial lost items >= 3 (Found: ${lostItems.length})`);
assert(foundItems.length >= 3, `Initial found items >= 3 (Found: ${foundItems.length})`);
assert(recoveredItems.length >= 1, `Initial recovered items >= 1 (Found: ${recoveredItems.length})`);

// 3. CLAIMS DATA INTEGRITY TESTS
console.log('\n--- 3. Testing Claims Dataset & Safeguards ---');
assert(INITIAL_CLAIMS.length >= 1, `Initial claims count >= 1 (Found: ${INITIAL_CLAIMS.length})`);
const sampleClaim = INITIAL_CLAIMS[0];
assert(sampleClaim.proof_description.length > 10, 'Claim proof description present');
assert(sampleClaim.private_verification_details.length > 5, 'Private verification details present');

console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
console.log('==================================================\n');
