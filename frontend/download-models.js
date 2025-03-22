const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, 'public', 'models');
const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(modelsDir)){
    fs.mkdirSync(modelsDir, { recursive: true });
}

// Télécharger chaque fichier
modelFiles.forEach(file => {
  const url = `https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/${file}`;
  const filePath = path.join(modelsDir, file);
  
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Téléchargé: ${file}`);
    });
  }).on('error', (err) => {
    console.error(`Erreur lors du téléchargement de ${file}:`, err);
  });
});