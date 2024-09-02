"use client";
import React, { useState } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { cn } from "@/app/lib/utils";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { GeneratePdf } from "./GeneratePdf";

// Define the type for individual items
type Item = {
  description: string;
  unitPrice: string;
};

// Define the type for the invoice data
type InvoiceData = {
  invoice: string;
  companyName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  accountTitle: string;
  bankName: string;
  bankAccount: string;
  items: Item[];
};

export function CreateInvoice() {
  const [items, setItems] = useState<Item[]>([{ description: "", unitPrice: "" }]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newItems = [...items];
    newItems[index][e.target.name as keyof Item] = e.target.value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", unitPrice: "" }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleGenerateInvoice = async () => {
    // Gather input values
    const data: InvoiceData = {
      invoice: (document.getElementById("invoice") as HTMLInputElement).value,
      companyName: (document.getElementById("companyName") as HTMLInputElement).value,
      clientName: (document.getElementById("firstname") as HTMLInputElement).value,
      clientPhone: (document.getElementById("number") as HTMLInputElement).value,
      clientEmail: (document.getElementById("email") as HTMLInputElement).value,
      issueDate: (document.getElementById("issuedate") as HTMLInputElement).value,
      dueDate: (document.getElementById("duedate") as HTMLInputElement).value,
      accountTitle: (document.getElementById("accountTitle") as HTMLInputElement).value,
      bankName: (document.getElementById("bankName") as HTMLInputElement).value,
      bankAccount: (document.getElementById("bankAccount") as HTMLInputElement).value,
      items: items,
    };

    // Log data object to check if values are correctly captured
    console.log("Generated Data Object:", data);

    try {
      const docRef = await addDoc(collection(db, "invoices"), data);
      console.log("Document written with ID: ", docRef.id);
      
      // Generate PDF after data is submitted
      GeneratePdf(data);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-white shadow-md rounded-lg p-6 space-y-6 border border-gray-700 bg-white">
        <h2 className="text-2xl text-black font-semibold text-center">Create Invoice</h2>

        <div className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="invoice">Invoice Number</Label>
            <Input id="invoice" name="invoice" placeholder="0001" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" placeholder="Your Company" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="firstname">Client's Name</Label>
            <Input id="firstname" name="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="number">Your Phone Number</Label>
            <Input id="number" name="number" placeholder="0123456789" type="tel" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="accountTitle">Account Title</Label>
            <Input id="accountTitle" name="accountTitle" placeholder="Your Account Title" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" name="bankName" placeholder="Your Bank Name" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="bankAccount">Bank Account</Label>
            <Input id="bankAccount" name="bankAccount" placeholder="Your Bank Account" type="text" />
          </LabelInputContainer>
          <div className="flex space-x-4">
            <LabelInputContainer>
              <Label htmlFor="issuedate">Invoice Issue Date</Label>
              <Input id="issuedate" name="issuedate" type="date" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="duedate">Invoice Due Date</Label>
              <Input id="duedate" name="duedate" type="date" />
            </LabelInputContainer>
          </div>

          <h3 className="text-lg text-black font-medium">Items/Services</h3>

          {items.map((item, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <LabelInputContainer className="flex-1">
                <Label htmlFor={`itemDescription-${index}`}>Description</Label>
                <Input
                  id={`itemDescription-${index}`}
                  name="description"
                  placeholder="Consulting Services"
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </LabelInputContainer>
              <LabelInputContainer className="flex-1">
                <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                <Input
                  id={`unitPrice-${index}`}
                  name="unitPrice"
                  placeholder="100"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </LabelInputContainer>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 focus:outline-none"
          >
            Add Item/Service
          </button>

          <button
            type="button"
            onClick={handleGenerateInvoice}
            className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none mt-4"
          >
            Generate Invoice
          </button>
          {successMessage && (
            <div className="text-green-600 text-center mb-4">{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
