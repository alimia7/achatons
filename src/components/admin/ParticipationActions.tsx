
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ParticipationActionsProps {
  participationId: string;
  status: string;
  isUpdating: boolean;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
}

const ParticipationActions = ({ 
  participationId, 
  status, 
  isUpdating, 
  onValidate, 
  onCancel 
}: ParticipationActionsProps) => {
  return (
    <div className="flex space-x-2">
      {status === 'pending' && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onValidate(participationId)}
            disabled={isUpdating}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onCancel(participationId)}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      {status === 'validated' && (
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onCancel(participationId)}
          disabled={isUpdating}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ParticipationActions;
