import path from 'path';
import * as fs from 'fs';

export const isAcceptedImageFile = (file_extension) => {
    const allowedTypes = ['.png', '.jpeg', '.jpg', '.JPG', '.PNG', '.JPEG'];
    return allowedTypes.includes(file_extension);
}

export const uploadImage = async (image, dir, filename) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    var filepath = path.join(dir, filename);
    return new Promise((resolve, reject) => {
        image.mv(filepath, err => {
            if (err) reject("Could not save file");
            else resolve()
        });
    });
}