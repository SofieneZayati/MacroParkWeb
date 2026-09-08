const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { buildProjectBrief } = loadTypeScript('lib/projectBrief.ts');
const { environments } = loadTypeScript('lib/experienceContent.ts');

const details = {
  location: '',
  scale: 'small',
  timing: 'exploring',
  contactName: '',
  contactEmail: '',
};

test('each place exports its selected catalog solutions once, in a consistent order', () => {
  for (const environment of environments) {
    const ids = environment.problems.map((problem) => problem.id);
    const brief = buildProjectBrief(environment.id, {
      selectedProblems: [...ids].reverse().concat(ids), solarEnabled: true,
    }, details);
    assert.ok(brief.includes(`Project type: ${environment.name}`));
    let position = -1;
    for (const problem of environment.problems) {
      const line = `- ${problem.label}\n  ${problem.resultBody}`;
      assert.equal(brief.split(line).length - 1, 1);
      const nextPosition = brief.indexOf(line);
      assert.ok(nextPosition > position);
      position = nextPosition;
    }
    assert.equal(brief.split('- Solar canopy').length - 1, 1);
  }
});

test('briefs exclude invalid cross-place choices and solar without selected charging', () => {
  const brief = buildProjectBrief('home', {
    selectedProblems: ['automatic-access', 'parking-guidance', 'unknown'], solarEnabled: true,
  }, details);
  assert.ok(brief.includes('- Open my garage automatically'));
  assert.ok(!brief.includes('Help customers find free spaces'));
  assert.ok(!brief.includes('unknown'));
  assert.ok(!brief.includes('Solar canopy'));
});

test('optional details have truthful defaults and supplied text is trimmed', () => {
  const configuration = { selectedProblems: ['guest-access'], solarEnabled: false };
  const empty = buildProjectBrief('home', configuration, details);
  assert.ok(empty.includes('Location: To be confirmed'));
  assert.ok(empty.includes('Contact: Not provided'));
  assert.ok(empty.includes('Email: Not provided'));
  assert.ok(empty.includes('Parking scale: 6–30 spaces'));
  assert.ok(empty.includes('Project timing: Exploring possibilities'));

  const filled = buildProjectBrief('home', configuration, {
    location: '  Tunis  ', scale: 'private', timing: 'planning',
    contactName: '  Demo Client ', contactEmail: '  demo@example.com ',
  });
  assert.ok(filled.includes('Location: Tunis\n'));
  assert.ok(filled.includes('Contact: Demo Client\n'));
  assert.ok(filled.includes('Email: demo@example.com\n'));
  assert.ok(filled.includes('Parking scale: 1–5 spaces'));
  assert.ok(filled.includes('Project timing: Planning a project'));
});

test('no selected place produces no brief', () => {
  assert.equal(buildProjectBrief(null, { selectedProblems: [], solarEnabled: false }, details), '');
});
