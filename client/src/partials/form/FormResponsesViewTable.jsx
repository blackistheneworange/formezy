function FormResponsesViewTable({responses, columns}){

    return(
        <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            {/* <header className="px-5 py-4 border-b border-gray-100 flex align-center justify-between">
                <h2 className="font-semibold text-gray-800">Responses</h2>
            </header> */}
            <div className="p-3">
                {/* <div className="overflow-x-auto"> */}
                <div>
                    <table id="responsesTable" className="table-auto w-full h-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                {/* <th>
                                    <div className="flex items-center pl-1">
                                        <input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                    </div>
                                </th> */}
                                {/*responses && responses[0] && Object.keys(responses[0]?.response).map(objectKey => 
                                    <th key={`th_${objectKey}`} className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">{objectKey}</div>
                                    </th>
                                )*/}
                                
                                {columns.map(col => 
                                    <th key={`th_${col}`} className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">{col}</div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {responses.map((response) => 
                                <tr key={response.id}>
                                    {response?.response && Object.keys(response?.response).map(
                                    (objectKey) =>
                                        <td key={`td_${objectKey}`} className="p-2 whitespace-nowrap">
                                            <div className="text-left font-medium text-gray-800">
                                                {
                                                    typeof response?.response[objectKey] === "object" ?
                                                        `[ ${response?.response[objectKey].join(" ][ ")} ]`
                                                    :
                                                        response?.response[objectKey]
                                                }
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FormResponsesViewTable;