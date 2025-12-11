import { useTimezoneClock } from '../../hooks';
import styles from './TimezoneClock.module.css';

interface TimezoneClockProps {
  timezone: string;
}

export const TimezoneClock = ({ timezone }: TimezoneClockProps) => {
  const time = useTimezoneClock(timezone);

  return <span className={styles.clock} title={timezone}>{time}</span>;
};
