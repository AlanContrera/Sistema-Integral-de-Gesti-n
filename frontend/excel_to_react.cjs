const ExcelJS = require('exceljs');
const fs = require('fs');

async function run() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('../backend/media/IACI INGENIERO DE IMPLEMENTACION Y PROYECTO RECLUTAMIENTO BUENO edITABLE.xlsx');

    const sheets = {
        'Perfilador': 'PDFPerfilador',
        'Candidato 01': 'PDFEntrevistaInicial',
        'Entrevista Profunda 1': 'PDFEntrevistaProfunda'
    };

    for (const sheetName of Object.keys(sheets)) {
        const componentName = sheets[sheetName];
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) continue;

        let html = '<table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "10px", tableLayout: "fixed" }}>\n<tbody>\n';

        // Calculate column widths (approximate Excel widths to pixels)
        html += '  <colgroup>\n';
        for (let i = 1; i <= sheet.columnCount; i++) {
            const col = sheet.getColumn(i);
            const width = col.width ? (col.width * 7) + 'px' : '50px';
            html += `    <col style={{ width: "${width}" }} />\n`;
        }
        html += '  </colgroup>\n';

        for (let r = 1; r <= sheet.rowCount; r++) {
            const row = sheet.getRow(r);
            html += '  <tr style={{ height: "' + (row.height || 15) + 'px", pageBreakInside: "avoid" }}>\n';
            
            for (let c = 1; c <= sheet.columnCount; c++) {
                const cell = row.getCell(c);
                
                // Check if this cell is merged and not the master
                if (cell.isMerged && cell.master.address !== cell.address) {
                    continue; // Skip rendering this td, it's covered by a colspan/rowspan
                }

                let colSpan = 1;
                let rowSpan = 1;
                
                if (cell.isMerged) {
                    // Calculate colspan and rowspan
                    const merge = sheet._merges[cell.master.address];
                    if (merge) {
                        colSpan = merge.right - merge.left + 1;
                        rowSpan = merge.bottom - merge.top + 1;
                    }
                }

                let style = 'border: "1px solid #D4D4D4", padding: "2px 4px", overflow: "hidden", whiteSpace: "pre-wrap", wordWrap: "break-word"';
                
                if (cell.font) {
                    if (cell.font.bold) style += ', fontWeight: "bold"';
                    if (cell.font.italic) style += ', fontStyle: "italic"';
                    if (cell.font.color && cell.font.color.argb) style += `, color: "#${cell.font.color.argb.substring(2)}"`;
                    if (cell.font.size) style += `, fontSize: "${cell.font.size}pt"`;
                }
                
                if (cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb) {
                    style += `, backgroundColor: "#${cell.fill.fgColor.argb.substring(2)}"`;
                }

                if (cell.alignment) {
                    if (cell.alignment.horizontal) style += `, textAlign: "${cell.alignment.horizontal}"`;
                    if (cell.alignment.vertical) {
                        let va = cell.alignment.vertical;
                        if (va === 'center') va = 'middle';
                        style += `, verticalAlign: "${va}"`;
                    }
                }

                let value = cell.value;
                if (value === null || value === undefined) value = '';
                else if (typeof value === 'object') {
                    if (value.richText) value = value.richText.map(rt => rt.text).join('');
                    else if (value.result !== undefined) value = value.result;
                    else if (value.formula) value = ''; // Ignore raw formulas
                    else value = String(value);
                } else {
                    value = String(value);
                }
                
                // Escape special React characters
                value = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;');
                value = String(value).replace(/\n/g, '<br />');

                html += `    <td ${colSpan > 1 ? `colSpan="${colSpan}"` : ''} ${rowSpan > 1 ? `rowSpan="${rowSpan}"` : ''} style={{ ${style} }}>${value}</td>\n`;
            }
            html += '  </tr>\n';
        }
        
        html += '</tbody>\n</table>';

        const header = `import React from 'react';\n\nconst ${componentName} = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {\n    return (\n        <div ref={ref} className="excel-report-container" style={{ width: '210mm', padding: '10mm', backgroundColor: '#FFF', boxSizing: 'border-box' }}>\n`;
        const footer = `\n        </div>\n    );\n});\nexport default ${componentName};\n`;
        
        fs.writeFileSync(componentName + '_styled.jsx', header + html + footer);
        console.log('Created ' + componentName + '_styled.jsx');
    }
}
run().catch(console.error);
