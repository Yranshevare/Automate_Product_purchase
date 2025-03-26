import markdownit from 'markdown-it'
const md = markdownit()

function ParseData(data) {
    const html = md.render(data);
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    // console.log(plainText)
    const rows = plainText.trim().split('\n').map(row => row.trim());
    const headers = rows[0].split('|').map(header => header.trim()).filter(header => header);
  
    const items = rows.slice(2).map(row => {
      const columns = row.split('|').map(col => col.trim()).filter(col => col);
      const item = {};
        // console.log(columns)
      headers.forEach((header, index) => {
        item[header] = columns[index];
      });
      return item
    })
    
    return {items,headers}
  
}
export default ParseData