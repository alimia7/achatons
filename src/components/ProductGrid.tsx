
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  originalId: string;
  name: string;
  description: string;
  originalPrice: number;
  groupPrice: number;
  savings: number;
  currentParticipants: number;
  targetParticipants: number;
  deadline: string;
  image: string;
  supplier: string;
  category?: string;
}

interface ProductGridProps {
  products: Product[];
  onJoinGroup: (productId: string) => void;
}

const ProductGrid = ({ products, onJoinGroup }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onJoinGroup={() => onJoinGroup(product.id.toString())}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
