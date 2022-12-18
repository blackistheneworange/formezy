import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import Transition from '../../utils/Transition';
import { downloadCSVFile, tableToCSV } from '../../utils/Utils';
import FormResponsesViewTable from './FormResponsesViewTable';

const API_URL = import.meta.env.VITE_API_URL;

function FormResponsesViewModal({
  id,
  modalOpen,
  selectedForm,
  toggleFormResponses,
  setNotification
}) {

    const [formResponses, setFormResponses] = useState([]);
    const [selectedFormResponses, setSelectedFormResponses] = useState([]);
    const modalContent = useRef(null);

    useEffect(()=>{
        if(modalOpen === true && selectedForm?.id){
            let form = formResponses.find(form => form.id === selectedForm?.id);
            if(form){
                setSelectedFormResponses([...form.responses]);
            }
            else{
                axios.get(`${API_URL}/api/v1/form/${selectedForm.id}/response`)
                .then(({data}) => {
                    data = filterFormResponses(data);
                    setFormResponses([...formResponses, {...selectedForm, responses:data}]);
                    setSelectedFormResponses([...data]);
                })
            }
        }
    },[modalOpen])

    function filterFormResponses(data){
        if(data && data.length>0){
            return data.map(formResponse => 
                    ({
                        ...formResponse, 
                        response: Object.keys(formResponse.response).filter(responseFieldName => 
                            selectedForm?.fields?.map(f => f.name.toLowerCase()).includes(responseFieldName.toLowerCase())
                        )
                        .map(
                            exisitingFieldName => formResponse.response[exisitingFieldName]
                        )
                    })
            )
        }
        else{
            return [];
        }
    }

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

    function handleDownloadResponses(){
        const csvData = tableToCSV("responsesTable");
        downloadCSVFile(csvData, `${selectedForm.companyName ? (selectedForm.companyName+"_") : ""}${selectedForm.name}_responses`);
    }


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
            <div ref={modalContent} className="bg-white overflow-auto w-full h-full rounded shadow-lg brickwall-bg border-b border-slate-200 px-4 sm:px-6 lg:px-8">
                
                <header className="bg-white border-b border-slate-200">
                    <div>
                        <div className="flex items-center justify-between h-16 -mb-px">
                            <h2 className="font-bold">RESPONSES - {selectedForm?.name}</h2>
                            
                            <div>
                                {selectedFormResponses.length>0 && 
                                <button onClick={handleDownloadResponses} className="btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Download</span>
                                </button>}
                                <button className="btn text-white bg-slate-400 hover:bg-slate-500" type="button" onClick={(e) => { e.stopPropagation(); toggleFormResponses(); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Form responses */}
                <div>
                    <div className="form-fields">
                        <div className="pt-3 pb-1 border-b-2 border-neutral-200 mb-2"></div>
                        {/*Table*/}
                        <FormResponsesViewTable
                            responses={selectedFormResponses}
                            columns={selectedForm?.fields?.map(f => f.name) || []}
                            setNotification={setNotification}
                        />
                    </div>
                </div>
            </div>
        </Transition>
        </>
    );
}

export default FormResponsesViewModal;

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
