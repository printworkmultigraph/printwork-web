import sys
try:
    from PyPDF2 import PdfReader
    
    pdf_path = r"D:\Downloads\printwork-web-main (2)\printwork-web-main\printwork-web-main\pdf\Company Profile PT  Printwork.pdf"
    reader = PdfReader(pdf_path)
    text = ""
    for idx, page in enumerate(reader.pages):
        text += f"\n--- Page {idx + 1} ---\n"
        text += page.extract_text()
    
    print(text)
except Exception as e:
    print("Error:", e)
