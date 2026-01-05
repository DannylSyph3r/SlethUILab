"use client";

import { useState } from "react";
import { Settings, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface GlassSettings {
  numStripes: number;
  strength: number;
  shadowIntensity: number;
  grainIntensity: number;
  animationDuration: number;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  gradientAccent: string;
}

interface ColorPreset {
  name: string;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  gradientAccent: string;
}

const colorPresets: ColorPreset[] = [
  {
    name: "Pink Blue",
    gradientStart: "#ec4899",
    gradientMiddle: "#8b5cf6",
    gradientEnd: "#3b82f6",
    gradientAccent: "#06b6d4",
  },
  {
    name: "Orange Dark",
    gradientStart: "#f97316",
    gradientMiddle: "#ea580c",
    gradientEnd: "#14b8a6",
    gradientAccent: "#fbbf24",
  },
  {
    name: "Gold Black",
    gradientStart: "#fbbf24",
    gradientMiddle: "#f59e0b",
    gradientEnd: "#78350f",
    gradientAccent: "#fef3c7",
  },
  {
    name: "Blue Orange",
    gradientStart: "#3b82f6",
    gradientMiddle: "#1d4ed8",
    gradientEnd: "#ea580c",
    gradientAccent: "#93c5fd",
  },
  {
    name: "Deep Neon",
    gradientStart: "#f43f5e",
    gradientMiddle: "#a855f7",
    gradientEnd: "#1e3a8a",
    gradientAccent: "#7c3aed",
  },
  {
    name: "Aurora",
    gradientStart: "#22c55e",
    gradientMiddle: "#06b6d4",
    gradientEnd: "#8b5cf6",
    gradientAccent: "#14b8a6",
  },
];

interface SettingsPanelProps {
  settings: GlassSettings;
  onSettingsChange: (settings: Partial<GlassSettings>) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePresetClick = (preset: ColorPreset) => {
    onSettingsChange({
      gradientStart: preset.gradientStart,
      gradientMiddle: preset.gradientMiddle,
      gradientEnd: preset.gradientEnd,
      gradientAccent: preset.gradientAccent,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-2xl"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Settings Panel */}
      {isOpen && (
        <Card className="w-80 bg-black/80 backdrop-blur-xl border-white/10 text-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <CardHeader className="pb-2 flex flex-row items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-10">
            <CardTitle className="text-sm font-medium">Fractal Glass</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/10"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isCollapsed && (
            <CardContent className="space-y-4 pt-0">
              {/* Glass Effect Parameters */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Glass Effect
                </h4>

                {/* Number of Stripes */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-white/80">Ridges</Label>
                    <span className="text-white/50 font-mono">
                      {settings.numStripes.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.numStripes]}
                    min={10}
                    max={120}
                    step={1}
                    onValueChange={([v]) => onSettingsChange({ numStripes: v })}
                    className="[&_[role=slider]]:bg-white"
                  />
                </div>

                {/* Strength */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-white/80">Displacement</Label>
                    <span className="text-white/50 font-mono">
                      {settings.strength.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.strength]}
                    min={0.3}
                    max={4.0}
                    step={0.1}
                    onValueChange={([v]) => onSettingsChange({ strength: v })}
                    className="[&_[role=slider]]:bg-white"
                  />
                </div>

                {/* Shadow Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-white/80">Edge Shadow</Label>
                    <span className="text-white/50 font-mono">
                      {settings.shadowIntensity.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.shadowIntensity]}
                    min={0}
                    max={1.0}
                    step={0.05}
                    onValueChange={([v]) => onSettingsChange({ shadowIntensity: v })}
                    className="[&_[role=slider]]:bg-white"
                  />
                </div>

                {/* Grain Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-white/80">Film Grain</Label>
                    <span className="text-white/50 font-mono">
                      {settings.grainIntensity.toFixed(3)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.grainIntensity]}
                    min={0}
                    max={0.15}
                    step={0.005}
                    onValueChange={([v]) => onSettingsChange({ grainIntensity: v })}
                    className="[&_[role=slider]]:bg-white"
                  />
                </div>

                {/* Animation Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-white/80">Animation Speed</Label>
                    <span className="text-white/50 font-mono">
                      {(24 / settings.animationDuration).toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    value={[settings.animationDuration]}
                    min={4}
                    max={48}
                    step={2}
                    onValueChange={([v]) => onSettingsChange({ animationDuration: v })}
                    className="[&_[role=slider]]:bg-white"
                  />
                </div>
              </div>

              {/* Color Section */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Gradient Colors
                </h4>

                {/* Color Inputs */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-white/60">1</Label>
                    <input
                      type="color"
                      value={settings.gradientStart}
                      onChange={(e) => onSettingsChange({ gradientStart: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer border border-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-white/60">2</Label>
                    <input
                      type="color"
                      value={settings.gradientMiddle}
                      onChange={(e) => onSettingsChange({ gradientMiddle: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer border border-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-white/60">3</Label>
                    <input
                      type="color"
                      value={settings.gradientEnd}
                      onChange={(e) => onSettingsChange({ gradientEnd: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer border border-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-white/60">4</Label>
                    <input
                      type="color"
                      value={settings.gradientAccent}
                      onChange={(e) => onSettingsChange({ gradientAccent: e.target.value })}
                      className="w-full h-8 rounded cursor-pointer border border-white/20"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <Label className="text-xs text-white/60">Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white"
                        onClick={() => handlePresetClick(preset)}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${preset.gradientStart}, ${preset.gradientMiddle}, ${preset.gradientEnd})`,
                          }}
                        />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
