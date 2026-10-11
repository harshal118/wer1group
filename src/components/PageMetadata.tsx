import { useEffect } from 'react';

export function PageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://wer1group.in${path}`);
  }, [title, description, path]);
  return null;
}
