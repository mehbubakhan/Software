/**
 * Parses a CSV file and returns an array of objects.
 * @param {File} file - The CSV file to import
 * @returns {Promise<Array<Object>>} - Promise resolving to the parsed data
 */
export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file is empty or contains only headers');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
          const currentline = lines[i].split(',');
          const obj = {};
          
          for (let j = 0; j < headers.length; j++) {
            // Handle cases where the value might be missing
            let val = currentline[j] ? currentline[j].trim() : '';
            // Remove quotes if present
            val = val.replace(/^"|"$/g, '').replace(/""/g, '"');
            obj[headers[j]] = val;
          }
          result.push(obj);
        }
        
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
