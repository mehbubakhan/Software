/**
 * Converts an array of objects to a CSV string and triggers a file download.
 * @param {Array<Object>} data - The data array to export.
 * @param {string} filename - The name of the downloaded file.
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = [];
  
  // Add headers row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Escape strings containing commas, quotes, or newlines
      const escaped = ('' + val).replace(/"/g, '""');
      if (escaped.search(/("|,|\n)/g) >= 0) {
        return `"${escaped}"`;
      }
      return escaped;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link and trigger download
  const link = document.createElement('url');
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  a.style.visibility = 'hidden';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
