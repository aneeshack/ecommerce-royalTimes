// imageUtils.js
const sharp = require('sharp');
const path = require('path');

const cropImage = async (filePath, width, height) => {
  const newFilePath = `cropped_${Date.now()}_${path.basename(filePath)}`;
  await sharp(filePath)
    .resize(width, height)
    .toFile(newFilePath);
  return newFilePath;
};

module.exports = { cropImage };
