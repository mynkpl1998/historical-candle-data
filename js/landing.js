let exportTable = undefined;

function fetchDataV1() {

    var key = null;
    var reason;
    var result;

    /* Clear Existing content */
    const tbody  = document.querySelector("#candle_table tbody");
    tbody.innerHTML = ""
    
    t = document.getElementById("status_code_text");
    t.style.visibility = 'hidden'

    t = document.getElementById("status_code");
    t.style.visibility = 'hidden'
    
    t = document.getElementById("req_message");
    t.style.visibility = 'hidden'
    

    //t = document.getElementById("api_url");
    //t.style.visibility = 'hidden'

    //t = document.getElementById("api_endpoint_text");
    //t.style.visibility = 'hidden'

    

    /* Get Key */
    r = validateInstrumentKey(document.getElementById("instrument_key").value)
    reason = r[1]
    result = r[0]

    if (result == false) {
        t = document.getElementById("form_validation_text")
        t.innerHTML = reason;
        return;
    }
    key = document.getElementById("instrument_key").value;
    const origKey = document.getElementById("instrument_key").value;
    key = key.replace("|", "%7C")
    console.log(key)

    /* Get Interval */
    interval = document.getElementById("interval_dropdown").value
    console.log(interval)
    
    /* Start Date */
    r = validateStartDate(document.getElementById("startDate").value)
    reason = r[1]
    result = r[0]

    if (!result) {
        t = document.getElementById("form_validation_text")
        t.innerHTML = reason;
        return;
    }
    startDate = document.getElementById("startDate").value
    console.log(startDate)


    /* End Date */
    r = validateEndDate(startDate, document.getElementById("enddate").value)
    reason = r[1]
    result = r[0]

    if (!result) {
        t = document.getElementById("form_validation_text")
        t.innerHTML = reason;
        return;
    }
    endDate = document.getElementById("enddate").value
    console.log(endDate)

    if(result) {
        t = document.getElementById("form_validation_text")
        t.innerHTML = "";
    }

    /* Print API */
    const url = `https://api.upstox.com/v2/historical-candle/${key}/${interval}/${endDate}/${startDate}`
    const api_url = `API Endpoint: ${url}`

    t = document.getElementById("api_endpoint_text")
    t.style.visibility = 'visible';

    t = document.getElementById("api_url")
    t.innerHTML = url;
    t.style.color = 'blue'
    t.style.visibility = 'visible'
    

    const headers = {
        'Accept': 'application/json'
    };
    

    /* Hit API */
    let status_code;
    

    window.axios.get(url, { headers })
    .then(response => {
        // Do something with the response data (e.g., print it)
        console.log(response);
        status_code = response.status;
        
        t = document.getElementById("status_code_text");
        t.style.visibility = 'visible'

        t = document.getElementById("status_code");
        t.innerHTML = `${status_code}`
        t.style.color = 'green'
        t.style.visibility = 'visible'

        t = document.getElementById("req_message");
        t.innerHTML = `${response.data.status}`
        t.style.color = 'green'
        t.style.visibility = 'visible'

        let data = response.data.data.candles;
        table = document.getElementById("candle_table").getElementsByTagName('tbody')[0]
        data.forEach(element => {
            const newRow = table.insertRow();
            element.forEach(col => {
                const cell = newRow.insertCell();
                cell.textContent = col
            })
        });

        t = document.getElementById("num_table_entries");
        t.innerHTML = table.rows.length - 1;
        const fileName = `${origKey}_${interval}_period_${startDate}_${endDate}.csv`
        delete exportTable;
        exportTable = export_to_csv(fileName);

    })
    .catch(error => {
        console.log(error)
        status_code = error.response.status
        
        t = document.getElementById("status_code_text");
        t.style.visibility = 'visible'

        t = document.getElementById("status_code");
        t.innerHTML = `${status_code}`
        t.style.color = 'red'
        t.style.visibility = 'visible'

        t = document.getElementById("req_message");
        t.innerHTML = `${error.message}`
        t.style.color = 'red'
        t.style.visibility = 'visible'

        t = document.getElementById("num_table_entries");
        t.innerHTML = table.rows.length - 1;
        t.style.visibility = 'visible'
    });
    
}

function validateInstrumentKey(key) {

    if (key.length == 0) {
        return [false, "Instrument key is empty."]
    }
    return [true, "success"]
}

function validateStartDate(date) {
    if (date.length == 0) {
        return [false, "Please select a Start date."]
    }
    return [true, "success"]
}

function validateEndDate(startDate, endDate) {
    if (endDate.length == 0) {
        return [false, "Please select a End date."]
    }

    let startDate_obj = new Date(startDate);
    let endDate_obj = new Date(endDate);
    if(endDate_obj < startDate_obj) {
        return [false, "Start Date must be less than End date."]
    }

    return [true, "success"]
}

function export_to_csv(csvFileName) {
    table = document.getElementById("candle_table");
    return window.tableexport.TableExport(table, csvFileName)
}

fetchBtn = document.getElementById("fetch_btn");
fetchBtn.addEventListener("click", fetchDataV1);
