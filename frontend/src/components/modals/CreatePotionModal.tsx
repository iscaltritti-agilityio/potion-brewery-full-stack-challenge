import { useState } from 'react';
import type { PotionOrderInput } from '../../types';
import styles from './CreatePotionModal.module.css';

interface CreatePotionModalProps {
  alchemistName: string;
  availableAlchemists: string[];
  onClose: () => void;
  onSubmit: (input: PotionOrderInput) => Promise<void>;
}

export function CreatePotionModal({ alchemistName, availableAlchemists, onClose, onSubmit }: CreatePotionModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    potion: '',
    assigned_alchemist: alchemistName,
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        customer_name: formData.customer_name,
        location: formData.location,
        potion: formData.potion,
        assigned_alchemist: formData.assigned_alchemist,
        notes: formData.notes
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create potion order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Potion Order</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer Name:</label>
            <input
              type="text"
              className="form-input"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location:</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Potion:</label>
            <input
              type="text"
              className="form-input"
              value={formData.potion}
              onChange={(e) => setFormData({ ...formData, potion: e.target.value })}
              placeholder="e.g., Moonlight Healing Draught"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assigned Alchemist:</label>
            <select
              className="form-input"
              value={formData.assigned_alchemist}
              onChange={(e) => setFormData({ ...formData, assigned_alchemist: e.target.value })}
              required
              disabled={isSubmitting}
            >
              {availableAlchemists.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes:</label>
            <textarea
              className={`form-input ${styles.textareaField}`}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
