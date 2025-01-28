/**
 * Returns the preview image for the passed list of media contents records.
 *
 * @param mediaContents
 */
export const getPreviewImage = (mediaContents) => {
  return mediaContents
    && mediaContents.length > 0
    && ({ name: mediaContents[0].name, src: mediaContents[0].content_preview_url });
};