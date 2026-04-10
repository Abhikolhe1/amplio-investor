import axiosInstance from 'src/utils/axios';

const DEFAULT_ASSET_PATH = '/assets/background/overlay_2.jpg';

const FALLBACK_ASSET_BY_EXTENSION = {
  pdf: '/assets/Platform-Agreement.pdf',
  png: '/assets/transparent.png',
  jpg: DEFAULT_ASSET_PATH,
  jpeg: DEFAULT_ASSET_PATH,
};

function getExtension(fileName = '') {
  return fileName.split('.').pop()?.toLowerCase() || 'jpg';
}

function getAssetPath(fileName, assetPath) {
  if (assetPath) {
    return assetPath;
  }

  return FALLBACK_ASSET_BY_EXTENSION[getExtension(fileName)] || DEFAULT_ASSET_PATH;
}

export async function uploadAutofillAsset({
  fileName,
  assetPath,
  fallbackType = 'image/jpeg',
}) {
  const resolvedAssetPath = getAssetPath(fileName, assetPath);
  let response = await fetch(resolvedAssetPath);

  if (!response.ok && resolvedAssetPath !== DEFAULT_ASSET_PATH) {
    response = await fetch(DEFAULT_ASSET_PATH);
  }

  if (!response.ok) {
    throw new Error(`Unable to load autofill asset for ${fileName}`);
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
