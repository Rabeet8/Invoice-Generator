import jsPDF from "jspdf";
import "jspdf-autotable";

export const GeneratePdf = (data: any, imageFile: File | null) => {
  const doc = new jsPDF();

  // Page width
  const pageWidth = doc.internal.pageSize.getWidth();

  // Define dimensions for the logo
  const logoWidth = 15;
  const logoHeight = 10;
  const logoX = pageWidth - 30; // Right-align the logo
  const logoY = 12;

  // Add the title "Invoice" on the left
  doc.setFontSize(24);
  doc.text("Invoice", 10, 20);

  // Company name and phone number to the right
  const companyNameX = pageWidth - 60; // Right-aligned company name
  const companyNameY = 20;  // Align with the logo height

  doc.setFontSize(18);
  doc.text(data.companyName || "N/A", companyNameX, companyNameY);

  // Phone number beneath the company name
  doc.setFontSize(12);
  const phoneNumberY = companyNameY + 10; // Slightly lower than the company name
  doc.text(`Phone: ${data.clientPhone || "N/A"}`, companyNameX, phoneNumberY);

  // Draw a line
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${data.invoice || "N/A"}`, 10, 50);
  doc.text(`Client Name: ${data.clientName || "N/A"}`, 10, 60);
  doc.text(`Issue Date: ${data.issueDate || "N/A"}`, pageWidth - 20, 50, { align: "right" });
  doc.text(`Due Date: ${data.dueDate || "N/A"}`, pageWidth - 20, 60, { align: "right" });

  // Draw another line
  doc.setLineWidth(0.5);
  doc.line(10, 70, 200, 70);

  // Table for Items
  const tableColumn = ["Item Number", "Description", "Unit Price"];
  const tableRows = data.items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.description || "N/A",
    `${item.currency === "£" ? "£" : item.currency}${item.unitPrice || "0.00"}`,
  ]);

  const { accountTitle, bankName, bankAccount } = data;

  const total = data.items.reduce(
    (sum: number, item: any) => sum + parseFloat(item.unitPrice || "0"),
    0
  );

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: "grid",
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 10 },
    didDrawPage: (data: any) => {
      const finalY = data.cursor.y;

      // Add Total
      doc.setFontSize(12);
      doc.text(`Total: ${total.toFixed(2)}`, pageWidth - 10, finalY + 10, { align: "right" });

      // Draw another line
      doc.setLineWidth(0.5);
      doc.line(10, finalY + 15, 200, finalY + 15);

      // Account details
      doc.setFontSize(12);
      doc.text(`Account Title: ${accountTitle || "N/A"}`, 10, finalY + 25);
      doc.text(`Bank Name: ${bankName || "N/A"}`, 10, finalY + 35);
      doc.text(`Bank Account: ${bankAccount || "N/A"}`, 10, finalY + 45);
    },
  });

  // Only add the logo after everything else is rendered, and then save
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      doc.addImage(e.target.result, "PNG", logoX, logoY, logoWidth, logoHeight);
      // Now, save the document
      doc.save("invoice.pdf");
    };
    reader.readAsDataURL(imageFile);
  } else {
    // If no logo is provided, just save it after rendering everything
    doc.save("invoice.pdf");
  }
};
