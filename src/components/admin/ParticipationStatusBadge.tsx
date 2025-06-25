
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';

interface ParticipationStatusBadgeProps {
  status: string;
}

const ParticipationStatusBadge = ({ status }: ParticipationStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
    case 'validated':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" />Validée</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default ParticipationStatusBadge;
