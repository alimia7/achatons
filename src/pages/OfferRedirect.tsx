import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingState from '@/components/LoadingState';

const OfferRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Redirect to products page with offer ID as query parameter
      navigate(`/produits?offer=${id}`, { replace: true });
    } else {
      // If no ID, just go to products page
      navigate('/produits', { replace: true });
    }
  }, [id, navigate]);

  return <LoadingState />;
};

export default OfferRedirect;
