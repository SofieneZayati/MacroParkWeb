import { Camera, MathUtils, PerspectiveCamera, Vector3 } from "three";

export type CameraPoint = readonly [number, number, number];

type StoryCameraFrame = {
  position: CameraPoint;
  lookAt: CameraPoint;
  fov: number;
  movementDamping: number;
  fovDamping: number;
};

const POSITION_EPSILON_SQUARED = 0.0001 ** 2;
const FOV_EPSILON = 0.001;

/** One controller belongs to one story; it never starts its own render loop. */
export function createStoryCamera(initialLookAt: CameraPoint) {
  const position = new Vector3();
  const target = new Vector3();
  const lookAt = new Vector3(...initialLookAt);
  let previousCamera: Camera | null = null;

  return function updateStoryCamera(
    camera: Camera,
    delta: number,
    reducedMotion: boolean,
    frame: StoryCameraFrame,
  ) {
    position.set(...frame.position);
    target.set(...frame.lookAt);

    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * frame.movementDamping);
    let orientationChanged = previousCamera !== camera;
    previousCamera = camera;

    if (!camera.position.equals(position)) {
      if (reducedMotion || camera.position.distanceToSquared(position) <= POSITION_EPSILON_SQUARED) {
        camera.position.copy(position);
      } else {
        camera.position.lerp(position, ease);
      }
      orientationChanged = true;
    }

    if (!lookAt.equals(target)) {
      if (reducedMotion || lookAt.distanceToSquared(target) <= POSITION_EPSILON_SQUARED) {
        lookAt.copy(target);
      } else {
        lookAt.lerp(target, ease);
      }
      orientationChanged = true;
    }

    if (camera instanceof PerspectiveCamera && camera.fov !== frame.fov) {
      camera.fov = reducedMotion || Math.abs(camera.fov - frame.fov) <= FOV_EPSILON
        ? frame.fov
        : MathUtils.damp(camera.fov, frame.fov, frame.fovDamping, delta);
      camera.updateProjectionMatrix();
    }

    if (orientationChanged) camera.lookAt(lookAt);
  };
}
