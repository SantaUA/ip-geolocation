export const formatTimezoneTime = (timezone: string): string => {
  try {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formatter.format(now);
  } catch (error) {
    console.error('Error formatting timezone:', error);
    return 'Invalid timezone';
  }
};
