
import { useState } from 'react';

interface Offer {
  id: string;
  name: string;
  description: string;
  original_price: number;
  group_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  status: string;
  supplier: string;
  category_id?: string;
  categories?: {
    name: string;
  };
  unit_of_measure?: string;
}

export const useOfferTableState = () => {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedOfferForProgress, setSelectedOfferForProgress] = useState<Offer | null>(null);

  const handleNewOffer = () => {
    setEditingOffer(null);
    setShowOfferForm(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setShowOfferForm(true);
  };

  const handleOfferSaved = () => {
    setShowOfferForm(false);
    setEditingOffer(null);
  };

  const handleProgressUpdate = (offer: Offer) => {
    setSelectedOfferForProgress(offer);
    setShowProgressModal(true);
  };

  const handleManageCategories = () => {
    setShowCategoryManager(true);
  };

  return {
    showOfferForm,
    setShowOfferForm,
    showCategoryManager,
    setShowCategoryManager,
    showProgressModal,
    setShowProgressModal,
    editingOffer,
    selectedOfferForProgress,
    handleNewOffer,
    handleEdit,
    handleOfferSaved,
    handleProgressUpdate,
    handleManageCategories,
  };
};
