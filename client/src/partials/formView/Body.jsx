import { useEffect, useState } from "react";
import nolertNotify from "@nolert/notify";
import ButtonSpinner from "../../utils/ButtonSpinner";

export default function FormViewBody({form, submitResponse}) {

    const [values, setValues] = useState({});

    useEffect(()=>{
        if(form.data){
            const object = {};
            for(let i=0;i<form.data?.fields?.length;i++){
                object[form.data?.fields[i]?.name] = "";
            }
            setValues({...object})
        }
    },[form])

    const handleChange = (e) => {
        setValues({...values, [e.currentTarget.name]:e.currentTarget.value});
    }
    
    const handleCheckboxChange = (e) => {
        const isChecked = e.currentTarget.checked;
        const value = e.currentTarget.getAttribute("option");

        if(value){
            setValues({
                ...values, 
                [e.currentTarget.name]:
                    isChecked ?
                        (
                            values[e.currentTarget.name]
                            ?
                                [...values[e.currentTarget.name],value]
                            :
                                [value]
                        )
                    :
                        values[e.currentTarget.name].filter(val => val !== value)
            });
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        const btn = e.target.querySelector("button[type=submit]");
        try{

            customValidation(e, values);
            styleSubmitButton(btn, true);
            await submitResponse(values);
        }
        catch(err){
            nolertNotify.trigger({
                type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))
            });
        }
        finally{
            styleSubmitButton(btn, false);
        }
    }

    function customValidation(el, values){
        const elements = el.currentTarget.querySelectorAll("input.custom-validation");
        for(let i=0;i<elements.length;i++){
            const fieldName = elements[i].getAttribute("name");
            const isRequired = form.data?.fields?.find(field => field.name===fieldName)?.required;
            if(isRequired === true || isRequired === "true"){
                if(values[fieldName].length < 1){
                    throw new Error("Please fill all required fields")
                }
            }
        }
    }

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit}>
                <div className="px-4 py-5 sm:px-6 flex align-center justify-between">
                    <div className="w-full">
                        <div className="flex align-center justify-between">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{form.data?.name}</h3>
                            {(form.type!=="success" && form.success!==true) && form?.data?.fields?.length>0 &&
                                <div>
                                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" type="submit">
                                        <ButtonSpinner style={{display:'none',marginRight:"6px"}}/>
                                        <span>Submit</span>
                                    </button>
                                </div>
                            }
                        </div>
                        <hr className="my-3"/>

                        {(form.type==="success" && form.success===true) ?
                            (form.data?.successMessage ?
                                <div className="h-40 flex items-center justify-center">
                                    <h3 className="text text-gray-500" dangerouslySetInnerHTML={{__html: form.data?.successMessage}}></h3>
                                </div>
                            :
                                <div className="h-40 flex items-center justify-center">
                                    <h3 className='text text-gray-500'>Your response has been recorded successfully.</h3>
                                </div>
                            )
                        :
                            <p className="mt-1 w-full text" dangerouslySetInnerHTML={{__html: form.data?.desc}}></p>
                        }
                    </div>
                </div>
                {(form.type!=="success" && form.success!==true) && 
                <div className="border-t border-gray-200">
                    <dl>
                        {form.data?.fields?.map((field,index) => 
                            <div key={field.id} className={`${index%2===0 ? "bg-gray-50" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                <dt className="text-sm font-medium text-gray-500">{field.name}</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <div>
                                        {field.responseFormat === "textarea"
                                        ?
                                            <textarea rows={4} placeholder="Type here..." name={`${field.name}`} id={`${field.id+field.name}`} className="bg-slate-50 border border-blue-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-50 dark:border-stone-400 dark:placeholder-gray-400 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={values[field.name]} onChange={handleChange} required={field.required} style={{background:"#fff"}}></textarea>
                                        :
                                        field.responseType==="select"?
                                        (
                                            (field.select?.type==="text")
                                            ?
                                                <select name={`${field.name}`} id={`${field.id+field.name}`} className="bg-slate-50 border border-blue-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-50 dark:border-stone-400 dark:placeholder-gray-400 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={values[field.name]} onChange={handleChange} required={field.required} style={{background:"#fff"}}>
                                                    <option disabled selected value="">Select one</option>
                                                    {field.select?.options?.map(op => 
                                                        <option key={field.name+op} value={op}>{op}</option>    
                                                    )}
                                                </select>
                                            :
                                            (field.select?.type==="checkbox")
                                            ?
                                                <div className="flex items-center">
                                                    {field.select?.options?.map(op => 
                                                        <div key={field.name+op} className="mr-3">
                                                            <input type="checkbox" id={field.name+op} name={field.name} option={op} checked={values[field.name]?.includes(op)} onChange={handleCheckboxChange} className="custom-validation"/>
                                                            <label htmlFor={field.name+op} className="ml-1">{op}</label>
                                                        </div>  
                                                    )}
                                                </div>
                                            :
                                            (field.select?.type==="radio")
                                            ?
                                                <div className="flex items-center">
                                                    {field.select?.options?.map(op => 
                                                        <div key={field.name+op} className="mr-3">
                                                            <input 
                                                                type="radio" 
                                                                id={field.name+op} 
                                                                name={field.name} 
                                                                checked={values[field.name]?.includes(op)} 
                                                                onChange={()=>handleChange({currentTarget:{name:field.name, value:op}})}
                                                                className="custom-validation"
                                                            />
                                                            <label htmlFor={field.name+op} className="ml-1">{op}</label>
                                                        </div>  
                                                    )}
                                                </div>
                                            :
                                                <></>
                                        )
                                        :
                                            <input type={field.responseFormat} placeholder="Type here..." name={`${field.name}`} id={`${field.id+field.name}`} className="bg-slate-50 border border-blue-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-50 dark:border-stone-400 dark:placeholder-gray-400 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={values[field.name]} onChange={handleChange} required={field.required} style={{background:"#fff"}}/>
                                        }
                                    </div>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>}
            </form>
        </div>
    )
}


function styleSubmitButton(btn, active){
    if(active){
        btn.children[0].style.display="block";
        btn.children[1].textContent="Submitting..."
        btn.disabled = true;
    }
    else{
        btn.children[0].style.display="none";
        btn.children[1].textContent="Submit"
        btn.disabled = false;
    }
}