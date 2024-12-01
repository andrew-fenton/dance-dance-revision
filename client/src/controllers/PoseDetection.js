/**
 * Constants
 */
const BODYPART_MAP = {
  "leftEar": 7,
  "rightEar": 8,
  "leftShoulder": 11,
  "rightShoulder": 12,
  "leftElbow": 13,
  "rightElbow": 14,
  "leftWrist": 15,
  "rightWrist": 16,
  "leftHip": 23,
  "rightHip": 24,
  "leftKnee": 25,
  "rightKnee": 26,
  "leftAnkle": 27,
  "rightAnkle": 28,
  "leftFoot": 31,
  "rightFoot": 32,
}
const LEFT_BUFFER = 0.15;
const RIGHT_BUFFER = 0.15;
const UP_BUFFER = 0.075;
const DOWN_BUFFER = 0.20;


/**
 * Body detection functions
 * Top left of screen is (0, 0)
 */
export default function detectPose(landmarks) {
  const movedLeft = detectMoveLeft(landmarks);
  const movedRight = detectMoveRight(landmarks);
  const movedUp = detectMoveUp(landmarks);
  const movedDown = detectMoveDown(landmarks);
  return [movedLeft, movedRight, movedUp, movedDown]
}

function detectMoveUp(landmarks) {
  const leftWristY = landmarks[BODYPART_MAP["leftWrist"]]["y"];
  const rightWristY = landmarks[BODYPART_MAP["rightWrist"]]["y"];
  const leftEarY = landmarks[BODYPART_MAP["leftEar"]]["y"];
  const rightEarY = landmarks[BODYPART_MAP["rightEar"]]["y"];
  return (leftWristY < (leftEarY - UP_BUFFER) && rightWristY < (rightEarY - UP_BUFFER));
}

function detectMoveLeft(landmarks) {
  const leftWristX = landmarks[BODYPART_MAP["leftWrist"]]["x"];
  const leftFootX = landmarks[BODYPART_MAP["leftFoot"]]["x"];
  const leftShoulderX = landmarks[BODYPART_MAP["leftShoulder"]]["x"];
  return (leftWristX > (leftShoulderX + LEFT_BUFFER)|| leftFootX > (leftShoulderX + LEFT_BUFFER));
}

function detectMoveRight(landmarks) {
  const rightWristX = landmarks[BODYPART_MAP["rightWrist"]]["x"];
  const rightFootX = landmarks[BODYPART_MAP["leftFoot"]]["x"];
  const rightShoulderX = landmarks[BODYPART_MAP["rightShoulder"]]["x"];
  return (rightWristX < (rightShoulderX - RIGHT_BUFFER) || rightFootX < (rightShoulderX - RIGHT_BUFFER));
}

function detectMoveDown(landmarks) {
  const leftHipY = landmarks[BODYPART_MAP["leftHip"]]["y"];
  const leftKneeY = landmarks[BODYPART_MAP["leftKnee"]]["y"];
  const rightHipY = landmarks[BODYPART_MAP["rightHip"]]["y"];
  const rightKneeY = landmarks[BODYPART_MAP["rightKnee"]]["y"];
  return ((leftKneeY - leftHipY) < DOWN_BUFFER && (rightKneeY - rightHipY < DOWN_BUFFER));
}
