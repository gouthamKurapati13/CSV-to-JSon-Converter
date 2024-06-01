import React from 'react'
import "./main.css"

const Converter = () => {
    const [jsonData, setJsonData] = React.useState(null);
    const [fileName, setFileName] = React.useState(null);
    const [copyText, setTextContent] = React.useState('Copy');

    const CSVToJson = (CSVData) => { 
        const lines = CSVData.split('\n');
        const headers = lines[0].split(',');
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        return result;
    }

    const changeCSVInputData = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const CSVData = e.target.result;
            const jsonData = CSVToJson(CSVData);
            setJsonData(jsonData);
            setFileName(file.name.split(".")[0]);
        }
        reader.readAsText(file);
    }

    const Download = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(jsonData, null, 2)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        console.log(fileName);
        element.download = fileName + ".json";
        document.body.appendChild(element);
        element.click();
    };

  return (
    <div className='card'>
      <h1>CSV to JSON Converter</h1>
      <input type="file" accept=".csv" onChange={changeCSVInputData} />
      {
        jsonData ? (
            <>
                <button className='download-button' onClick={Download}>Download</button>
                <div className='json-container'>
                <button className='copy-button' 
                    onClick={() => {
                        setTextContent("Copied");
                        navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
                        setTimeout(() => {
                            setTextContent("Copy");
                        }, 1000);
                    }}>
                        {copyText}
                    </button>
                    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
            </>
            
        ) : (<p>Choose a CSV File to convert</p>)
    }
    </div>
  )
}

export default Converter;
