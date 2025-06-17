
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';

interface EditorSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    theme: 'vs-dark' | 'light';
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
    autoSave: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const FONT_FAMILIES = [
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Source Code Pro', label: 'Source Code Pro' }
];

export const EditorSettings: React.FC<EditorSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  if (!isOpen) return null;

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-dark-secondary border-border-dark">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Editor Settings
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-white">Theme</Label>
            <Select 
              value={settings.theme} 
              onValueChange={(value: 'vs-dark' | 'light') => updateSetting('theme', value)}
            >
              <SelectTrigger className="bg-dark-primary border-border-dark text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-primary border-border-dark">
                <SelectItem value="vs-dark" className="text-white">Dark</SelectItem>
                <SelectItem value="light" className="text-white">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-white">Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting('fontSize', value[0])}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label className="text-white">Font Family</Label>
            <Select 
              value={settings.fontFamily} 
              onValueChange={(value) => updateSetting('fontFamily', value)}
            >
              <SelectTrigger className="bg-dark-primary border-border-dark text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-primary border-border-dark">
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="text-white">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tab Size */}
          <div className="space-y-2">
            <Label className="text-white">Tab Size: {settings.tabSize}</Label>
            <Slider
              value={[settings.tabSize]}
              onValueChange={(value) => updateSetting('tabSize', value[0])}
              min={2}
              max={8}
              step={1}
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Word Wrap</Label>
              <Switch
                checked={settings.wordWrap}
                onCheckedChange={(checked) => updateSetting('wordWrap', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Minimap</Label>
              <Switch
                checked={settings.minimap}
                onCheckedChange={(checked) => updateSetting('minimap', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Line Numbers</Label>
              <Switch
                checked={settings.lineNumbers}
                onCheckedChange={(checked) => updateSetting('lineNumbers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Auto Save</Label>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
