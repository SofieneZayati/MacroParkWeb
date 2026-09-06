const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');

// Test the real store without adding a runner or a duplicate state model.
const filename = resolve(__dirname, '../components/experience/useExperienceStore.ts');
const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleExports = {};
new Function('require', 'exports', source)(createRequire(filename), moduleExports);
const store = moduleExports.useExperienceStore;
const state = () => store.getState();
beforeEach(() => state().reset());

test('choices and solar survive switching between places without mixing setups', () => {
  state().completeIntro();
  state().chooseEnvironment('home');
  state().chooseProblem('ev-charging');
  state().toggleSolar();
  state().chooseProblem('guest-access');
  state().backToChooser();
  state().chooseEnvironment('retail');
  assert.deepEqual(state().selectedProblems, []);
  state().chooseProblem('parking-guidance');
  state().chooseEnvironment('home');
  assert.deepEqual(state().selectedProblems, ['ev-charging', 'guest-access']);
  assert.equal(state().solarEnabled, true);
  state().chooseEnvironment('retail');
  assert.deepEqual(state().selectedProblems, ['parking-guidance']);
  assert.equal(state().solarEnabled, false);
});

test('removing charging also removes dependent solar from restored configuration', () => {
  state().chooseEnvironment('home');
  state().chooseProblem('ev-charging');
  state().toggleSolar();
  state().removeProblem('ev-charging');
  assert.equal(state().solarEnabled, false);
  state().toggleSolar();
  assert.equal(state().solarEnabled, false);
  state().backToChooser();
  state().chooseEnvironment('home');
  assert.deepEqual(state().selectedProblems, []);
  assert.equal(state().solarEnabled, false);
});

test('previewing a need runs its story without adding it to the current or saved setup', () => {
  state().chooseEnvironment('home');
  state().chooseProblem('automatic-access');
  state().openSummary();
  state().setGuestAccessPreview('expired');
  state().setResidenceAccessAuthorized(true);
  const revision = state().demoRevision;
  state().previewProblem('guest-access');
  assert.equal(state().selectedProblem, 'guest-access');
  assert.equal(state().demoRevision, revision + 1);
  assert.equal(state().summaryOpen, false);
  assert.equal(state().guestAccessPreview, 'active');
  assert.equal(state().residenceAccessAuthorized, false);
  assert.deepEqual(state().selectedProblems, ['automatic-access']);

  state().chooseEnvironment('residence');
  state().previewProblem('protect-space');
  assert.deepEqual(state().selectedProblems, []);
  state().chooseEnvironment('home');
  assert.deepEqual(state().selectedProblems, ['automatic-access']);
  state().chooseEnvironment('residence');
  assert.deepEqual(state().selectedProblems, []);
});

test('adding a preview saves it once without restarting or resetting the demonstration', () => {
  state().chooseEnvironment('residence');
  state().previewProblem('protect-space');
  state().setResidenceAccessAuthorized(true);
  const revision = state().demoRevision;
  state().addProblem('protect-space');
  state().addProblem('protect-space');
  assert.deepEqual(state().selectedProblems, ['protect-space']);
  assert.equal(state().selectedProblem, 'protect-space');
  assert.equal(state().demoRevision, revision);
  assert.equal(state().residenceAccessAuthorized, true);
  state().chooseEnvironment('home');
  state().chooseEnvironment('residence');
  assert.deepEqual(state().selectedProblems, ['protect-space']);
});

test('solar cannot be added while charging is only being previewed', () => {
  state().chooseEnvironment('retail');
  state().previewProblem('ev-charging');
  state().toggleSolar();
  assert.deepEqual(state().selectedProblems, []);
  assert.equal(state().solarEnabled, false);
  state().addProblem('ev-charging');
  state().toggleSolar();
  assert.equal(state().solarEnabled, true);
});

test('replay starts a new demonstration without duplicating the selected need', () => {
  state().chooseEnvironment('residence');
  state().chooseProblem('guest-access');
  state().setGuestAccessPreview('expired');
  const revision = state().demoRevision;
  state().replayDemo();
  assert.equal(state().demoRevision, revision + 1);
  assert.equal(state().guestAccessPreview, 'active');
  assert.deepEqual(state().selectedProblems, ['guest-access']);
  state().chooseProblem('guest-access');
  assert.equal(state().demoRevision, revision + 2);
  assert.deepEqual(state().selectedProblems, ['guest-access']);
});

test('removing the last need leaves an accessible empty summary until dismissed', () => {
  state().chooseEnvironment('home');
  state().chooseProblem('automatic-access');
  state().openSummary();
  state().removeProblem('automatic-access');
  assert.equal(state().summaryOpen, true);
  assert.deepEqual(state().selectedProblems, []);
  state().closeSummary();
  assert.equal(state().summaryOpen, false);
});

test('reviewing a setup preserves the active demonstration for dismissal', () => {
  state().chooseEnvironment('residence');
  state().previewProblem('protect-space');
  state().addProblem('protect-space');
  state().setResidenceAccessAuthorized(true);
  const revision = state().demoRevision;
  state().openSummary();
  state().closeSummary();
  assert.equal(state().selectedProblem, 'protect-space');
  assert.equal(state().residenceAccessAuthorized, true);
  assert.equal(state().demoRevision, revision);
});

test('a fresh protection demonstration requires authorization again', () => {
  state().chooseEnvironment('residence');
  state().chooseProblem('protect-space');
  state().setResidenceAccessAuthorized(true);
  state().replayDemo();
  assert.equal(state().residenceAccessAuthorized, false);
  assert.deepEqual(state().selectedProblems, ['protect-space']);
});

test('reset removes all per-place setups and returns to the opening', () => {
  state().chooseEnvironment('home');
  state().chooseProblem('guest-access');
  state().chooseEnvironment('residence');
  state().chooseProblem('protect-space');
  state().reset();
  assert.deepEqual(state().configurations, {});
  assert.deepEqual(state().selectedProblems, []);
  assert.equal(state().selectedEnvironment, null);
  assert.equal(state().introComplete, false);
  assert.equal(state().phase, 'arrival');
});
