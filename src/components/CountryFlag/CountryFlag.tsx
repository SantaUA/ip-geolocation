import styles from './CountryFlag.module.css';

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
}

const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const CountryFlag = ({ countryCode, countryName }: CountryFlagProps) => {
  const flagEmoji = getFlagEmoji(countryCode);

  return (
    <span className={styles.emoji} role="img" aria-label={`${countryCode} flag`} title={countryName}>
      {flagEmoji}
    </span>
  );
};
