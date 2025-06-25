
const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-achatons-orange mx-auto"></div>
        <p className="text-xl text-gray-700 mt-4">Chargement des offres...</p>
      </div>
    </div>
  );
};

export default LoadingState;
