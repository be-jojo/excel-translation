import React, { useEffect, useState } from 'react'
import { read, utils, writeFile } from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOutputRequest } from '../redux/output/outputActions';
import { loadInputText } from '../redux/input/inputActions';

function Home() {
    const dispatch = useDispatch();
    const [to, setTo] = useState('en');
    const [from, setFrom] = useState('en');
    const input = useSelector(state=>state.input);
    const output = useSelector(state=>state.output);
    console.log(output, input)

    const options = [
        { code: 'en', name: 'English' },
        { code: 'it', name: 'Italian'},
        { code: 'ar', name: 'Arabic' },
        { code: 'ja', name: 'Japanese' },
        { code: 'hi', name: 'Hindi' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ur', name: 'Urdu' },
        { code: 'hu', name: 'Hungarian' }
    ]

    const handleImport = ($event) => {
        const files = $event.target.files;
        
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    var rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    dispatch(loadInputText(rows));
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleExport = () => {
        dispatch(fetchOutputRequest({input, from, to}));
    }
    function downloadFile (){
        const headings = [[
            'Translatedtext'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, output.translations, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'translation.xlsx');
    }
    useEffect(()=>{
        if(output.translations.length){
            downloadFile();
        }
    }, [output.translations.length, downloadFile])

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
                                   output.translations.length
                                    ?
                                    output.translations.map((row, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ row.translatedText }</td>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="5" className="text-center">No input Found.</td>
                                    </tr> 
                                }
                                {
                                    output.error ? 
                                    <tr>
                                        <td colSpan="5" className="text-center">Error Occurred.</td>
                                    </tr> :
                                    <tr>
                                        <td colSpan="5" className="text-center"></td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
            </div>
            <div>
                <span>
                { output.error ? 
                    "Error Occured While Translation": ""
                }
                </span>
            </div>
        </>

    );
  
}

export default Home