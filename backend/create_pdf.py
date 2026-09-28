from reportlab.pdfgen import canvas

c = canvas.Canvas("test_contract.pdf")
c.drawString(100, 750, "This is a test contract.")
c.drawString(100, 730, "Section 1: Confidentiality")
c.drawString(100, 710, "The quick brown fox jumps over the lazy dog.")
c.save()
