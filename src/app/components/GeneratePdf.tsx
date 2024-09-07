import jsPDF from "jspdf";
import "jspdf-autotable";

export const GeneratePdf = (data: any, imageFile: File | null) => {
  const doc = new jsPDF();

  // Page width
  const pageWidth = doc.internal.pageSize.getWidth();

  // Define subtle colors for headers and lines
  const headerColor = [22, 160, 133];
  const lineColor = [200, 200, 200];
  const textColor = [50, 50, 50];

  // Define dimensions for the logo
  const logoWidth = 15;
  const logoHeight = 10;
  const logoX = pageWidth - 25; // Right-align the logo
  const logoY = 12;

  // Add the title "Invoice" on the left with larger, bold font
  doc.setFontSize(24);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 10, 20);

  // Company name and phone number on the right with a smaller, subtle font
  const companyNameX = pageWidth - 60; // Right-aligned company name
  const companyNameY = 20; // Align with the logo height

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.companyName || "N/A", companyNameX, companyNameY);

  // Phone number beneath the company name
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const phoneNumberY = companyNameY + 10; // Slightly lower than the company name
  doc.text(`Phone: ${data.clientPhone || "N/A"}`, companyNameX, phoneNumberY);

  // Draw a subtle line below the header section
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Invoice details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Number: ${data.invoice || "N/A"}`, 10, 50);
  doc.text(`Client Name: ${data.clientName || "N/A"}`, 10, 60);
  doc.text(`Issue Date: ${data.issueDate || "N/A"}`, pageWidth - 20, 50, { align: "right" });
  doc.text(`Due Date: ${data.dueDate || "N/A"}`, pageWidth - 20, 60, { align: "right" });

  // Draw another subtle line below the invoice details
  doc.setLineWidth(0.5);
  doc.line(10, 70, 200, 70);

  // Table for Service Items with subtle colors
  const tableColumn = ["Item Number", "Description", "Unit Price"];
  const tableRows = data.items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.description || "N/A",
    `${data.currency || "$"}${item.unitPrice || "0.00"}`,  // Use selected currency symbol
  ]);

  const total = data.items.reduce(
    (sum: number, item: any) => sum + parseFloat(item.unitPrice || "0"),
    0
  );

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: "grid",
    headStyles: { fillColor: headerColor, textColor: 255 },
    styles: { fontSize: 10, textColor: textColor },
    margin: { top: 10 },
    didDrawPage: (data: any) => {
      const finalY = data.cursor.y;

      // Add Total at the bottom of the table, right-aligned with currency symbol
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${data.currency || "$"}${total.toFixed(2)}`, pageWidth - 10, finalY + 10, { align: "right" });

      // Draw a subtle line below the total
      doc.setLineWidth(0.5);
      doc.setTextColor(lineColor[0], lineColor[1], lineColor[2]);
      doc.line(10, finalY + 15, 200, finalY + 15);

      // Draw a table for Bank Information
      const bankInfoColumn = ["Account Title", "Bank Name", "Bank Account"];
      const bankInfoRows = [
        [data.accountTitle || "N/A", data.bankName || "N/A", data.bankAccount || "N/A"]
      ];

      (doc as any).autoTable({
        head: [bankInfoColumn],
        body: bankInfoRows,
        startY: finalY + 25,
        theme: "grid",
        headStyles: { fillColor: headerColor, textColor: 255 },
        styles: { fontSize: 10, textColor: textColor },
        margin: { top: 10 },
      });
    },
  });

  // Add footnotes at the bottom of the page with subtle text color
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20; // Adjust margin as needed
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Note: ${data.footnotes || "No additional information provided."}`, 10, pageHeight - marginBottom);

  // Add the logo after rendering everything else
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      doc.addImage(e.target.result, "PNG", logoX, logoY, logoWidth, logoHeight);
      doc.save("invoice.pdf");
    };
    reader.readAsDataURL(imageFile);
  } else {
    doc.save("invoice.pdf");
  }
};
