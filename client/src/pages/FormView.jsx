import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams, useSearchParams, useNavigate, useLocation} from "react-router-dom";
import nolertNotify from "@nolert/notify";
import FormViewBody from '../partials/formView/Body';
import FormViewHeader from '../partials/formView/Header';
import { getCookie, setCookie } from '../utils/Utils';

const API_URL = import.meta.env.VITE_API_URL;

function FormViewPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams()
    const params = useParams();

    const [form, setForm] = useState({type:"default",loading:true, error:false, data:null});

    useEffect(()=>{
        const success = searchParams.get("success");
        if(success){
            if(success==="true"){
                setForm({...form,type:"success",success:true, loading:false})
            }
            else if(success==="false"){
                setForm({...form,type:"success",success:false, loading:false})
            }
            return;
        }
        else if(!form || !form.data){

            document.title = "Loading...";

            axios.get(`${API_URL}/api/v1/form/${params.id}`)
            .then((response) => {
                document.title = response.data.name;
                setForm({...form,loading:false,data:response.data, success: success==="true", type:success==="true" ? "success" : ""});
    
                if(!getCookie(params.id) || getCookie(params.id) !== "visited"){
                    axios.put(`${API_URL}/api/v1/form/${params.id}/analytics/vc`,{})
                    .then(()=>{
                        setCookie(params.id, "visited");
                    })
                    .catch(()=>{})
                }
    
            })
            .catch(err => {
                document.title = "Not Found";
                setForm({...form,error:true, loading:false});
            });
        }
        else{
            setForm({...form,loading:false,success:false, type:"normal"});
        }

    },[location.search])

    async function handleSubmitResponse(values){
        try{
            // navigateTo(`/form/${form?.data?.id}?success=true`)
            await axios.post(`${API_URL}/api/v1/form/${params.id}/response`,values);
            navigate(`/form/${form?.data?.id}?success=true`);
        }
        catch(err){
            nolertNotify.trigger({
                type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))
            });
            throw err;
        }
    }

    return (
        <div className="h-screen">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden h-full">
                {form.error ?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>The form you are trying to access does not exist.</h3>
                    </div>
                :form.loading?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>Loading...</h3>
                    </div>
                :(!form.success && !form?.data?.active) ?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>This form is currently not accepting responses.</h3>
                    </div>
                :
                    <div>
                        {(!form.loading && form.data?.companyName ) ?<FormViewHeader form={form}/> : <></>}
                        <FormViewBody form={form} submitResponse={handleSubmitResponse}/>
                    </div>
                }
            </div>
        </div>
    );
}

export default FormViewPage;