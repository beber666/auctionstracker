import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  autoRefresh: boolean;
  refreshInterval: number;
  currency: string;
  language: string;
  onAutoRefreshChange: (enabled: boolean) => void;
  onRefreshIntervalChange: (minutes: number) => void;
  onCurrencyChange: (currency: string) => void;
  onLanguageChange: (language: string) => void;
}

export const SettingsPanel = ({
  autoRefresh,
  refreshInterval,
  currency,
  language,
  onAutoRefreshChange,
  onRefreshIntervalChange,
  onCurrencyChange,
  onLanguageChange,
}: SettingsPanelProps) => {
  const { toast } = useToast();

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await onLanguageChange(newLanguage);
      toast({
        title: "Language Updated",
        description: "The page will refresh to apply the changes.",
      });
      // Force refresh all auctions to retranslate names
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error updating language:", error);
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={onAutoRefreshChange}
            />
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="1"
              max="60"
              value={refreshInterval}
              onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
              className="w-20"
              disabled={!autoRefresh}
            />
            <Label>Minutes</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};