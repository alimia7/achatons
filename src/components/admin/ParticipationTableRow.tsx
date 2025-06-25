
import { TableCell, TableRow } from '@/components/ui/table';
import ParticipationStatusBadge from './ParticipationStatusBadge';
import ParticipationActions from './ParticipationActions';

interface Participation {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  quantity: number;
  status: string;
  created_at: string;
  offers: {
    name: string;
  };
}

interface ParticipationTableRowProps {
  participation: Participation;
  isUpdating: boolean;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
}

const ParticipationTableRow = ({ 
  participation, 
  isUpdating, 
  onValidate, 
  onCancel 
}: ParticipationTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{participation.user_name}</TableCell>
      <TableCell>{participation.user_phone}</TableCell>
      <TableCell>{participation.user_email || 'N/A'}</TableCell>
      <TableCell>{participation.offers?.name}</TableCell>
      <TableCell>{participation.quantity}</TableCell>
      <TableCell>
        <ParticipationStatusBadge status={participation.status} />
      </TableCell>
      <TableCell>
        {new Date(participation.created_at).toLocaleDateString('fr-FR')}
      </TableCell>
      <TableCell>
        <ParticipationActions
          participationId={participation.id}
          status={participation.status}
          isUpdating={isUpdating}
          onValidate={onValidate}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
};

export default ParticipationTableRow;
