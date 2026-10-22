import React from 'react';
import { Image } from 'expo-image';

export default function CachedImage({ source, style, resizeMode }) {
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <Image
      source={imageSource}
      style={style}
      contentFit={resizeMode || 'cover'}
      cachePolicy="memory-disk"
      transition={200}
    />
  );
}