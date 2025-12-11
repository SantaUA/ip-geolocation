import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useIPLookupStore } from '../../contexts';
import { IPEntryRow } from './IPEntryRow';
import styles from './IPLookup.module.css';

export interface IPLookupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IPLookup = ({
  isOpen,
  onClose
}: IPLookupProps) => {
  const store = useIPLookupStore();

  const entriesArray = useSyncExternalStore(
    (callback) => store.subscribeToAll(callback),
    () => store.getAllEntries(),
    () => store.getAllEntries()
  );

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>IP Lookup</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.description}>
            <p className={styles.subtitle}>
              Enter one or more IP(IPv4/IPv6) addresses and get their country
            </p>

            <div className={styles.actions}>
              <button className={styles.addButton} onClick={() => store.addEntry()}>
                <span>+</span>
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className={styles.entriesList}>
            {entriesArray.map((entry, index) => (
              <IPEntryRow
                key={entry.id}
                id={entry.id}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

