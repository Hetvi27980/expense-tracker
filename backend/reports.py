"""
Report generation: PDF, CSV, Excel
"""
from io import BytesIO
from typing import List, Dict
import pandas as pd
from fpdf import FPDF

def generate_pdf_report(transactions: List[Dict], username: str) -> bytes:
    """Generate PDF report from transactions"""
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, f"Expense Report - {username}", ln=True, align="C")
    pdf.ln(4)

    pdf.set_font("Arial", "", 11)
    total = sum(t["amount"] for t in transactions)
    pdf.cell(0, 8, f"Total Transactions Amount: Rs. {total:.2f}", ln=True)
    pdf.ln(4)

    pdf.set_font("Arial", "B", 11)
    pdf.cell(22, 8, "Date", border=1)
    pdf.cell(25, 8, "Type", border=1)
    pdf.cell(30, 8, "Category", border=1)
    pdf.cell(30, 8, "Amount", border=1)
    pdf.cell(83, 8, "Description", border=1, ln=True)

    pdf.set_font("Arial", "", 10)

    for t in transactions:
        kind_label = "Income" if t["kind"] == "income" else "Expense"
        date_str = pd.to_datetime(t["date"]).strftime("%d-%m-%Y") if t.get("date") else "N/A"
        pdf.cell(22, 8, date_str, border=1)
        pdf.cell(25, 8, kind_label[:10], border=1)
        pdf.cell(30, 8, str(t["category"])[:12], border=1)
        pdf.cell(30, 8, f"{t['amount']:.2f}", border=1)
        desc = str(t.get("description", ""))
        if len(desc) > 40:
            desc = desc[:37] + "..."
        pdf.cell(83, 8, desc, border=1, ln=True)

    return bytes(pdf.output(dest="S").encode("latin-1"))

def generate_csv_report(transactions: List[Dict]) -> bytes:
    """Generate CSV report from transactions"""
    if not transactions:
        return b""
    
    df = pd.DataFrame(transactions)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["Type"] = df["kind"].map({"income": "Income", "expense": "Expense"})
    
    csv_df = df[[
        "date", "Type", "category", "amount", "description"
    ]].rename(columns={
        "date": "Date",
        "category": "Category",
        "amount": "Amount",
        "description": "Description",
    })
    
    csv_df["Date"] = csv_df["Date"].dt.strftime("%d-%m-%Y")
    return csv_df.to_csv(index=False).encode("utf-8")

def generate_excel_report(transactions: List[Dict], username: str) -> bytes:
    """Generate Excel report from transactions"""
    if not transactions:
        return b""
    
    df = pd.DataFrame(transactions)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["Type"] = df["kind"].map({"income": "Income", "expense": "Expense"})
    
    excel_df = df[[
        "date", "Type", "category", "amount", "description"
    ]].rename(columns={
        "date": "Date",
        "category": "Category",
        "amount": "Amount",
        "description": "Description",
    })
    
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        excel_df.to_excel(writer, index=False, sheet_name="Transactions")
        ws = writer.sheets["Transactions"]
        
        # Header formatting
        for cell in ws[1]:
            cell.font = cell.font.copy(bold=True)
        
        # Date Column Format
        for cell in ws["A"][1:]:
            cell.number_format = "DD-MM-YYYY"
        
        # Auto column width
        for column in ws.columns:
            max_length = max(
                len(str(cell.value)) if cell.value else 0
                for cell in column
            )
            ws.column_dimensions[column[0].column_letter].width = max_length + 3
        
        # Title
        ws.insert_rows(1)
        ws["A1"] = f"Expense Report - {username}"
        ws["A1"].font = ws["A2"].font.copy(bold=True)
    
    return output.getvalue()
