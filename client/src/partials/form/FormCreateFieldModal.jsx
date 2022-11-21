import React, { useState, useRef, useEffect } from 'react';
import { formResponseFormats } from '../../utils/Form';
import Transition from '../../utils/Transition';

function FormCreateFieldModal({ActionButton, dropdownOpen, setDropdownOpen, createFormField, updateFormField, action, selectedFormField, isSelected, toggleCreateFormField, setNotification}) {

  const [formField, setFormField] = useState({
    name:"",
    responseType:"normal",
    responseFormat:"any",
    required:true
  })

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(()=>{
    if(dropdownOpen === true){
        if(action==="edit" && selectedFormField && selectedFormField.id){
            setFormField({...selectedFormField});
        }
    }
  },[dropdownOpen, selectedFormField])

  // close on click outside
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//         // if (!dropdownOpen || (dropdown && dropdown.current.contains(target)) || (trigger && trigger.current &&trigger.current.contains(target))) return;
//         if (!dropdownOpen || (target.getAttribute("area") === "form-field-edit-modal" || target.getAttribute("area") === "form-field-create-modal") || (dropdown && dropdown.current && dropdown.current.contains(target))) return;
//         setDropdownOpen(false);
//     };
//     document.addEventListener('click', clickHandler);
//     return () => document.removeEventListener('click', clickHandler);
//   });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  function handleChange(e){
    let updatedValue = e.currentTarget.value;
    if (e.currentTarget.name === "required") {
        updatedValue = JSON.parse(updatedValue);
    }
    setFormField({...formField, [e.currentTarget.name]:updatedValue});
  }
  function handleSubmit(e){
    try{
        setNotification({message:null});
        if(!formField.name || formField.name===""){
            setNotification({type:"danger", message:"Field name cannot be empty"});
            return;
        }

        if(action==="edit"){
            updateFormField(formField.id, formField);
        }
        else{
            createFormField(formField);
        }
        clearInputs();
        setDropdownOpen(false);
    }
    catch(err){
        alert(err);
    }
  }

  const clearInputs = () => setFormField({name:"",responseType:"normal",responseFormat:"any", required:true});

  return (
    <div className="relative inline-flex ml-3">
      
        {!ActionButton
        ?
            <button 
                type="button"
                area="form-field-create-modal"
                ref={trigger}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white" 
                aria-haspopup="true"
                onClick={toggleCreateFormField}
                aria-expanded={dropdownOpen}
            >
                <svg area="form-field-create-modal" className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path area="form-field-create-modal" d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span area="form-field-create-modal" className="hidden xs:block ml-2">Add</span>
            </button>
        :
            // <button type="button" ref={trigger} className="none">abc</button>
            <ActionButton innerRef={trigger}/>
        }

        {(isSelected===true && (action==="edit" || action==="create"))
        ?
        <Transition
            className="origin-top-right z-10 absolute right-0 sm:mr-0 min-w-80 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden"
            show={dropdownOpen}
            appear={true}
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
        >
            <div
                ref={dropdown}
                // onFocus={() => setDropdownOpen(true)}
                // onBlur={() => setDropdownOpen(false)}
                style={{overflow:'auto',maxHeight:'300px'}}
            >
            <div className="pb-2 px-4 flex align-center justify-between">
                <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5">{action==="edit" ? "UPDATE" : "ADD NEW"} FIELD</div>
                
                <div>
                    <button 
                        className="btn py-1 px-2 text-xs font-medium rounded-full bg-indigo-500 hover:bg-indigo-600 text-white mr-1" 
                        aria-haspopup="true"
                        type="button"
                        onClick={handleSubmit}
                    >
                        {action==="edit" ? "Update" : "Add"}
                    </button>
                    <button 
                        onClick={() => {clearInputs(); setDropdownOpen(false);}}
                        className="btn py-1 px-2 text-xs font-medium rounded-full bg-slate-400 hover:bg-slate-500 text-white" 
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
                            {/* <option>Select</option> */}
                        </select>
                    </div>
                </li>
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
            </ul>
            </div>
        </Transition>
        :
        <></>
        }
    </div>
  )
}

export default FormCreateFieldModal;