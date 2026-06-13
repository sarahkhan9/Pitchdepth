export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      resolve({ base64, mediaType: 'application/pdf', isBase64: true });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
