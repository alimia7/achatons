
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

interface CommunityOfferTableRowProps {
  offer: Offer;
  onApprove: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

const CommunityOfferTableRow = ({ offer, onApprove, onReject }: CommunityOfferTableRowProps) => {
  const progressPercentage = (offer.current_participants / offer.target_participants) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'active':
        return <Badge variant="default">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{offer.name}</div>
          <div className="text-sm text-gray-500">{offer.supplier}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {offer.categories?.name || 'Non catégorisé'}
        </Badge>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-semibold text-achatons-orange">
            {formatPrice(offer.group_price)}
          </div>
          <div className="text-sm text-gray-500 line-through">
            {formatPrice(offer.original_price)}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>{offer.current_participants}/{offer.target_participants} {offer.unit_of_measure || 'pièces'}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </TableCell>
      <TableCell>{formatDate(offer.deadline)}</TableCell>
      <TableCell>
        {getStatusBadge(offer.status)}
      </TableCell>
      <TableCell className="text-right">
        {offer.status === 'pending' && (
          <div className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4 mr-1" />
                  Approuver
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approuver l'offre</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir approuver cette offre ? Elle sera alors visible publiquement et disponible pour les achats groupés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onApprove(offer.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approuver
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                  <X className="h-4 w-4 mr-1" />
                  Rejeter
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rejeter l'offre</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir rejeter cette offre ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onReject(offer.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Rejeter
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default CommunityOfferTableRow;
