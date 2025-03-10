
import ParseData from "../../util/MTX";
  
function RenderTable(data) {
  return (
    <table border={1}>
      <thead>
          <tr>
            {
              data.headers.map((header,idx) => <th key={idx}>{header}</th>)
            }
          </tr>
        </thead>
        <tbody>
    
      {
        data.items.map((item,idx) => 
          <tr key={idx}>
            {
                data.headers.map((header,idx) => <td key={idx}>{item[header]}</td>)
            }
            
          </tr>
        )
      }
      </tbody>
    </table>
    
  );
}


export default RenderTable