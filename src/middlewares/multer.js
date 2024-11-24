import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  //   callback(null, TEMP_UPLOAD_DIR); //null кажемо що нема помилки
  // },
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now();
    callback(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });

//file файл який викликаємо
//filename для того щоб перейменуватм імя файлу бо інакше якщо однакові приходять імена то нове зберігажться а стаер видаляється
