import type { StaticImageData } from 'next/image';
import Image from 'next/image'
import type { CSSProperties } from 'react';

type ImageWithoutFill = {
  src: string | StaticImageData
  width: `${number}` | number
  height: `${number}` | number
  alt: string
  fill?: false
  priority?: boolean
  className?: string
  style?: CSSProperties
  placeholder: string
}

type ImageWithFill = Omit<ImageWithoutFill, 'width' | 'height' | 'fill'> & { fill: true }

const Image = (
  args
: (ImageWithFill | ImageWithoutFill)) => {
  const { src, alt, priority, style, className, fill } = args
  if (args.fill) {
    return <Image
      className={className}
      src={src}
      fill={fill}
      alt={alt}
      placeholder={'empty'}
      priority={priority}
      style={style}
    />
  } else {
    const { width, height } = args
    return <Image
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
      placeholder={'empty'}
      priority={priority}
      style={style}
    />
  }
}

export default MoonImage
