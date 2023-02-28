import React, { useEffect, useState } from 'react'
import { read, utils, writeFile } from 'xlsx'
import axios from 'axios'

function Home() {
    const [options, setOptions] = useState([]);
    const [to, setTo] = useState('en');
    const [from, setFrom] = useState('en');
    const [input, setInput] = useState([]);
    const [output, setOutput] = useState([])

    function translate(input) {
       
        const params = new URLSearchParams();
        params.append('q', input.text);
        params.append('source', from);
        params.append('target', to);
        params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    
        axios.post('https://libretranslate.de/translate',params, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res=>{
            console.log(res.data)
            // setOutput(prev => return [...prev, { text: res.data.translatedText}])};
            setOutput(prev=>{
               return [...prev, {text: res.data.translatedText}]
            })
        })
      };

    const handleImport = ($event) => {
        const files = $event.target.files;
        console.log($event)
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                console.log(wb)
                if (sheets.length) {
                    var rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    rows.map(row=>{ return translate(row) })
                    console.log(rows)
                    // setInput(rows)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleExport = () => {
        const headings = [[
            'text'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, input, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Movie Report.xlsx');
    }

    useEffect(() => {
        axios
          .get('https://libretranslate.de/languages', {
            headers: { accept: 'application/json' },
          })
          .then((res) => {
            console.log(res.data);
            setOptions(res.data);
          });
      }, []);

    return (
        <>
            <div>
                From ({from}) :
                <select onChange={(e) => setFrom(e.target.value)}>
                {options.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                    {opt.name}
                    </option>
                ))}
                </select>
                To ({to}) :
                <select onChange={(e) => setTo(e.target.value)}>
                {options.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                    {opt.name}
                    </option>
                ))}
                </select>
            </div>
            <div className="custom-file">
                <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                <label className="custom-file-label" htmlFor="inputGroupFile">Choose file</label>
            </div>
            <div className="col-md-6">
                <button onClick={handleExport} className="btn btn-primary float-right">
                                Export <i className="fa fa-download"></i>
                </button>
            </div>
            <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Text</th>
                            </tr>
                        </thead>
                        <tbody> 
                                {
                                   output.length
                                    ?
                                    output.map((row, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ row.text }</td>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="5" className="text-center">No input Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
            </div>
        </>

    );
  
}

export default Home