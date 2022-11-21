import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ButtonSpinner from '../../utils/ButtonSpinner';
import Transition from '../../utils/Transition';
import FormFieldsTable from './FormFieldsTable';

let formFieldId=1;
function FormCreateModal({
  id,
  searchId,
  modalOpen,
  action,
  selectedForm,
  setModalOpen,
  createForm,
  createFormField,
  updateForm,
  toggleForm,
  setNotification
}) {

    const [form, setForm] = useState({
        name:"",
        desc:"",
        type:"normal",
        active:true,
        companyName:"",
        fields:[]
    })
    const modalContent = useRef(null);
    const searchInput = useRef(null);

    useEffect(()=>{
        if(action==="edit" && selectedForm && selectedForm.id){
            setForm({...selectedForm})
        }
        else{
            setForm({
                name:"",
                desc:"",
                type:"normal",
                active:true,
                companyName:"",
                fields:[]
            })
        }

        return () => setForm({
            name:"",
            desc:"",
            type:"normal",
            active:true,
            companyName:"",
            fields:[]
        })
    },[modalOpen])

    // close on click outside
    // useEffect(() => {
    //     const clickHandler = ({ target }) => {
    //     if (!modalOpen || modalContent.current.contains(target)) return
    //         setModalOpen(false);
    //     };
    //     document.addEventListener('click', clickHandler);
    //     return () => document.removeEventListener('click', clickHandler);
    // });

    // close if the esc key is pressed
    // useEffect(() => {
    //     const keyHandler = ({ keyCode }) => {
    //     if (!modalOpen || keyCode !== 27) return;
    //         setModalOpen(false);
    //     };
    //     document.addEventListener('keydown', keyHandler);
    //     return () => document.removeEventListener('keydown', keyHandler);
    // });

    //   useEffect(() => {
    //     modalOpen && searchInput.current.focus();
    //   }, [modalOpen]);

    function handleChange(e){
        let updatedValue = e.currentTarget.value;
        if (e.currentTarget.name === "active") {
            updatedValue = JSON.parse(updatedValue);
        }
        setForm({...form,[e.currentTarget.name]:updatedValue});
    }

    async function handleSubmit(e){
        e.preventDefault();

        const btn = e.target.querySelector("button[type=submit]");
        styleSubmitButton(btn, true);

        try{
            if(action==="edit"){
                await updateForm(form);
            }
            else{
                await createForm(form);
            }
            setModalOpen(false);
        }
        catch(err){}
        finally{
            styleSubmitButton(btn, false);
        }
    }

    function handleCreateFormField(formField){
        setForm({...form,fields:[...form.fields,{...formField, id:formFieldId++}]})
    }

    function handleUpdateFormField(id, formField){
        setForm({...form,fields:form.fields.map(f => f.id === id ? {...formField} : f)});
    }
    
    function handleDeleteFormField(id){
        setForm({...form,fields:form.fields.filter(f => f.id !== id)});
    }

    // useEffect(()=>{console.log(form)},[form])

    return (
        <>
        {/* Modal backdrop */}
        <Transition
            className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
            show={modalOpen}
            enter="transition ease-out duration-200"
            enterStart="opacity-0"
            enterEnd="opacity-100"
            leave="transition ease-out duration-100"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
            aria-hidden="true"
        />
        {/* Modal dialog */}
        <Transition
            id={id}
            className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center transform m-0 sm:m-4"
            role="dialog"
            aria-modal="true"
            show={modalOpen}
            enter="transition ease-in-out duration-200"
            enterStart="opacity-0 translate-y-4"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-200"
            leaveStart="opacity-100 translate-y-0"
            leaveEnd="opacity-0 translate-y-4"
        >
            <div ref={modalContent} className="bg-white overflow-auto w-full h-full rounded shadow-lg brickwall-bg">
                <form className="border-b border-slate-200 px-4 sm:px-6 lg:px-8" onSubmit={handleSubmit}>
                <header className="bg-white border-b border-slate-200">
                    <div>
                        <div className="flex items-center justify-between h-16 -mb-px">
                            <h2 className="font-bold">{action==="create" ? "BUILD NEW" : "UPDATE"} FORM</h2>
                            <div>
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1" type="submit">
                                    <ButtonSpinner style={{display:'none'}}/>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Save</span>
                                </button>
                                <button className="btn text-white bg-slate-400 hover:bg-slate-500" type="button" onClick={(e) => { e.stopPropagation(); toggleForm(); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Close</span>
                                </button>   
                                {/* <button
                                    className="text-slate-500 hover:text-slate-600"
                                    aria-controls="buildform-modal"
                                    aria-expanded={modalOpen}
                                    onClick={(e) => { e.stopPropagation(); setModalOpen(!modalOpen); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </header>
                {/* Build form */}
                <div>
                    <div className="form-meta">
                        <h3 className="font-semibold pt-3 pb-1 border-b-2 border-neutral-200 mb-2">Metadata:</h3>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="formName" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" placeholder="Type here..." name="name" id="formName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={form.name} onChange={handleChange} required={true}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="formType" className="block text-sm font-medium text-gray-700">Type</label>
                                <select id="formType" name="type" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={form.type} onChange={handleChange} required={true}>
                                    <option value={"normal"}>Normal</option>
                                </select>
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="formStatus" className="block text-sm font-medium text-gray-700">Status</label>
                                <select id="formStatus" name="active" className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={form.active} onChange={handleChange} required={true}>
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-4">
                                <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea placeholder="Type here..." name="desc" id="formDescription" rows={1} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={form.desc} onChange={handleChange} required={true}></textarea>
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="formCompanyName" className="block text-sm font-medium text-gray-700">Company Name (Optional)</label>
                                <input type="text" placeholder="Type here..." name="companyName" id="formCompanyName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={form.companyName} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

                    <div className="form-fields">
                        <div className="pt-3 pb-1 border-b-2 border-neutral-200 mb-2"></div>
                        {/*Table*/}
                        <FormFieldsTable 
                            fields={form.fields} 
                            createFormField={handleCreateFormField} 
                            updateFormField={handleUpdateFormField}
                            deleteFormField={handleDeleteFormField}
                            setNotification={setNotification}
                        />
                    </div>
                </div>
                </form> 
            </div>
        </Transition>
        </>
    );
}

export default FormCreateModal;

function styleSubmitButton(btn, active){
    if(active){
        btn.children[0].style.display="block";
        btn.children[1].style.display="none";
        btn.children[2].textContent="Saving..."
        btn.disabled = true;
    }
    else{
        btn.children[0].style.display="none";
        btn.children[1].style.display="block";
        btn.children[2].textContent="Save"
        btn.disabled = false;
    }
}
