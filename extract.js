import fs from 'fs';
import pdfParse from 'pdf-parse';

const filePath = 'D:/Downloads/printwork-web-main (2)/printwork-web-main/printwork-web-main/pdf/Company Profile PT  Printwork.pdf';

try {
  const dataBuffer = fs.readFileSync(filePath);
  pdfParse(dataBuffer).then(function(data) {
      console.log(data.text);
  });
} catch (error) {
  console.error('Failed to parse PDF:', error);
}
