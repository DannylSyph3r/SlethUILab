"use client";

import { useState } from "react";
import { FractalGlassBackground } from "@/components/FractalGlassBackground";
import { SettingsPanel, GlassSettings } from "@/components/SettingsPanel";

const defaultSettings: GlassSettings = {
  numStripes: 50,
  strength: 1.5,
  shadowIntensity: 0.6,
  grainIntensity: 0.04,
  animationDuration: 12,
  gradientStart: "#ec4899",
  gradientMiddle: "#8b5cf6",
  gradientEnd: "#3b82f6",
  gradientAccent: "#06b6d4",
};

export default function FractalGlassPage() {
  const [settings, setSettings] = useState<GlassSettings>(defaultSettings);

  const handleSettingsChange = (newSettings: Partial<GlassSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <main className="relative min-h-screen bg-black">
      {/* Full-screen fractal glass effect */}
      <FractalGlassBackground
        numStripes={settings.numStripes}
        strength={settings.strength}
        shadowIntensity={settings.shadowIntensity}
        grainIntensity={settings.grainIntensity}
        animationDuration={settings.animationDuration}
        gradientColors={[
          settings.gradientStart,
          settings.gradientMiddle,
          settings.gradientEnd,
          settings.gradientAccent,
        ]}
      />

      {/* Settings panel overlay */}
      <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
    </main>
  );
}
