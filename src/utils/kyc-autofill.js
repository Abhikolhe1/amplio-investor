import axiosInstance from 'src/utils/axios';

const DEFAULT_ASSET_PATH = '/assets/background/overlay_2.jpg';

export async function uploadAutofillAsset({
  fileName,
  assetPath = DEFAULT_ASSET_PATH,
  fallbackType = 'image/jpeg',
}) {
  const response = await fetch(assetPath);

  if (!response.ok) {
    throw new Error(`Unable to load autofill asset: ${assetPath}`);
  }

  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type || fallbackType });
  const formData = new FormData();
  formData.append('file', file);

  const uploadRes = await axiosInstance.post('/files', formData);
  return uploadRes?.data?.files?.[0] || null;
}

export async function uploadAutofillAssets(entries) {
  return Promise.all(
    entries.map(async (entry) => {
      try {
        const file = await uploadAutofillAsset(entry);
        return { ...entry, file };
      } catch (error) {
        return { ...entry, file: null };
      }
    })
  );
}
