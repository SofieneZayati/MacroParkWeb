const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { createRequire } = require('node:module');
const { PerspectiveCamera, Vector3 } = require('three');
const ts = require('typescript');

const filename = resolve(__dirname, '../components/experience/storyCamera.ts');
const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleExports = {};
new Function('require', 'exports', source)(createRequire(filename), moduleExports);
const { createStoryCamera } = moduleExports;

const shot = {
  position: [2.35, 3.85, -6.75],
  lookAt: [0, 0.55, -11.65],
  fov: 39,
  movementDamping: 4.2,
  fovDamping: 5.4,
};

test('camera damping is consistent across 30 Hz and 144 Hz', () => {
  function simulate(rate) {
    const camera = new PerspectiveCamera(50);
    camera.position.set(15, 18, 20);
    const update = createStoryCamera([0, 0.75, 4.2]);
    for (let frame = 0; frame < rate; frame++) update(camera, 1 / rate, false, shot);
    return camera;
  }
  const slow = simulate(30);
  const fast = simulate(144);
  assert.ok(slow.position.distanceTo(fast.position) < 1e-10);
  assert.ok(Math.abs(slow.fov - fast.fov) < 1e-10);
  assert.ok(slow.quaternion.angleTo(fast.quaternion) < 1e-7);
  const expectedFov = shot.fov + (50 - shot.fov) * Math.exp(-shot.fovDamping);
  assert.ok(Math.abs(slow.fov - expectedFov) < 1e-10);
});

test('reduced motion reaches the exact position, orientation, and FOV in one frame', () => {
  const camera = new PerspectiveCamera(shot.fov + 0.0005);
  camera.position.set(15, 18, 20);
  createStoryCamera([0, 0.75, 4.2])(camera, 0, true, shot);
  assert.deepEqual(camera.position.toArray(), shot.position);
  assert.equal(camera.fov, shot.fov);
  const expectedDirection = new Vector3(...shot.lookAt).sub(camera.position).normalize();
  assert.ok(camera.getWorldDirection(new Vector3()).distanceTo(expectedDirection) < 1e-10);
});

test('settled camera stops transform work and responds to a changed shot', () => {
  const camera = new PerspectiveCamera(50);
  const update = createStoryCamera([0, 0.75, 4.2]);
  const counts = { orientation: 0, projection: 0 };
  const lookAt = camera.lookAt.bind(camera);
  const updateProjection = camera.updateProjectionMatrix.bind(camera);
  camera.lookAt = (...args) => { counts.orientation++; return lookAt(...args); };
  camera.updateProjectionMatrix = () => { counts.projection++; return updateProjection(); };

  for (let frame = 0; frame < 600; frame++) update(camera, 1 / 60, false, shot);
  assert.deepEqual(camera.position.toArray(), shot.position);
  assert.equal(camera.fov, shot.fov);
  const settledCounts = { ...counts };
  for (let frame = 0; frame < 144; frame++) update(camera, 1 / 144, false, shot);
  assert.deepEqual(counts, settledCounts);

  const mobileShot = { ...shot, position: [2.6, 7.1, -5.25], fov: 49 };
  update(camera, 1 / 60, false, mobileShot);
  assert.ok(counts.orientation > settledCounts.orientation);
  assert.ok(counts.projection > settledCounts.projection);
  assert.ok(camera.position.y > shot.position[1]);
});

test('story FOV changes preserve the interface view offset', () => {
  const camera = new PerspectiveCamera(50);
  camera.setViewOffset(1280, 720, 179.2, 0, 1280, 720);
  const view = { ...camera.view };
  createStoryCamera([0, 0.75, 4.2])(camera, 1 / 60, true, shot);
  assert.deepEqual(camera.view, view);
});
