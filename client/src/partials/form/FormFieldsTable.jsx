import {useEffect, useState} from 'react';

import FormCreateFieldModal from './FormCreateFieldModal';
import FormDeleteFieldModal from './FormDeleteFieldModal';

import { capitalWord } from '../../utils/Utils';

function FormFieldsTable({createFormField, updateFormField, deleteFormField, fields, setNotification}){

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownEditOpen, setDropdownEditOpen] = useState(false);
    const [dropdownDeleteOpen, setDropdownDeleteOpen] = useState(false);
    const [pageProps, setPageProps] = useState({action:"create"});

    
    function handleToggleEditFormField(formField){
        setPageProps({...pageProps, action:"edit", formField:formField});
        setDropdownEditOpen(true);
    }
    
    function handleToggleCreateFormField(){
        setPageProps({...pageProps, action:"create", formField:{}});
        setDropdownOpen(true);
    }
    
    function handleToggleDeleteFormField(formField){
        setPageProps({...pageProps, action:"delete", formField:formField});
        setDropdownDeleteOpen(true);
    }

    useEffect(()=>{
        if(dropdownEditOpen === false){
            setPageProps({...pageProps, action:"none",formField:{}})
        }
    },[dropdownEditOpen])

    
    useEffect(()=>{
        if(dropdownDeleteOpen === false){
            setPageProps({...pageProps, action:"none",formField:{}})
        }
    },[dropdownDeleteOpen])

    return(
        <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                        <header className="px-5 py-4 border-b border-gray-100 flex align-center justify-between">
                            <h2 className="font-semibold text-gray-800">Fields</h2>
                            <FormCreateFieldModal createFormField={createFormField} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} toggleCreateFormField={handleToggleCreateFormField} isSelected={pageProps.action==="create"} action={pageProps.action} setNotification={setNotification}/>
                        </header>
                        <div className="p-3">
                            {/* <div className="overflow-x-auto"> */}
                            <div>
                                <table className="table-auto w-full h-full">
                                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                        <tr>
                                            <th>
                                                <div className="flex items-center pl-1">
                                                    <input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                                </div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Statement/Question</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Response Required</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Response Type</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Response Format</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Actions</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100">
                                        {fields.map(field => 
                                            <tr key={field.name+"-"+field.id}>
                                                <td>
                                                    <div className="flex items-center pl-1">
                                                        <input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left font-medium text-gray-800">{field.name}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left font-medium text-gray-800">{field.required ? "Yes" : "No"}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left">{capitalWord(field.responseType)}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-left font-medium text-green-500">{capitalWord(field.responseFormat)}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-lg text-center">
                                                        {/* <button 
                                                            className="text-slate-500 hover:text-slate-600 mx-1"
                                                            onClick={() => handleToggleEditFormField(field)}
                                                            type="button"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </button> */}

                                                        <FormCreateFieldModal 
                                                            createFormField={createFormField} 
                                                            updateFormField={updateFormField} 
                                                            dropdownOpen={dropdownEditOpen} 
                                                            setDropdownOpen={setDropdownEditOpen} 
                                                            action={pageProps.action} 
                                                            selectedFormField={pageProps.formField} 
                                                            ActionButton={()=>
                                                                <EditActionButton handleToggleEditFormField={handleToggleEditFormField} field={field}/> 
                                                            }  
                                                            isSelected={(!pageProps.formField ? false : (pageProps.formField.id === field.id) ? true : false)}
                                                            setNotification={setNotification}
                                                        />

                                                        
                                                        <FormDeleteFieldModal 
                                                            deleteFormField={deleteFormField}
                                                            dropdownOpen={dropdownDeleteOpen} 
                                                            setDropdownOpen={setDropdownDeleteOpen} 
                                                            action={pageProps.action} 
                                                            selectedFormField={pageProps.formField} 
                                                            ActionButton={()=>
                                                                <DeleteActionButton handleToggleDeleteFormField={handleToggleDeleteFormField} field={field}/> 
                                                            }  
                                                            isSelected={(!pageProps.formField ? false : (pageProps.formField.id === field.id) ? true : false)}
                                                        />
                                                        
                                                        {/* <button 
                                                            className="text-slate-500 hover:text-slate-600 mx-1"
                                                            onClick={(e) => { e.stopPropagation(); }}
                                                            type="button"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
        </div>
    );
}

function DeleteActionButton({handleToggleDeleteFormField, field, innerRef}){
    return(
        <button 
            area="form-field-delete-modal"
            ref={innerRef}
            className="text-slate-500 hover:text-slate-600 mx-1"
            onClick={() => {handleToggleDeleteFormField(field)}}
            type="button"
        >
            <svg area="form-field-delete-modal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path area="form-field-delete-modal" strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        </button>
    )
}

function EditActionButton({handleToggleEditFormField, field, innerRef}){
    return(
        <button 
            area="form-field-edit-modal"
            ref={innerRef}
            className="text-slate-500 hover:text-slate-600 mx-1"
            onClick={() => {handleToggleEditFormField(field)}}
            type="button"
        >
            <svg area="form-field-edit-modal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path area="form-field-edit-modal" strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </button>
    )
}

export default FormFieldsTable;