import React, { useRef, useState } from "react";

import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useRouter } from "expo-router";

import { Viro3DSceneNavigator } from "@reactvision/react-viro";

import { useProject } from "../src/state/Project";

import { PreviewProbe } from "../src/ar/PreviewProbe";

import {
  Page,
  Topbar,
  Eyebrow,
  Headline,
  Caption,
  Primary,
  PressScale,
} from "../src/components/Ui";

import { C } from "../src/theme";

// Keep the initial scene reference stable.
const INITIAL_SCENE = {
  scene: PreviewProbe as any,
};

export default function Preview() {
  const router = useRouter();

  const { height } = useWindowDimensions();

  const {
    plan,
    selectedStep,
    setSelectedStep,
    saved,
    setSaved,
  } = useProject();

  // Initial rotation of the 3D model
  const [angle, setAngle] = useState(-22);

  // Responsive height for the 3D viewer
  const viewerHeight = Math.max(
    250,
    Math.min(360, height * 0.38)
  );

  // Rotate model without recreating the scene.
  const rotateModel = (degrees: number) => {
    setAngle((previous) => {
      const next = (previous + degrees) % 360;
      return next;
    });
  };

  // Handle horizontal swipes.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_event, gesture) => {
        const horizontal = Math.abs(gesture.dx);
        const vertical = Math.abs(gesture.dy);

        return horizontal > 10 && horizontal > vertical * 1.2;
      },

      onPanResponderRelease: (_event, gesture) => {
        const rotation = Math.round(gesture.dx / 5);

        if (rotation !== 0) {
          setAngle((previous) => {
            return (previous + rotation) % 360;
          });
        }
      },

      onPanResponderTerminate: () => {},
    })
  ).current;

  // Show an empty state if no design exists.
  if (!plan) {
    return (
      <Page>
        <Topbar title="3D PREVIEW" />

        <View style={styles.emptyContainer}>
          <Eyebrow>RAY / MODEL STUDIO</Eyebrow>

          <Headline size={32} style={{ marginTop: 14 }}>
            No design yet.
          </Headline>

          <Caption style={{ marginTop: 15 }}>
            Create a design before opening the 3D viewer.
          </Caption>

          <Primary
            title="Start from space"
            onPress={() => router.replace("/space")}
            style={{ marginTop: 24 }}
          />
        </View>
      </Page>
    );
  }

  const assemblySteps = plan.assembly_steps ?? [];

  const totalSteps = assemblySteps.length;

  const currentStep = Math.max(
    0,
    Math.min(selectedStep, totalSteps - 1)
  );

  const step = assemblySteps[currentStep];

  // Previous assembly step
  const previousStep = () => {
    setSelectedStep((current) => Math.max(0, current - 1));
  };

  // Next assembly step
  const nextStep = () => {
    if (totalSteps === 0) return;

    setSelectedStep((current) => {
      return (current + 1) % totalSteps;
    });
  };

  // Open the AR placement screen
  const openAR = () => {
    router.push("/ar");
  };

  return (
    <Page>
      {/* HEADER */}

      <Topbar
        title="MODEL STUDIO / 04"
        number="04—04"
      />

      <View style={styles.header}>
        <Eyebrow>
          {plan.status === "demo"
            ? "OFFLINE SCENE DEMO"
            : "APPROVED SCENE"}{" "}
          / INTERACTIVE
        </Eyebrow>

        <Headline
          size={30}
          style={{ marginTop: 8 }}
        >
          {plan.design_name}
        </Headline>
      </View>

      {/* 3D MODEL VIEWER */}

      <View
        style={[
          styles.modelBox,
          { height: viewerHeight },
        ]}
      >
        <Viro3DSceneNavigator
          style={StyleSheet.absoluteFill}
          initialScene={INITIAL_SCENE}
          viroAppProps={{
            plan,
            step: currentStep,
            angle,
          }}
          onExitViro={() => {}}
          debug={false}
          multisamplingEnabled={false}
          hdrEnabled={false}
          pbrEnabled={false}
          shadowsEnabled={false}
          bloomEnabled={false}
        />

        {/* Top watermark */}

        <View
          style={styles.watermark}
          pointerEvents="none"
        >
          <Text style={styles.watermarkText}>
            TRUE SCALE · cm / 100
          </Text>
        </View>

        {/* Swipe area */}

        <View
          style={styles.swipeSurface}
          {...panResponder.panHandlers}
          accessibilityLabel="Swipe horizontally to rotate the 3D model"
        />

        {/* Rotation controls */}

        <View style={styles.rotationControls}>
          <PressScale
            onPress={() => rotateModel(-20)}
            accessibilityLabel="Rotate model left"
          >
            <View style={styles.circle}>
              <Text style={styles.rotationIcon}>
                ↶
              </Text>
            </View>
          </PressScale>

          <PressScale
            onPress={() => rotateModel(20)}
            accessibilityLabel="Rotate model right"
          >
            <View style={styles.circle}>
              <Text style={styles.rotationIcon}>
                ↷
              </Text>
            </View>
          </PressScale>
        </View>

        {/* Rotation instruction */}

        <View
          style={styles.rotateHint}
          pointerEvents="none"
        >
          <Text style={styles.rotateHintText}>
            SWIPE TO ROTATE
          </Text>
        </View>
      </View>

      {/* ASSEMBLY STORY */}

      <View style={styles.assemblyContainer}>
        <View style={styles.assemblyHeader}>
          <Eyebrow>
            ASSEMBLY STORY
          </Eyebrow>

          <Text style={styles.stepCounter}>
            {totalSteps > 0
              ? `${currentStep + 1} / ${totalSteps}`
              : "0 / 0"}
          </Text>
        </View>

        {/* Step progress indicators */}

        {totalSteps > 0 && (
          <View style={styles.progressContainer}>
            {assemblySteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressBar,
                  {
                    backgroundColor:
                      index <= currentStep
                        ? C.lavender
                        : C.line,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* Current instruction */}

        <Text style={styles.stepTitle}>
          {step?.title ?? "Design preview"}
        </Text>

        <Caption style={styles.stepDescription}>
          {step?.instructions ??
            "Explore your 3D model and view it in augmented reality."}
        </Caption>

        {/* Assembly navigation */}

        {totalSteps > 0 && (
          <View style={styles.buttonRow}>
            <Primary
              title="Previous"
              secondary
              onPress={previousStep}
              disabled={currentStep === 0}
              style={styles.button}
            />

            <Primary
              title={
                currentStep === totalSteps - 1
                  ? "Restart"
                  : "Next part"
              }
              onPress={nextStep}
              style={styles.button}
            />
          </View>
        )}

        {/* Save and AR buttons */}

        <View style={styles.buttonRow}>
          <Primary
            title={
              saved
                ? "Saved this session"
                : "Save concept"
            }
            secondary
            onPress={() => setSaved(true)}
            style={styles.button}
          />

          <Primary
            title="View in AR"
            onPress={openAR}
            style={styles.button}
          />
        </View>

        {/* Safety information */}

        {!!plan.safety_note && (
          <Caption style={styles.safetyNote}>
            {plan.safety_note}
          </Caption>
        )}
      </View>
    </Page>
  );
}

// ---------------------------
// STYLES
// ---------------------------

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 25,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 17,
  },

  modelBox: {
    minHeight: 250,
    marginHorizontal: 13,

    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 24,

    overflow: "hidden",
    backgroundColor: C.panel,
  },

  watermark: {
    position: "absolute",
    left: 16,
    top: 16,

    backgroundColor: "#10131BDE",

    borderRadius: 10,
    padding: 10,
  },

  watermarkText: {
    color: C.lime,
    fontSize: 10,
    letterSpacing: 1.7,
  },

  swipeSurface: {
    position: "absolute",

    left: 0,
    right: 0,
    top: 65,
    bottom: 70,
  },

  rotationControls: {
    position: "absolute",

    bottom: 17,
    right: 17,

    flexDirection: "row",
    gap: 10,
  },

  circle: {
    width: 43,
    height: 43,

    borderRadius: 22,

    borderWidth: 1,
    borderColor: C.line,

    backgroundColor: "#161923E8",

    alignItems: "center",
    justifyContent: "center",
  },

  rotationIcon: {
    color: C.white,
    fontSize: 24,
  },

  rotateHint: {
    position: "absolute",
    bottom: 28,
    left: 16,
  },

  rotateHintText: {
    color: C.dim,
    fontSize: 9,
    letterSpacing: 1.5,
  },

  assemblyContainer: {
    paddingHorizontal: 23,
    paddingTop: 23,
    paddingBottom: 30,
  },

  assemblyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stepCounter: {
    color: C.dim,
    fontSize: 11,
  },

  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 13,
  },

  progressBar: {
    height: 3,
    flex: 1,
    borderRadius: 4,
  },

  stepTitle: {
    color: C.white,
    fontSize: 22,
    marginTop: 19,
    letterSpacing: -0.4,
  },

  stepDescription: {
    marginTop: 9,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  button: {
    flex: 1,
  },

  safetyNote: {
    fontSize: 10,
    marginTop: 13,
  },
});