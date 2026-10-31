import React from "react";

import {
  ViroScene,
  ViroNode,
  ViroBox,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroMaterials,
} from "@reactvision/react-viro";

import type { ApprovedScene } from "../domain/scene";

ViroMaterials.createMaterials({
  rayWood: {
    diffuseColor: "#B98954",
    lightingModel: "Lambert",
  },
  rayHighlight: {
    diffuseColor: "#C8F4A0",
    lightingModel: "Lambert",
  },
});

type Props = {
  sceneNavigator?: {
    viroAppProps?: {
      plan?: ApprovedScene;
      step?: number;
      angle?: number;
    };
  };
};

export function PreviewProbe({ sceneNavigator }: Props) {
  const {
    plan,
    step = 0,
    angle = -22,
  } = sceneNavigator?.viroAppProps ?? {};

  const parts = (plan?.scene?.components ?? [])
    .filter((part) => part.shape === "box")
    .slice(0, 35);

  const heightMeters = parts.length
    ? Math.max(
        ...parts.map(
          (part) =>
            part.position_cm[1] +
            part.size_cm[1] / 2
        )
      ) / 100
    : 0.5;

  const activeIds = new Set(
    plan?.assembly_steps?.[step]?.highlight_component_ids ?? []
  );

  return (
    <ViroScene>
      <ViroAmbientLight
        color="#FFFFFF"
        intensity={450}
      />

      <ViroDirectionalLight
        color="#FFFFFF"
        direction={[-0.4, -1, -0.6]}
      />

      <ViroNode
        position={[0, -heightMeters / 2, -1.8]}
        rotation={[-10, angle, 0]}
      >
        {parts.map((part) => (
          <ViroBox
            key={part.id}
            position={[
              part.position_cm[0] / 100,
              part.position_cm[1] / 100,
              part.position_cm[2] / 100,
            ]}
            rotation={part.rotation_deg}
            width={Math.max(part.size_cm[0] / 100, 0.005)}
            height={Math.max(part.size_cm[1] / 100, 0.005)}
            length={Math.max(part.size_cm[2] / 100, 0.005)}
            materials={[
              activeIds.has(part.id)
                ? "rayHighlight"
                : "rayWood"
            ]}
          />
        ))}
      </ViroNode>
    </ViroScene>
  );
}
