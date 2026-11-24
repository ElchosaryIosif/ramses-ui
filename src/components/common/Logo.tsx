import logo64 from '../../assets/logo-64.webp';
import logo128 from '../../assets/logo-128.webp';
import logo256 from '../../assets/logo-256.webp';

interface Props {
  /** Displayed width and height in CSS pixels; the browser picks the smallest file that is sharp. */
  size: number;
  className?: string;
  lazy?: boolean;
}

/** The shop logo as content-hashed WebP files, so they are small and cached for a year. */
export const Logo = ({ size, className, lazy }: Props) => (
  <img
    className={className}
    src={logo128}
    srcSet={`${logo64} 64w, ${logo128} 128w, ${logo256} 256w`}
    sizes={`${size}px`}
    width={size}
    height={size}
    alt="Ramses Bazaar"
    loading={lazy ? 'lazy' : undefined}
    decoding="async"
  />
);
