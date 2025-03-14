import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { a } from "@react-spring/three";

const AIAgent = ({ position, action }) => {
  const [currentPos, setCurrentPos] = useState([...position]);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const jumpSpeed = 0.15;

  useEffect(() => {
    if (!action) return;

    if (action.type === "move") {
      let dir = [0, 0, 0];

      if (action.direction === "left") dir = [-0.1, 0, 0];
      if (action.direction === "right") dir = [0.1, 0, 0];
      if (action.direction === "forward") dir = [0, 0, -0.1];
      if (action.direction === "backward") dir = [0, 0, 0.1];

      setVelocity(dir);
    } else if (action.type === "jump") {
      if (!jumping) {
        setJumping(true);
      }
    } else if (action.type === "spin") {
      setRotation((prev) => prev + 0.1);
    }
  }, [action]);

  useFrame(() => {
    setCurrentPos((prev) => [
      prev[0] + velocity[0],
      prev[1],
      prev[2] + velocity[2]
    ]);

    if (jumping) {
      if (jumpHeight < 1) {
        setJumpHeight((prev) => prev + jumpSpeed);
      } else {
        setJumping(false);
      }
    } else if (jumpHeight > 0) {
      setJumpHeight((prev) => prev - jumpSpeed);
    }
  });

  return (
    <a.mesh position={[currentPos[0], 1 + jumpHeight, currentPos[2]]} rotation={[0, rotation, 0]} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </a.mesh>
  );
};

export default AIAgent;
