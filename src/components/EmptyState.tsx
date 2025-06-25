
interface EmptyStateProps {
  selectedCategory: string;
}

const EmptyState = ({ selectedCategory }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-600 mb-4">
        {selectedCategory === 'all' 
          ? "Aucune offre active pour le moment."
          : `Aucune offre dans cette catégorie pour le moment.`
        }
      </p>
      <p className="text-gray-500">
        Revenez bientôt pour découvrir de nouvelles opportunités d'achat groupé !
      </p>
    </div>
  );
};

export default EmptyState;
