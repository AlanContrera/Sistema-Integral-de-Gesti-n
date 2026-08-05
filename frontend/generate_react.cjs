const fs = require('fs');
const sheets = ['Perfilador', 'Candidato 01', 'Entrevista Profunda 1'];
sheets.forEach(s => {
    let html = fs.readFileSync(s + '.html', 'utf8');
    html = html.replace(/<html.*<body>/, '');
    html = html.replace(/<\/body><\/html>/, '');
    html = html.replace(/ data-t="[^"]*"/g, '');
    html = html.replace(/ data-v="[^"]*"/g, '');
    html = html.replace(/ id="[^"]*"/g, '');
    html = html.replace(/ xml:space="[^"]*"/g, '');
    html = html.replace(/colspan/g, 'colSpan');
    html = html.replace(/rowspan/g, 'rowSpan');
    html = html.replace(/<br>/g, '<br />');

    const componentName = s === 'Perfilador' ? 'PDFPerfilador' : (s === 'Candidato 01' ? 'PDFEntrevistaInicial' : 'PDFEntrevistaProfunda');
    const header = `import React from 'react';

const ${componentName} = React.forwardRef(({ candidato, entrevistaInicial, entrevistaProfunda, vacante }, ref) => {
    return (
        <div ref={ref} className="excel-report-container">
            ` + html + `
        </div>
    );
});
export default ${componentName};
`;
    fs.writeFileSync(componentName + '_raw.jsx', header);
    console.log('Created ' + componentName + '_raw.jsx');
});
