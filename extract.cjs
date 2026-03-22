const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = 'D:/Downloads/printwork-web-main (2)/printwork-web-main/printwork-web-main/pdf/Company Profile PT  Printwork.pdf';

try {
  let dataBuffer = fs.readFileSync(filePath);
  let parser = typeof pdf === 'function' ? pdf : (pdf.default || pdf.pdf);
  
  if (typeof parser !== 'function') {
      console.log('Parser is not a function:', Object.keys(pdf));
  } else {
      parser(dataBuffer).then(function(data) {
          console.log(data.text);
      });
  }
} catch (error) {
  console.error('Error:', error);
}
