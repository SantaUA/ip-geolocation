import { memo, useCallback, useState, useSyncExternalStore } from 'react';
import { useIPLookupStore } from '../../contexts';
import { CountryFlag } from '../CountryFlag';
import { TimezoneClock } from '../TimezoneClock';
import styles from './IPEntryRow.module.css';

interface IPEntryRowProps {
  id: number;
  index: number;
}

export const IPEntryRow = memo(({
  id,
  index,
}: IPEntryRowProps) => {
  const store = useIPLookupStore();

  const entry = useSyncExternalStore(
    (callback) => store.subscribe(id, callback),
    () => store.getEntry(id),
    () => store.getEntry(id)
  );

  const [entryIP, setEntryIP] = useState(entry?.ipAddress || '');

  if (!entry) return null;

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEntryIP(e.target.value);
  }, []);

  const onInputBlur = useCallback(async () => {
    if (entryIP === entry.ipAddress) {
      return;
    }

    store.updateIP(entry.id, entryIP);
    await store.lookupIP(entry.id, entryIP);
  }, [store, entryIP, entry.id, entry.ipAddress]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.circle}>{index + 1}</div>

        <input
          type="text"
          className={styles.input}
          value={entryIP}
          onChange={onInputChange}
          onBlur={onInputBlur}
          disabled={entry.isLoading}
          placeholder="Ex. 85.232.252.1"
        />

        {entry.isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>Loading...</span>
          </div>
        ) : null}

        {!entry.isLoading && entry.data && !entry.error ? (
          <div className={styles.resultContainer}>
            <CountryFlag countryCode={entry.data.country_iso} countryName={entry.data.country} />
            <TimezoneClock timezone={entry.data.time_zone} />
          </div>
        ) : null}
      </div>

      {entry.error ? (
        <div className={styles.errorBlock}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorMessage}>{entry.error}</span>
        </div>
      ) : null}
    </div>
  );
});
