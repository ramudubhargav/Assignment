import React, { useState } from "react";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import "./App.css";

const allowedExtensions = ["xlsx", "csv"];

const App = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [file, setFile] = useState("");

    const handleFileChange = (e) => {
        setError("");
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            const fileExtension = inputFile?.name.split(".")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                setError("Please input a excel or csv file");
                return;
            }
            setFile(inputFile);
        }
    };

    const handleParse = () => {
        if (!file) return setError("Enter a valid file");

        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            const workbook = XLSX.read(target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setData(parsedData);
        };
        reader.readAsBinaryString(file);
    };

    const handleDownload = () => {
        if (!data || !data.length) return setError("No data to download");
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        const dataToDownload = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(dataToDownload, 'parsed_data.xlsx');
    };

    return (
        <div>
            <label htmlFor="fileInput" style={{ display: "block" }}>
                Enter Excel or CSV File
            </label>
            <input
                onChange={handleFileChange}
                id="fileInput"
                name="file"
                type="File"
            />
            <div>
                <button onClick={handleParse}>Parse</button>
                <button onClick={handleDownload}>Download</button>
            </div>
//             <div style={{ marginTop: "3rem" }}>
//                 {error ? error : !data || !data.length ? "No data" : data.map((row, idx) => (
//                     <table className="data-table">
//                     <tbody className="data-tbody">
//                       {data.map((row, idx) => (
//                         <tr key={idx}>
//                           {row.map((col, idx) => <td key={idx}>{col}</td>)}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>                  
//                 ))}
//             </div>
        <div style={{ marginTop: "3rem" }}>
                {error ? error : !data || !data.length ? "No data" : data.map((row, idx) => (
                    <div key={idx} style={{display:'flex'}}>
                        {row.map((col, idx) => <div key={idx}>{col}</div>)}
                    </div>
                ))}
            </div>
        </div>
    );
                
}
export default App;
