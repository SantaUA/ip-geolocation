import { useState, useEffect } from 'react';
import { formatTimezoneTime } from '../utils';

export const useTimezoneClock = (timezone: string): string => {
  const [time, setTime] = useState<string>(() => formatTimezoneTime(timezone));

  useEffect(() => {
    const updateTime = () => setTime(formatTimezoneTime(timezone));

    updateTime();

    const now = Date.now();
    const msUntilNextSecond = 1000 - (now % 1000);

    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      updateTime();
      intervalId = setInterval(updateTime, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [timezone]);

  return time;
};

