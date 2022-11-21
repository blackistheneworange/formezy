import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../EditMenu';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function FormDisplayCard({form, toggleEditForm, toggleDeleteForm, toggleFormResponses}) {

  const chartData = {
    labels: [
      '12-01-2020', '01-01-2021', '02-01-2021',
      '03-01-2021', '04-01-2021', '05-01-2021',
      '06-01-2021', '07-01-2021', '08-01-2021',
      '09-01-2021', '10-01-2021', '11-01-2021',
      '12-01-2021', '01-01-2022', '02-01-2022',
      '03-01-2022', '04-01-2022', '05-01-2022',
      '06-01-2022', '07-01-2022', '08-01-2022',
      '09-01-2022', '10-01-2022', '11-01-2022',
      '12-01-2022', '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [
          732, 610, 610, 504, 504, 504, 349,
          349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349,
          252, 423, 622, 470, 532,
        ].map(d => 0),
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        clip: 20,
      },
      // Gray line
      {
        data: [
          532, 532, 532, 404, 404, 314, 314,
          314, 314, 314, 234, 314, 234, 234,
          314, 314, 314, 388, 314, 202, 202,
          202, 202, 314, 720, 642,
        ].map(d => 0),
        borderColor: tailwindConfig().theme.colors.slate[300],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.slate[300],
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <div style={{height:'200px',overflowY:'auto'}} className="px-5 pt-5">
        <header className="flex justify-between items-start mb-0">
          {/* Icon */}
          {/* <img src={Icon} width="32" height="32" alt="Icon 01" /> */}
          {form.active?
            <div className="text-sm font-semibold text-white px-1.5 bg-green-500 rounded-full">Active</div>
            :
            <div className="text-sm font-semibold text-white px-1.5 bg-red-500 rounded-full">Inactive</div>
          }
          {/* Menu button */}
          <EditMenu className="relative inline-flex">
            <li>
              <button className="w-full font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3" onClick={()=>toggleFormResponses(form)}>View Responses</button>
            </li>
            <li>
              <a target="_blank" href={`/form/${form.id}`} className="w-full font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3">Visit Form</a>
            </li>
            <li>
              <button className="w-full font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3" onClick={()=>toggleEditForm(form)}>Edit</button>
            </li>
            <li>
              <button className="w-full font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" onClick={()=>toggleDeleteForm(form)}>Delete</button>
            </li>
          </EditMenu>
        </header>
        <div>
          {form?.companyName ?
            <div className="text-xs font-semibold text-slate-400 mb-1">
              {form.companyName}
            </div>
          :
            <></>
          }
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
              {form.name}
          </h2>
          <div className="text-xs font-semibold text-slate-500 mb-1">{form.desc}</div>
          {/* <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 mr-2">Entries: 0</div>
            <div className="text-sm font-semibold text-white px-1.5 bg-green-500 rounded-full">+49%</div>
          </div> */}
        </div>
      </div>
      <hr/>
      {/* Chart built with Chart.js 3 */}
      <div className="grow px-5 py-2">
        {/* Change the height attribute to adjust the chart height */}
        <div className="flex align-center justify-between w-100">
          <div className="w-1/3 flex justify-center align-center">
            <div className="text-center">
              <h2 className="text-md font-semibold text-slate-800">Fields</h2>
              <p className="text-lg text-slate-800">{form?.fields?.length}</p>
            </div>
          </div>
          <div className="border-r-2"></div>
          <div className="w-1/3 flex justify-center align-center">
            <div className="text-center">
              <h2 className="text-md font-semibold text-slate-800">Responses</h2>
              <p className="text-lg text-slate-800">{form?.analytics?.recordedResponsesCount || "-"}</p>
            </div>
          </div>
          <div className="border-r-2"></div>
          <div className="w-1/3 flex justify-center align-center">
            <div className="text-center">
              <h2 className="text-md font-semibold text-slate-800">Visitors</h2>
              <p className="text-lg text-slate-800">{form?.analytics?.uniqueVisitorCount || "-"}</p>
            </div>
          </div>
        </div>
        {/* <LineChart data={chartData} width={389} height={128} /> */}
      </div>
    </div>
  );
}

export default FormDisplayCard;
