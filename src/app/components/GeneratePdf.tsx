import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const GeneratePdf = (data: any) => {
  console.log("Data received in GeneratePdf:", data);

  const doc = new jsPDF();

  // Title and Company Info
  doc.setFontSize(24);
  doc.text("Invoice", 10, 20);

  doc.setFontSize(18);
  doc.text(data.companyName || "N/A", 190, 20, { align: 'right' });

  // Add Phone Number
  doc.setFontSize(14);
  doc.text(`Phone: ${data.clientPhone || "N/A"}`, 190, 30, { align: 'right' });

  // Draw a line
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Invoice Details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${data.invoice || "N/A"}`, 10, 50);
  doc.text(`Client Name: ${data.clientName || "N/A"}`, 10, 60);
  doc.text(`Issue Date: ${data.issueDate || "N/A"}`, 160, 50, { align: 'right' });
  doc.text(`Due Date: ${data.dueDate || "N/A"}`, 160, 60, { align: 'right' });

  // Draw another line
  doc.setLineWidth(0.5);
  doc.line(10, 70, 200, 70);

  // Table for Items
  const tableColumn = ["Item Number", "Description", "Unit Price"];
  const tableRows = data.items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.description || "N/A",
    `£${item.unitPrice || "0.00"}`,
  ]);

  const total = data.items.reduce((sum: number, item: any) => sum + parseFloat(item.unitPrice || "0"), 0);

  // Capture additional data before passing to autoTable
  const { accountTitle, bankName, bankAccount } = data;

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 10 },
    didDrawPage: (data: any) => {
      const finalY = data.cursor.y;

      // Add Total
      doc.setFontSize(12);
      doc.text(`Total: £${total.toFixed(2)}`, 190, finalY + 10, { align: 'right' });

      // Draw another line
      doc.setLineWidth(0.5);
      doc.line(10, finalY + 15, 200, finalY + 15);

      // Use captured data here
      console.log("Bank Info during PDF generation:", {
        accountTitle,
        bankName,
        bankAccount
      });

      doc.setFontSize(12);
      doc.text(`Account Title: ${accountTitle || "N/A"}`, 10, finalY + 25);
      doc.text(`Bank Name: ${bankName || "N/A"}`, 10, finalY + 35);
      doc.text(`Bank Account: ${bankAccount || "N/A"}`, 10, finalY + 45);
    },
  });

  // Save the PDF
  doc.save("invoice.pdf");
};
