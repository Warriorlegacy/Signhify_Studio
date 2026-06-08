#!/usr/bin/env python3
"""Render the Local IDE Development Guide Markdown to PDF.

Invoked by scripts/build-guide-pdf.mjs. Keeps the layout simple and
legible: headings, paragraphs, bullet lists, tables, code blocks.
"""
import sys
import re
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Preformatted,
    Table,
    TableStyle,
    PageBreak,
)


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def inline(s: str) -> str:
    s = esc(s)
    s = re.sub(r"`([^`]+)`", r'<font face="Courier" color="#b03060">\1</font>', s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<link href="\2" color="#1e6fff">\1</link>', s)
    return s


def build(md_path: Path, pdf_path: Path) -> None:
    text = md_path.read_text(encoding="utf-8")
    styles = getSampleStyleSheet()
    body = ParagraphStyle("body", parent=styles["BodyText"], fontSize=10, leading=14, spaceAfter=6)
    h1 = ParagraphStyle("h1", parent=styles["Heading1"], fontSize=20, leading=24, spaceBefore=12, spaceAfter=8, textColor=colors.HexColor("#0b1020"))
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], fontSize=15, leading=19, spaceBefore=14, spaceAfter=6, textColor=colors.HexColor("#1e2a47"))
    h3 = ParagraphStyle("h3", parent=styles["Heading3"], fontSize=12, leading=16, spaceBefore=10, spaceAfter=4, textColor=colors.HexColor("#3a4a78"))
    quote = ParagraphStyle("quote", parent=body, leftIndent=12, textColor=colors.HexColor("#555"), borderPadding=4)
    code_style = ParagraphStyle("code", parent=styles["Code"], fontName="Courier", fontSize=8.5, leading=11, backColor=colors.HexColor("#f4f5f9"), borderPadding=6, leftIndent=6)
    bullet = ParagraphStyle("bullet", parent=body, leftIndent=18, bulletIndent=6)

    story = []
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            story.append(Preformatted("\n".join(buf), code_style))
            story.append(Spacer(1, 4))
            continue
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:-]+\|", lines[i + 1]):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                row = lines[i]
                i += 1
                if re.match(r"^\|[\s:-]+\|", row):
                    continue
                cells = [c.strip() for c in row.strip().strip("|").split("|")]
                rows.append([Paragraph(inline(c), body) for c in cells])
            if rows:
                tbl = Table(rows, hAlign="LEFT", colWidths=[1.7 * inch] * len(rows[0]) if len(rows[0]) <= 3 else None)
                tbl.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef0f7")),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cccccc")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ]))
                story.append(tbl)
                story.append(Spacer(1, 6))
            continue
        if line.startswith("# "):
            story.append(Paragraph(inline(line[2:]), h1))
        elif line.startswith("## "):
            story.append(Paragraph(inline(line[3:]), h2))
        elif line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), h3))
        elif line.startswith("> "):
            story.append(Paragraph(inline(line[2:]), quote))
        elif re.match(r"^\s*[-*]\s+", line):
            content = re.sub(r"^\s*[-*]\s+", "", line)
            story.append(Paragraph("• " + inline(content), bullet))
        elif re.match(r"^\s*\d+\.\s+", line):
            content = re.sub(r"^\s*\d+\.\s+", "", line)
            story.append(Paragraph(inline(content), bullet))
        elif line.strip() == "---":
            story.append(Spacer(1, 8))
        elif line.strip() == "":
            story.append(Spacer(1, 4))
        else:
            story.append(Paragraph(inline(line), body))
        i += 1

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=LETTER,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
        title="Signhify — Local IDE Development Guide",
        author="Signhify",
    )
    doc.build(story)


if __name__ == "__main__":
    md = Path(sys.argv[1])
    pdf = Path(sys.argv[2])
    build(md, pdf)
    print(f"wrote {pdf}")
