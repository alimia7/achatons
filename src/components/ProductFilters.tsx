
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const ProductFilters = ({ categories, selectedCategory, onCategoryChange }: ProductFiltersProps) => {
  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex items-center justify-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <Badge 
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onCategoryChange('all')}
        >
          Toutes
        </Badge>
        {categories.map((category) => (
          <Badge 
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;
