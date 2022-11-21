import resolveConfig from 'tailwindcss/resolveConfig';

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig('./src/css/tailwind.config.js')
}

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const capitalWord = (value) => {
  if(!value) return "";
  return `${value.charAt(0).toUpperCase()}${value.slice(1,value.length)}`
}

export const setCookie = (cname, cvalue, exdays) => {
  if(exdays){
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  else{
    document.cookie = cname + "=" + cvalue + ";path=/";
  }
}

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export const tableToCSV = (tableId) => {
 
  // Variable to store the final csv data
  let csv_data = [];

  // Get each row data
  const rows = document.querySelectorAll(`#${tableId} tr`);
  for (let i = 0; i < rows.length; i++) {

      // Get each column data
      let cols = rows[i].querySelectorAll('td,th');

      // Stores each csv row data
      let csvrow = [];
      for (let j = 0; j < cols.length; j++) {

          // Get the text data of each cell of
          // a row and push it to csvrow
          csvrow.push(cols[j].textContent);
      }

      // Combine each column value with comma
      csv_data.push(csvrow.join(","));
  }
  // combine each row data with new line character
  csv_data = csv_data.join('\n');

  return csv_data;
}

export const downloadCSVFile = (csv_data, fileName) => {
 
  // Create CSV file object and feed our
  // csv_data into it
  const CSVFile = new Blob([csv_data], { type: "text/csv" });

  // Create to temporary link to initiate
  // download process
  let temp_link = document.createElement('a');

  // Download csv file
  temp_link.download = `${fileName}.csv`
  let url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}