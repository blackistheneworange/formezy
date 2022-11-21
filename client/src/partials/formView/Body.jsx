import { useEffect, useState } from "react";
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

    async function handleSubmit(e){
        e.preventDefault();
        const btn = e.target.querySelector("button[type=submit]");
        try{
            styleSubmitButton(btn, true);
            await submitResponse(values);
        }
        catch(err){
            alert(err);
        }
        finally{
            styleSubmitButton(btn, false);
        }
    }

    useEffect(()=>{console.log(values)},[values])

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit}>
                <div className="px-4 py-5 sm:px-6 flex align-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{form.data?.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{form.data?.desc}</p>
                    </div>
                    {form?.data?.fields?.length>0 &&
                        <div>
                            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" type="submit">
                                <ButtonSpinner style={{display:'none',marginRight:"6px"}}/>
                                <span>Submit</span>
                            </button>
                        </div>
                    }
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        {form.data?.fields?.map((field,index) => 
                            <div key={field.id} className={`${index%2===0 ? "bg-gray-50" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                <dt className="text-sm font-medium text-gray-500">{field.name}</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <div>
                                        <input type={field.responseFormat} placeholder="Type here..." name={`${field.name}`} id={`${field.id+field.name}`} className="bg-slate-50 border border-blue-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-50 dark:border-stone-400 dark:placeholder-gray-400 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={values[field.name]} onChange={handleChange} required={field.required} style={{background:"#fff"}}/>
                                    </div>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
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