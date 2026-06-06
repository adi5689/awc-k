export function downloadTextFile(fileName: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function toCsv(rows: Array<Record<string, string | number | boolean | null | undefined>>) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | boolean | null | undefined) => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

export function downloadCsv(fileName: string, rows: Array<Record<string, string | number | boolean | null | undefined>>) {
  downloadTextFile(fileName, toCsv(rows), 'text/csv;charset=utf-8');
}

export function downloadExcelHtml(fileName: string, rows: Array<Record<string, string | number | boolean | null | undefined>>) {
  if (rows.length === 0) {
    downloadTextFile(fileName, '<table></table>', 'application/vnd.ms-excel;charset=utf-8');
    return;
  }

  const headers = Object.keys(rows[0]);
  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  downloadTextFile(fileName, html, 'application/vnd.ms-excel;charset=utf-8');
}
