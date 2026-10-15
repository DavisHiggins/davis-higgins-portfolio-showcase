import type { ImageAsset } from '../lib/types'

/**
 * A responsive <picture> with AVIF and WebP derivatives, explicit dimensions to
 * prevent layout shift, and a focal point for cropped frames. `sizes` must match
 * the rendered width so small cards never download large files.
 */
export function ResponsiveImage({
  image,
  sizes,
  priority = false,
  decorative = false,
  className = '',
  fit = 'cover',
}: {
  image: ImageAsset
  sizes: string
  priority?: boolean
  decorative?: boolean
  className?: string
  fit?: 'cover' | 'contain'
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={image.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={decorative ? '' : image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // React 18 does not know fetchPriority; pass it through as a DOM attribute.
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        className={className}
        style={{ objectFit: fit, objectPosition: image.position }}
      />
    </picture>
  )
}
