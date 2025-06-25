
import { Edit, Trash2, TrendingUp } from 'lucide-react';
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

interface OfferTableRowProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  onProgressUpdate: (offer: Offer) => void;
}

const OfferTableRow = ({ offer, onEdit, onDelete, onProgressUpdate }: OfferTableRowProps) => {
  const progressPercentage = (offer.current_participants / offer.target_participants) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onProgressUpdate(offer)}
              className="h-8 w-8 p-0"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
          {offer.status}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(offer.deadline)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(offer)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l'offre</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(offer.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OfferTableRow;
