"use client";

import { useState } from "react";
import { FractalGlassBackground } from "@/components/fractalglass/FractalGlassBackground";
import { SettingsPanel, GlassSettings } from "@/components/fractalglass/SettingsPanel";

const defaultSettings: GlassSettings = {
  noiseScale: 1.0,
  displacementStrength: 0.15,
  lineFrequency: 120,
  ridgeWaviness: 0.5,
  animationSpeed: 0.1,
  grainIntensity: 0.04,
  contrastBoost: 1.3,
  waveComplexity: 1,
  flowIntensity: 1,
  colorDark: "#0a0515",
  colorMid: "#581c87",
  colorBright: "#ec4899",
  colorAccent: "#06b6d4",
};

export default function FractalGlassPage() {
  const [settings, setSettings] = useState<GlassSettings>(defaultSettings);

  const handleSettingsChange = (newSettings: Partial<GlassSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <main className="relative min-h-screen">
      <FractalGlassBackground
        noiseScale={settings.noiseScale}
        displacementStrength={settings.displacementStrength}
        lineFrequency={settings.lineFrequency}
        ridgeWaviness={settings.ridgeWaviness}
        animationSpeed={settings.animationSpeed}
        grainIntensity={settings.grainIntensity}
        contrastBoost={settings.contrastBoost}
        waveComplexity={settings.waveComplexity}
        flowIntensity={settings.flowIntensity}
        gradientColors={[
          settings.colorDark,
          settings.colorMid,
          settings.colorBright,
          settings.colorAccent,
        ]}
      />
      <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
    </main>
  );
}
