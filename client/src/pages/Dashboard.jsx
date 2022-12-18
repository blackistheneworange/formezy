import React, { useEffect, useState } from 'react';
import axios from 'axios';

import nolertNotify from "@nolert/notify";

import { SquaresPlusIcon } from '@heroicons/react/24/outline'

import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import Banner from '../partials/Banner';

//forms
import FormCreateModal from '../partials/form/FormCreateModal';
import FormDisplayCard from '../partials/form/FormDisplayCard';
import FormDeleteModal from '../partials/form/FormDeleteModal';
import FormResponsesViewModal from '../partials/form/FormResponsesViewModal';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {

  const [pageProps, setPageProps] = useState({action:"create"});
  const [searchFilter, setSearchFilter] = useState({
    formName:""
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formCreateModalOpen, setFormCreateModalOpen] = useState(false);
  const [formDeleteModalOpen, setFormDeleteModalOpen] = useState(false);
  const [formResponsesModalOpen, setFormResponsesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [forms, setForms] = useState([]);

  useEffect(()=>{
    (async () => {
      try{
        const {data} = await axios.get(import.meta.env.VITE_API_URL+"/api/v1/form");
        const {data:analytics} = await axios.get(import.meta.env.VITE_API_URL+"/api/v1/form/analytics");

        setForms(data.map(d => 
          ({...d, analytics: analytics.find(an => an.formId === d.id) || {}})
        ));
      }
      catch(err){
        alert(err)
      }
      finally{
        setIsLoading(false);
      }
    })();
  },[])

  function handleToggleEditForm(form){
    setPageProps({...pageProps, action:(!form ? "create" : "edit"), form:form});
    setFormCreateModalOpen(!formCreateModalOpen);
  }
  function handleToggleDeleteForm(form){
    setPageProps({...pageProps, action:(!form ? "create" : "delete"), form:form});
    setFormDeleteModalOpen(!formDeleteModalOpen);
  }

  
  function handleToggleFormResponses(form){
    setPageProps({...pageProps, action:(!form ? "create" : "viewResponse"), form:form});
    setFormResponsesModalOpen(!formResponsesModalOpen);
  }

  async function handleCreateForm(form){
    // setForms([...forms, {...form, id:formId++}]);
    try{
      const {data} = await axios.post(`${API_URL}/api/v1/form`, form);
      nolertNotify.trigger({
        type:"success",message:"Form created successfully"
      });
      setForms([...forms, data]);
    }
    catch(err){
      nolertNotify.trigger({
        type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))
      });
      throw err;
    }
  }
  
  async function handleUpdateForm(form){
    try{
      const {data} = await axios.put(`${API_URL}/api/v1/form/${form.id}`, form);
      nolertNotify.trigger({
        type:"success",message:"Form updated successfully"
      });
      setForms(forms.map(f => f.id === form.id ? {analytics:form.analytics,...data} : f));
      setPageProps({...pageProps, action:"create", form:null});
    }
    catch(err){
      nolertNotify.trigger({
        type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))
      });
      throw err;
    }
  }
  
  async function handleDeleteForm(id){
    try{
      await axios.delete(`${API_URL}/api/v1/form/${id}`);
      nolertNotify.trigger({
        type:"success",message:"Form deleted successfully"
      });
      setForms(forms.filter(f => f.id !== id));
    }
    catch(err){
      nolertNotify.trigger({
        type:"danger",message:(err.response ? err.response?.data?.message : (err.message || err || ""))
      });
      throw err;
    }
    finally{
      setFormDeleteModalOpen(false);
      setPageProps({...pageProps, action:"create", form:null});
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Avatars */}
              {/* <DashboardAvatars /> */}
              
              <div className="relative">
                <label htmlFor="search" className="sr-only">Search</label>
                <input id="search" className="w-full border-0 focus:ring-transparent placeholder-slate-400 appearance-none py-3 pl-10 pr-4" type="search" placeholder="Search using form name..." value={searchFilter.formName} onChange={(e)=>setSearchFilter({...searchFilter, formName:e.target.value})}/>
                <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                  <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-4 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                  </svg>
                </button>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Filter button */}
                {/* <FilterButton /> */}
                {/* Datepicker built with flatpickr */}
                {/* <Datepicker /> */}
                {/* Add view button */}
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-5 sm:mt-0" onClick={(e) => { e.stopPropagation(); setFormCreateModalOpen(true); }}>
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Build form</span>
                </button>                
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {!isLoading && forms.length === 0 ?
                
                <div className="col-span-full sm:col-span-12 xl:col-span-12">
                  <div className="container m-auto space-y-8 px-6 py-16 sm:w-full md:w-1/2 text-black-500 bg-white rounded-md">
                    <div className="flex items-center justify-center -space-x-2">
                    <SquaresPlusIcon className="h-14 w-14"/>
                    </div>
                    <div className="m-auto space-y-6 md:w-10/12">
                      <h1 className="text-center text-4xl font-bold">BUILD YOUR FIRST FORM NOW</h1>
                      <div className="flex flex-wrap justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setFormCreateModalOpen(true); }}
                            className="relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200 before:bg-indigo-500 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-indigo-500 sm:w-max"
                          >
                            <span className="relative text-base font-semibold text-primary dark:text-white">Get Started</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
  
              :
              forms
              .filter(form => 
                (searchFilter.formName === "" || form.name.toLowerCase().startsWith(searchFilter.formName.toLowerCase()))
              )
              .sort((a,b) => b.created > a.created ? 1 : -1)
              .map(form => (
                <FormDisplayCard 
                  form={form} 
                  key={form.id}
                  toggleEditForm={handleToggleEditForm}
                  toggleDeleteForm={handleToggleDeleteForm}
                  toggleFormResponses={handleToggleFormResponses}
                />
              ))}
              {/* Line chart (Acme Advanced) */}
              {/* <DashboardCard02 /> */}
              {/* Line chart (Acme Professional) */}
              {/* <DashboardCard03 /> */}
              {/* Bar chart (Direct vs Indirect) */}
              {/* <DashboardCard04 /> */}
              {/* Line chart (Real Time Value) */}
              {/* <DashboardCard05 /> */}
              {/* Doughnut chart (Top Countries) */}
              {/* <DashboardCard06 /> */}
              {/* Table (Top Channels) */}
              {/* <DashboardCard07 /> */}
              {/* Line chart (Sales Over Time) */}
              {/* <DashboardCard08 /> */}
              {/* Stacked bar chart (Sales VS Refunds) */}
              {/* <DashboardCard09 /> */}
              {/* Card (Customers) */}
              {/* <DashboardCard10 /> */}
              {/* Card (Reasons for Refunds) */}
              {/* <DashboardCard11 /> */}
              {/* Card (Recent Activity) */}
              {/* <DashboardCard12 /> */}
              {/* Card (Income/Expenses) */}
              {/* <DashboardCard13 /> */}
              
            </div>

          </div>
        </main>

        <Banner />
        
        <FormCreateModal toggleForm={handleToggleEditForm} id="form-create-modal" modalOpen={formCreateModalOpen} setModalOpen={setFormCreateModalOpen} createForm={handleCreateForm} updateForm={handleUpdateForm} action={pageProps.action} selectedForm={pageProps.form}/>

        <FormDeleteModal toggleForm={handleToggleDeleteForm} modalOpen={formDeleteModalOpen} setModalOpen={setFormDeleteModalOpen} selectedForm={pageProps.form} deleteForm={handleDeleteForm}/>

        <FormResponsesViewModal toggleFormResponses={handleToggleFormResponses} modalOpen={formResponsesModalOpen} setModalOpen={setFormResponsesModalOpen} selectedForm={pageProps.form}/>
      </div>
    </div>
  );
}

export default Dashboard;