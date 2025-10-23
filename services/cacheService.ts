
const CACHE_INDEX_KEY = 'videoAnalyzerCacheIndex';
const CACHE_PREFIX = 'videoCache_';
const MAX_CACHE_SIZE_MB = 45; 
const MAX_CACHE_SIZE_BYTES = MAX_CACHE_SIZE_MB * 1024 * 1024;

interface CacheIndex {
  [key: string]: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
  };
}

const getCacheIndex = (): CacheIndex => {
  try {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : {};
  } catch (e) {
    console.error("Fallo al leer el índice del caché:", e);
    return {};
  }
};

const saveCacheIndex = (index: CacheIndex) => {
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.error("Fallo al guardar el índice del caché:", e);
  }
};

const fileToKey = (file: File): string => {
  return `${file.name}_${file.size}_${file.lastModified}`;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const base64ToFile = (dataUrl: string, fileName: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Formato de URL de datos inválido");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}

export const findCachedFile = async (file: File): Promise<File | null> => {
  const key = fileToKey(file);
  const index = getCacheIndex();

  if (index[key]) {
    try {
      const base64Data = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (base64Data) {
        return base64ToFile(base64Data, file.name);
      }
    } catch (e) {
      console.error(`Fallo al cargar el archivo cacheado para la clave ${key}:`, e);
      delete index[key];
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      saveCacheIndex(index);
    }
  }
  return null;
};

export const cacheFile = async (file: File): Promise<void> => {
  if (file.size > MAX_CACHE_SIZE_BYTES) {
    console.warn(`El tamaño del video (${(file.size / 1024 / 1024).toFixed(2)}MB) excede el límite de caché de ${MAX_CACHE_SIZE_MB}MB. Omitiendo caché.`);
    return;
  }
  
  const key = fileToKey(file);
  const index = getCacheIndex();

  try {
    const base64Data = await fileToBase64(file);
    localStorage.setItem(`${CACHE_PREFIX}${key}`, base64Data);
    index[key] = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    saveCacheIndex(index);
    console.log(`Video "${file.name}" guardado en caché correctamente.`);
  } catch (e) {
    console.error(`Fallo al guardar en caché el archivo ${file.name}:`, e);
  }
};
