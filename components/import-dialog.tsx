"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { DEPARTMENTS } from "@/lib/constants";

interface ImportedParticipant {
  fullName: string;
  department: string;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (participants: ImportedParticipant[]) => Promise<void>;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [importedData, setImportedData] = useState<ImportedParticipant[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    // Create sample data with valid departments
    const templateData = [
      {
        "Full Name": "John Doe",
        Department: "Engineering (PKW)",
      },
      {
        "Full Name": "Jane Smith",
        Department: "HR",
      },
      {
        "Full Name": "Bob Johnson",
        Department: "Sales (PKW)",
      },
      {
        "Full Name": "Alice Williams",
        Department: "IT",
      },
      {
        "Full Name": "Charlie Brown",
        Department: "Field Service (PKF)",
      },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    ws["!cols"] = [
      { wch: 25 }, // Full Name
      { wch: 35 }, // Department (wider for longer names)
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    // Download
    XLSX.writeFile(wb, "participant-template.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Validate and transform data
        const validationErrors: string[] = [];
        const participants: ImportedParticipant[] = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2; // +2 because Excel is 1-indexed and has header row

          // Check required columns
          if (!row["Full Name"] && !row["fullName"]) {
            validationErrors.push(`Row ${rowNum}: Missing "Full Name" column`);
            return;
          }
          if (!row["Department"] && !row["department"]) {
            validationErrors.push(`Row ${rowNum}: Missing "Department" column`);
            return;
          }

          const fullName = (row["Full Name"] || row["fullName"] || "")
            .toString()
            .trim();
          const department = (row["Department"] || row["department"] || "")
            .toString()
            .trim();

          // Validate data
          if (!fullName) {
            validationErrors.push(`Row ${rowNum}: Full name is empty`);
            return;
          }
          if (!department) {
            validationErrors.push(`Row ${rowNum}: Department is empty`);
            return;
          }

          // Validate department is one of the allowed values
          if (!DEPARTMENTS.includes(department as any)) {
            validationErrors.push(
              `Row ${rowNum}: Invalid department "${department}". Must be one of: ${DEPARTMENTS.join(", ")}`,
            );
            return;
          }

          participants.push({ fullName, department });
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setImportedData([]);
        } else {
          setErrors([]);
          setImportedData(participants);
        }
      } catch (error) {
        setErrors([
          `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
        ]);
        setImportedData([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await onImport(importedData);
      setImportedData([]);
      setErrors([]);
      onOpenChange(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Import failed"]);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    setImportedData([]);
    setErrors([]);
    onOpenChange(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Participants from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx) with participant data. Download the
            template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Valid departments info */}
          <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Valid Departments:
            </p>
            <p className="text-xs text-blue-700">{DEPARTMENTS.join(", ")}</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {errors.length > 0 && (
            <div className="rounded-md bg-destructive/15 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Validation Errors:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {importedData.length > 0 && (
            <div className="rounded-md bg-green-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>{importedData.length} participants ready to import</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <ul className="text-sm text-green-800 space-y-1">
                  {importedData.slice(0, 10).map((p, index) => (
                    <li key={index}>
                      {p.fullName} ({p.department})
                    </li>
                  ))}
                  {importedData.length > 10 && (
                    <li className="font-semibold">
                      ... and {importedData.length - 10} more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={importedData.length === 0 || isImporting}
          >
            {isImporting
              ? "Importing..."
              : `Import ${importedData.length} Participants`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
