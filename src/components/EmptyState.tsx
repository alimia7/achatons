
interface EmptyStateProps {
  selectedCategory: string;
  searchTerm?: string;
}

const EmptyState = ({ selectedCategory, searchTerm }: EmptyStateProps) => {
  const hasSearch = searchTerm && searchTerm.trim() !== '';
  const hasCategoryFilter = selectedCategory !== 'all';

  let message = "Aucune offre active pour le moment.";
  if (hasSearch && hasCategoryFilter) {
    message = `Aucune offre ne correspond à votre recherche "${searchTerm}" dans cette catégorie.`;
  } else if (hasSearch) {
    message = `Aucune offre ne correspond à votre recherche "${searchTerm}".`;
  } else if (hasCategoryFilter) {
    message = `Aucune offre dans cette catégorie pour le moment.`;
  }

  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-600 mb-4">
        {message}
      </p>
      <p className="text-gray-500">
        {hasSearch 
          ? "Essayez de modifier vos critères de recherche."
          : "Revenez bientôt pour découvrir de nouvelles opportunités d'achat groupé !"
        }
      </p>
    </div>
  );
};

export default EmptyState;
