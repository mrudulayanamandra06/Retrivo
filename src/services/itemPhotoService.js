// Local image persistence for the browser-based version.
// Images are stored as data URLs in localStorage with the item record.
const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB keeps browser storage usage manageable.

export async function uploadItemPhoto(file) {
  if (!file) return null;
  if (!file.type?.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('For this browser-based version, images must be 1 MB or smaller.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export async function resolveItemPhoto(path) {
  return path || '';
}

export async function resolveItemPhotos(items = []) {
  return items;
}
