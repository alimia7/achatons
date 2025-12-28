import React from 'react';
import { Trophy, Zap, Clock, PartyPopper } from 'lucide-react';
import type { PricingTier } from '../../types/pricing';

interface NudgeMessageProps {
  currentQuantity: number;
  currentTier: number;
  nextTier: PricingTier | null;
  currentPrice: number;
  deadline: string;
  compact?: boolean;
}

type MessageType = 'success' | 'celebration' | 'urgent' | 'motivating';

interface NudgeData {
  type: MessageType;
  message: string;
  icon: React.ElementType;
}

export function NudgeMessage({
  currentQuantity,
  currentTier,
  nextTier,
  currentPrice,
  deadline,
  compact = false
}: NudgeMessageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const calculateDaysLeft = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const generateNudge = (): NudgeData => {
    const daysLeft = calculateDaysLeft(deadline);

    // Si palier final atteint
    if (!nextTier) {
      return {
        type: 'success',
        message: `Objectif final atteint ! Prix final : ${formatPrice(currentPrice)}`,
        icon: Trophy
      };
    }

    // Urgence temporelle
    if (daysLeft <= 2) {
      const remaining = nextTier.min_participants - currentQuantity;
      return {
        type: 'urgent',
        message: daysLeft === 0
          ? `Dernier jour ! Encore ${remaining} unités pour débloquer ${formatPrice(nextTier.price)}`
          : `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} ! Commandez plus pour payer moins cher`,
        icon: Clock
      };
    }

    // Message motivant par défaut
    const remaining = nextTier.min_participants - currentQuantity;
    const savings = currentPrice - nextTier.price;

    if (remaining === 1) {
      return {
        type: 'celebration',
        message: `Plus qu'1 unité pour débloquer ${formatPrice(nextTier.price)} !`,
        icon: PartyPopper
      };
    }

    if (remaining <= 5) {
      return {
        type: 'motivating',
        message: `Encore ${remaining} unités et tout le monde économise ${formatPrice(savings)} !`,
        icon: Zap
      };
    }

    return {
      type: 'motivating',
      message: `Plus que ${remaining} unités pour débloquer ${formatPrice(nextTier.price)} !`,
      icon: Zap
    };
  };

  const nudge = generateNudge();
  const Icon = nudge.icon;

  const getColorClasses = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'celebration':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'urgent':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'motivating':
      default:
        return 'bg-orange-50 border-achatons-orange text-achatons-brown';
    }
  };

  const getIconColorClass = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'celebration':
        return 'text-yellow-600';
      case 'urgent':
        return 'text-red-600';
      case 'motivating':
      default:
        return 'text-achatons-orange';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColorClasses(nudge.type)}`}>
        <Icon className={`h-4 w-4 flex-shrink-0 ${getIconColorClass(nudge.type)}`} />
        <p className="text-xs font-medium">{nudge.message}</p>
      </div>
    );
  }

  return (
    <div className={`relative p-4 rounded-xl border-2 ${getColorClasses(nudge.type)} ${
      nudge.type === 'urgent' ? 'animate-pulse' : ''
    }`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${
          nudge.type === 'celebration' ? 'animate-bounce' : ''
        }`}>
          <Icon className={`h-6 w-6 ${getIconColorClass(nudge.type)}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-relaxed">
            {nudge.message}
          </p>
        </div>
      </div>
    </div>
  );
}
