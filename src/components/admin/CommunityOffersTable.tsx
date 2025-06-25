
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import OfferTableHeader from './OfferTableHeader';
import CommunityOfferTableRow from './CommunityOfferTableRow';
import { useCommunityOfferActions } from './hooks/useCommunityOfferActions';

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
  created_by_admin: boolean;
}

interface CommunityOffersTableProps {
  offers: Offer[];
  onOffersChange: () => void;
}

const CommunityOffersTable = ({ offers, onOffersChange }: CommunityOffersTableProps) => {
  const { approveOffer, rejectOffer } = useCommunityOfferActions(onOffersChange);

  // Filter only community offers (created_by_admin = false)
  const communityOffers = offers.filter(offer => !offer.created_by_admin);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Offres proposées par la communauté</span>
          <span className="text-sm font-normal text-gray-500">
            {communityOffers.length} proposition(s) en attente
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {communityOffers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune proposition de produit en attente
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <OfferTableHeader />
              <TableBody>
                {communityOffers.map((offer) => (
                  <CommunityOfferTableRow
                    key={offer.id}
                    offer={offer}
                    onApprove={approveOffer}
                    onReject={rejectOffer}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityOffersTable;
