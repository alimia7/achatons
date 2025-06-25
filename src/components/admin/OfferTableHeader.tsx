
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const OfferTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Produit</TableHead>
        <TableHead>Catégorie</TableHead>
        <TableHead>Prix</TableHead>
        <TableHead>Progression</TableHead>
        <TableHead>Date limite</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OfferTableHeader;
