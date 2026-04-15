import { useState } from 'react';
import { getInitials } from '../../utils/helpers';
import type { PotionOrder, AlchemistProfileMinimal } from '../../types';
import styles from './ReassignModal.module.css';

interface ReassignModalProps {
  selectedOrder: PotionOrder | null;
  availableAlchemists: string[];
  alchemistProfiles: Map<string, AlchemistProfileMinimal>;
  onClose: () => void;
  onReassign: (newAlchemist: string) => Promise<void>;
}

export function ReassignModal({ selectedOrder, availableAlchemists, alchemistProfiles, onClose, onReassign }: ReassignModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReassign = async (newAlchemist: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onReassign(newAlchemist);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reassign potion order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedOrder) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${styles.modalHeader}`}>
          <h3 className={styles.modalTitle}>Reassign Potion Order</h3>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>&times;</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div>
          <div className={styles.orderInfo}>
            <div className={styles.orderInfoLabel}>
              Select a new alchemist to work on:
            </div>
            <div className={styles.orderInfoPotion}>
              {selectedOrder.potion}
            </div>
            <div className={styles.orderInfoCustomer}>
              for {selectedOrder.customer_name}
            </div>
          </div>

          <div className={styles.alchemistList}>
            {availableAlchemists.map(a => {
              const profile = alchemistProfiles.get(a);
              const isCurrent = a === selectedOrder.assigned_alchemist;

              return (
                <button
                  key={a}
                  className={`button ${isCurrent ? 'button-primary' : 'button-secondary'} ${styles.alchemistButton}`}
                  onClick={() => handleReassign(a)}
                  disabled={isSubmitting}
                >
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={a}
                      className={`${styles.avatarImage} ${isCurrent ? styles.current : ''}`}
                    />
                  ) : (
                    <div className={`${styles.avatarInitials} ${isCurrent ? styles.current : ''}`}>
                      {getInitials(a)}
                    </div>
                  )}
                  <span className={styles.alchemistName}>
                    {a}
                  </span>
                  {isCurrent && (
                    <span className={styles.currentBadge}>
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
