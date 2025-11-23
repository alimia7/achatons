import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useSellerNotifications } from './hooks/useSellerNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const SellerNotifications = () => {
  const { notifications, unreadCount, loading } = useSellerNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (offerId: string) => {
    setIsOpen(false);
    // Navigate to seller dashboard and open offers tab
    navigate('/seller-dashboard', { 
      state: { tab: 'offers', offerId },
      replace: false 
    });
    // Force a small delay to ensure navigation completes
    setTimeout(() => {
      window.location.hash = '';
    }, 100);
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min${diffMins > 1 ? 's' : ''}`;
      if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return 'Récemment';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>
            <span className="text-sm text-gray-500">Chargement...</span>
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-sm text-gray-500">Aucune nouvelle participation</span>
          </DropdownMenuItem>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start py-3 cursor-pointer hover:bg-achatons-cream/50"
                onClick={() => handleNotificationClick(notification.offer_id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-achatons-brown">
                        Offre: {notification.offer_name}
                      </p>
                      {notification.offer_price > 0 && (
                        <span className="text-xs text-achatons-orange font-medium">
                          {notification.offer_price.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">{notification.user_name}</span> a commandé{' '}
                      <span className="font-semibold text-achatons-brown">{notification.quantity}</span> unité{notification.quantity > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0">
                    En attente
                  </Badge>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 10 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center text-sm text-achatons-orange cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/seller-dashboard', { state: { tab: 'offers' } });
                  }}
                >
                  Voir toutes les notifications ({notifications.length})
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SellerNotifications;

