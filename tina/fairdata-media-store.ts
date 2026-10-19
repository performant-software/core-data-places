import { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from 'tinacms';
import MediaContentsService from '@backend/api/coreData/mediaContents';

export class CustomFairDataStore implements MediaStore {
  accept = 'image/*';

  isStatic = true;

  async list(options: MediaListOptions = {}): Promise<MediaList> {
    try {
      const response = await MediaContentsService.fetchAll({ per_page: 0 });
      const rawData = response.media_contents;

      const items: Media[] = rawData.map((item: any) => {
        // the returned URLs have no file extension (e.g. ".../content"), so Tina's isImage()
        // extension check fails and falls back to a placeholder/link in a bunch of places.
        // A "#.jpg" fragment satisfies the check without altering the actual request the browser sends 
        // (fragments aren't sent to the server), although it definitely feels very hacky
        const url = item.content_url ? `${item.content_url}#.jpg` : undefined;
        const previewUrl = item.content_preview_url ? `${item.content_preview_url}#.jpg` : undefined;
        return {
          id: item.content_url,
          type: 'file',
          directory: '',
          filename: item.name,
          src: url,
          thumbnails: {
            '75x75': previewUrl,
            '400x400': previewUrl,
            '1000x1000': previewUrl,
          },
        };
      }).sort((a: Media, b: Media) => (a.filename.toLowerCase() > b.filename.toLowerCase() ? 1 : -1));

      return { items };
    } catch (error) {
      console.error("Failed to fetch direct external media:", error);
      return { items: [] };
    }
  }

  previewSrc(src: string): string { return src; }
  async persist(files: MediaUploadOptions[]): Promise<Media[]> { return []; }
  async delete(media: Media): Promise<void> { return; }
}
