import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams, useSearchParams} from "react-router-dom";
import FormViewBody from '../partials/formView/Body';
import FormViewHeader from '../partials/formView/Header';
import Notifications from '../partials/header/Notifications';
import { getCookie, setCookie } from '../utils/Utils';

const API_URL = import.meta.env.VITE_API_URL;

function FormViewPage() {

    const [searchParams] = useSearchParams()
    const params = useParams();

    const [form, setForm] = useState({type:"default",loading:true, error:false, data:null});
    const [notification, setNotification] = useState({type:"success",message:null});

    useEffect(()=>{
        const success = searchParams.get("success");
        if(success){
            if(success==="true"){
                setForm({...form,type:"success",success:true})
            }
            else if(success==="false"){
                setForm({...form,type:"success",success:false})
            }
            return;
        }

        document.title = "Loading...";

        axios.get(`${API_URL}/api/v1/form/${params.id}`)
        .then((response) => {
            document.title = response.data.name;
            setForm({...form,loading:false,data:response.data});

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
    },[])

    async function handleSubmitResponse(values){
        setNotification({type:"success",message:null});
        try{
            // navigateTo(`/form/${form?.data?.id}?success=true`)
            await axios.post(`${API_URL}/api/v1/form/${params.id}/response`,values);
            window.location.href=`/form/${form?.data?.id}?success=true`;
        }
        catch(err){
            setNotification({type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))});
            throw err;
        }
    }

    return (
        <div className="h-screen">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden h-full">
                {(form.type==="success" && form.success===true)
                ?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>Your response has been recorded successfully.</h3>
                    </div>
                :form.error ?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>The form you are trying to access does not exist.</h3>
                    </div>
                :form.loading?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>Loading...</h3>
                    </div>
                :!form?.data?.active ?
                    <div className="flex justify-center w-full h-full">
                        <h3 className='self-center'>This form is currently not accepting responses.</h3>
                    </div>
                :
                    <div>
                        {(!form.loading && form.data.companyName ) ?<FormViewHeader form={form}/> : <></>}
                        <FormViewBody form={form} submitResponse={handleSubmitResponse}/>
                    </div>
                }
            </div>

            <Notifications type={notification.type} message={notification.message} setNotification={setNotification} timeout={3000}/>
        </div>
    );
}

export default FormViewPage;