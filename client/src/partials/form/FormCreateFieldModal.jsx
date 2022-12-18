import React, { useState, useRef, useEffect } from 'react';
import { formResponseFormats } from '../../utils/Form';
import Transition from '../../utils/Transition';

import nolertNotify from "@nolert/notify";

function FormCreateFieldModal({open, setOpen, createFormField, updateFormField, action, selectedFormField}) {

  const [formField, setFormField] = useState({
    name:"",
    responseType:"normal",
    responseFormat:"any",
    select:{},
    required:true
  })

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(()=>{
    if(open === true){
        if(action==="edit" && selectedFormField && selectedFormField.id){
            setFormField({...selectedFormField});
        }
    }
  },[open, selectedFormField])

  // close on click outside
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//         // if (!open || (dropdown && dropdown.current.contains(target)) || (trigger && trigger.current &&trigger.current.contains(target))) return;
//         if (!open || (target.getAttribute("area") === "form-field-edit-modal" || target.getAttribute("area") === "form-field-create-modal") || (dropdown && dropdown.current && dropdown.current.contains(target))) return;
//         setOpen(false);
//     };
//     document.addEventListener('click', clickHandler);
//     return () => document.removeEventListener('click', clickHandler);
//   });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!open || keyCode !== 27) return;
      setOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  function handleAddSelectOption(){
    const input = document.querySelector("input[name='formFieldResponseSelectOptionValue']");
    if(input.value){

        if(formField.select?.options?.some(x => x.toLowerCase()===input.value.toLowerCase())){
            nolertNotify.trigger({type:"warning", message:"Select option already exists"});
            return;
        }
        
        setFormField({
            ...formField,
            select:{
                ...formField.select,
                options: formField.select?.options ? [...formField.select?.options, input.value] : [input.value]
            }
        })
        input.value="";
    }
  }

  function handleDeleteSelectOption(el){
    const value = el.currentTarget.getAttribute("option-value");
    if(value){
        
        setFormField({
            ...formField,
            select:{
                ...formField.select,
                options: formField.select?.options ? formField.select?.options.filter(x => x !== value) : []
            }
        })
    }
  }

  function handleChange(e){
    let updatedValue = e.currentTarget.value;
    if (e.currentTarget.name === "required") {
        updatedValue = JSON.parse(updatedValue);
    }

    if(e.currentTarget.name === "responseType"){
        setFormField({
            ...formField, 
            [e.currentTarget.name]:updatedValue, 
            select:e.currentTarget.value === "select" ? {type:"text",values:[]} : {}
        });
    }
    else{
        setFormField({...formField, [e.currentTarget.name]:updatedValue});
    }
  }

  
  function handleSelectChange(e){
    let updatedValue = e.currentTarget.value;
    setFormField({...formField, select:{...formField.select,[e.currentTarget.name]:updatedValue}});
  }

  function handleSubmit(e){
    try{
        if(!formField.name || formField.name===""){
            nolertNotify.trigger({type:"danger", message:"Field name cannot be empty"});
            return;
        }

        if(action==="edit"){
            updateFormField(formField.id, formField);
        }
        else{
            createFormField(formField);
        }
        clearInputs();
        setOpen(false);
    }
    catch(err){
        alert(err);
    }
  }

  const clearInputs = () => setFormField({name:"",responseType:"normal",responseFormat:"any", required:true});

  return (
    <div className="relative inline-flex ml-3">

        {/* <Transition
        //     className="origin-top-right z-10 absolute right-0 sm:mr-0 min-w-80 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden"
        //     show={open}
        //     appear={true}
        //     enter="transition ease-out duration-200 transform"
        //     enterStart="opacity-0 -translate-y-2"
        //     enterEnd="opacity-100 translate-y-0"
        //     leave="transition ease-out duration-200"
        //     leaveStart="opacity-100"
        //     leaveEnd="opacity-0"
        // > */}
        <Transition
            className="fixed inset-0 z-50 flex items-center justify-center transform m-0 bg-white bg-opacity-30"
            role="dialog"
            aria-modal="true"
            show={open}
            enter="transition ease-in-out duration-200"
            enterStart="opacity-0 translate-y-4"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-200"
            leaveStart="opacity-100 translate-y-0"
            leaveEnd="opacity-0 translate-y-4"
        >
            <div
                ref={dropdown}
                // onFocus={() => setOpen(true)}
                // onBlur={() => setOpen(false)}
                style={{maxHeight:"100%"}}
                className="overflow-auto bg-gray-100 transform m-0 w-full h-full md:w-4/5 md:h-4/5 shadow-md border-2 border-gray-200"
            >
            <div className="py-4 px-4 flex align-center justify-between">
                <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5">{action==="edit" ? "UPDATE" : "ADD NEW"} FIELD</div>
                
                <div>
                    <button 
                        className="btn py-1 px-2 text-sm rounded-full bg-indigo-500 hover:bg-indigo-600 text-white mr-1" 
                        aria-haspopup="true"
                        type="button"
                        onClick={handleSubmit}
                    >
                        {action==="edit" ? "Update" : "Add"}
                    </button>
                    <button 
                        onClick={() => {clearInputs(); setOpen(false);}}
                        className="ml-2 btn py-1 px-2 text-sm rounded-full bg-slate-400 hover:bg-slate-500 text-white" 
                        aria-haspopup="true"
                        type="button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <ul>
                <li className="border-b border-slate-200 last:border-0">
                    <div className="block py-2 px-4 hover:bg-slate-50">
                        <label htmlFor="formFieldName" className="block text-sm font-medium text-gray-700">Statement/Question</label>
                        <input type="text" placeholder="Eg:. Enter age (or) Please enter your name" name="name" id="formFieldName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={formField.name} onChange={handleChange}/>
                     </div>
                </li>
                <li className="border-b border-slate-200 last:border-0">
                    <div className="block py-2 px-4 hover:bg-slate-50">
                        <label htmlFor="formFieldRequired" className="block text-sm font-medium text-gray-700">Required</label>
                        <select id="formFieldRequired" name="required" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={formField.required} onChange={handleChange}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                </li>
                <li className="border-b border-slate-200 last:border-0">
                    <div className="block py-2 px-4 hover:bg-slate-50">
                        <label htmlFor="formFieldResponseType" className="block text-sm font-medium text-gray-700">Response Type</label>
                        <select id="formFieldResponseType" name="responseType" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={formField.responseType} onChange={handleChange}>
                            <option value="normal">Normal</option>
                            <option value="select">Select</option>
                            {/* <option>Select</option> */}
                        </select>
                    </div>
                </li>
                {formField.responseType==="select"?
                    <>
                    <li className="border-b border-slate-200 last:border-0">
                        <div className="block py-2 px-4 hover:bg-slate-50">
                            <label htmlFor="formFieldResponseSelectType" className="block text-sm font-medium text-gray-700">Select Type</label>
                            <select id="formFieldResponseSelectType" name="type" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={formField.select?.type} onChange={handleSelectChange}>
                                <option value="text">Text</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="radio">Radio Button</option>
                                {/* <option>Select</option> */}
                            </select>
                        </div>
                    </li>
                    <li className="border-b border-slate-200 last:border-0">
                        <div className="block py-2 px-4 hover:bg-slate-50">
                            <label htmlFor="formFieldResponseSelectOptions" className="block text-sm font-medium text-gray-700">Select Options</label>
                            <div>
                                <div className="flex items-center flex-wrap border-2 bg-white px-2 py-1">
                                    {formField.select?.options?.map(op => 
                                        <span key={op} className="bg-blue-100 text-blue-800 text font-medium mr-2 px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 my-1 flex items-center justify-between">
                                            <span></span>{op}
                                            <button type="button" option-value={op} className="ml-1" onClick={handleDeleteSelectOption}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>

                                                <span className="sr-only">Delete select option icon</span>
                                            </button>
                                        </span>
                                    )}
                                    <input className="bg-blue-100 text-blue-800 text font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 w-30 my-1 border-2 border-black" placeholder="Type here..." name="formFieldResponseSelectOptionValue"/>

                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleAddSelectOption}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        <span className="sr-only">Add select option</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    </>
                :
                    <></>
                }

                {formField.responseType === "normal"
                ?
                    <li className="border-b border-slate-200 last:border-0">
                        <div className="block py-2 px-4 hover:bg-slate-50">
                            <label htmlFor="formFieldResponseFormat" className="block text-sm font-medium text-gray-700">Response Format</label>
                            <select id="formFieldResponseFormat" name="responseFormat" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={formField.responseFormat} onChange={handleChange}>
                                {formResponseFormats.map(res => 
                                    <option key={res.value} value={res.value}>{res.name}</option>
                                )}
                            </select>
                        </div>
                    </li>
                :
                    <></>
                }
            </ul>
            </div>
        </Transition>
    </div>
  )
}

export default FormCreateFieldModal;