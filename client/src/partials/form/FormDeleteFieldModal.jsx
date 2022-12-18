import React, { useRef, useEffect } from 'react';
import Transition from '../../utils/Transition';

function FormDeleteFieldModal({ActionButton, dropdownOpen, setDropdownOpen, deleteFormField, action, selectedFormField, isSelected}) {


  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//         // if (!dropdownOpen || (dropdown && dropdown.current.contains(target)) || (trigger && trigger.current &&trigger.current.contains(target))) return;
//         if (!dropdownOpen || (target.getAttribute("area") === "form-field-delete-modal") || (dropdown && dropdown.current && dropdown.current.contains(target))) return;
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

  
  function handleSubmit(e){
    e.preventDefault();
    try{
        deleteFormField(selectedFormField.id);
        setDropdownOpen(false);
    }
    catch(err){
        alert(err);
    }
  }

  return (
    <div className="relative inline-flex ml-3">
      
        <ActionButton innerRef={trigger}/>

        {(isSelected===true && (action==="delete"))
        ?
        <Transition
            className="origin-top-right z-10 absolute right-0 bottom-0 sm:mr-0 min-w-80 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden"
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
                className="px-3"
            >
                <div className="pb-2 flex">
                    <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5">Are you sure?</div>
                </div>
                <div>
                    The form field <b>{selectedFormField.name}</b> will be deleted from the list
                </div>
            
                <div className="flex align-center justify-center mt-3">
                    <button 
                        className="btn py-1 px-2 text-xs font-medium rounded-full bg-red-500 hover:bg-red-600 text-white mx-2" 
                        aria-haspopup="true"
                        onClick={handleSubmit}
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => {setDropdownOpen(false);}}
                        className="btn py-1 px-2 text-xs font-medium rounded-full bg-slate-400 hover:bg-slate-500 text-white mx-2" 
                        aria-haspopup="true"
                        type="button"
                    >
                        Cancel
                    </button>
                </div>
            
            </div>
        </Transition>
        :
        <></>
        }
    </div>
  )
}

export default FormDeleteFieldModal;