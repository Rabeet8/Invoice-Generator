import jsPDF from "jspdf";
import "jspdf-autotable";

export const GeneratePdf = (data: any, imageFile: File | null) => {
  const doc = new jsPDF();
  
  // Page width
  const pageWidth = doc.internal.pageSize.getWidth();

  // Define colors and dimensions
  const headerColor = [22, 160, 133];
  const lineColor = [200, 200, 200];
  const textColor = [50];
  const logoWidth = 15;
  const logoHeight = 10;
  const logoX = pageWidth - 25;
  const logoY = 12;

  // Add title and header info
  doc.setFontSize(24);
  doc.setTextColor(textColor[0]);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 10, 20);

  const companyNameX = pageWidth - 60;
  const companyNameY = 20;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.companyName || "N/A", companyNameX, companyNameY);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const phoneNumberY = companyNameY + 10;
  doc.text(`Phone: ${data.clientPhone || "N/A"}`, companyNameX, phoneNumberY);

  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Invoice details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Number: ${data.invoice || "N/A"}`, 10, 50);
  doc.text(`Client Name: ${data.clientName || "N/A"}`, 10, 60);
  doc.text(`Issue Date: ${data.issueDate || "N/A"}`, pageWidth - 20, 50, { align: "right" });
  doc.text(`Due Date: ${data.dueDate || "N/A"}`, pageWidth - 20, 60, { align: "right" });

  doc.setLineWidth(0.5);
  doc.line(10, 70, 200, 70);

  // Service Items Table
  const tableColumn = ["Item Number", "Description", "Unit Price"];
  const tableRows = data.items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.description || "N/A",
    `${data.currency || "$"}${item.unitPrice || "0.00"}`,
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
  });

  // Total and Bank Information Table
  const finalY = (doc as any).autoTable.previous.finalY || 75;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${data.currency || "$"}${total.toFixed(2)}`, pageWidth - 10, finalY + 10, { align: "right" });

  doc.setLineWidth(0.5);
  doc.setTextColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.line(10, finalY + 15, 200, finalY + 15);

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

  // Footnotes
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Note: ${data.footnotes || "No additional information provided."}`, 10, pageHeight - marginBottom);

  // Add the logo and save PDF
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
