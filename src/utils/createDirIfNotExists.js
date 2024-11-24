import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};

//ENOENT - якщо нема такої папки. Тобто в try просто перевіряємо чи є а в catch якщо нема то ств
