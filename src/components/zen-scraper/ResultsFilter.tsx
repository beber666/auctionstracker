import { ScrapedItem } from "@/services/zenScraper";
import { useEffect, useState } from "react";
import { BidsFilter } from "./filters/BidsFilter";
import { TimeFilter } from "./filters/TimeFilter";
import { PriceFilter } from "./filters/PriceFilter";
import { NameFilter } from "./filters/NameFilter";
import { filterByBids, filterByTime, filterByPrice } from "./filters/FilterUtils";

interface ResultsFilterProps {
  results: ScrapedItem[];
  onFilterChange: (filtered: ScrapedItem[]) => void;
}

export const ResultsFilter = ({ results, onFilterChange }: ResultsFilterProps) => {
  const [showOnlyWithBids, setShowOnlyWithBids] = useState(false);
  const [maxHoursRemaining, setMaxHoursRemaining] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const filterByName = (items: ScrapedItem[], term: string): ScrapedItem[] => {
    if (!term) return items;
    const lowercaseTerm = term.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowercaseTerm)
    );
  };

  useEffect(() => {
    let filteredResults = [...results];
    
    // Apply filters in sequence
    filteredResults = filterByName(filteredResults, searchTerm);
    filteredResults = filterByBids(filteredResults, showOnlyWithBids);
    filteredResults = filterByTime(filteredResults, maxHoursRemaining);
    filteredResults = filterByPrice(filteredResults, priceRange);

    onFilterChange(filteredResults);
  }, [results, searchTerm, showOnlyWithBids, maxHoursRemaining, priceRange, onFilterChange]);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>
      
      <NameFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <BidsFilter 
        showOnlyWithBids={showOnlyWithBids}
        onBidsFilterChange={setShowOnlyWithBids}
      />

      <TimeFilter 
        maxHoursRemaining={maxHoursRemaining}
        onTimeFilterChange={setMaxHoursRemaining}
      />

      <PriceFilter 
        priceRange={priceRange}
        onPriceChange={handlePriceChange}
      />
    </div>
  );
};