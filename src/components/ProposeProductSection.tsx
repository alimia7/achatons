
import { useState } from 'react';
import ProposeProductModal from './ProposeProductModal';

interface Category {
  id: string;
  name: string;
}

interface ProposeProductSectionProps {
  categories: Category[];
}

const ProposeProductSection = ({ categories }: ProposeProductSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Vous ne trouvez pas ce que vous cherchez ?
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-achatons-orange hover:bg-achatons-brown text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Proposer un produit
        </button>
      </div>

      <ProposeProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />
    </>
  );
};

export default ProposeProductSection;
