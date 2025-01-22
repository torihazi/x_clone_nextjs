const IMAGE_EXTENSION = ["image/png", "image/jpeg"];

export const calculateTotalSize = (files: File[]): number => {
  return files.reduce((acc, file) => acc + file.size, 0);
};

export const bytesToMB = (
  sizeInBytes: number,
  decimalsNum: number = 2,
): number => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const validateImageExtension = (files: File[]): boolean => {
  return files.every((file) => IMAGE_EXTENSION.includes(file.type));
};
