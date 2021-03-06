import CovidChart from './_old_charting.js'

function fetchCovidData() {

    const endpoint = window.encodeURI(`http://192.168.1.51:3000/covid/`);
    
    return fetch(endpoint)
        .then(res =>
            res.json()
        )
        .then((data) => {
            if (!data[0]) {

                console.log("WTF NOTHONG THERE IDIOT!!!")
            }
            console.log("okay returning some data i think")
            return data
        }

        )
}


const mainSection = document.querySelector('.coral');

function displayCovidData() {
    let reportDateArray = []
    let testsCompleted = []
    let confirmedPositiveCovidPercentageOfTest = []
    let covidInHospital = [];
    let confirmedPositiveDoubling = [];
    let confirmedDeathsDoubling = [];

    // function renderData(data) {
    //     return `<h1> ${data[0]["Reported Date"]} </h1>`;
    // }

    fetchCovidData().then((data) => {
        console.log(data);

        data.map((entry) => {
            const _testCompleted = entry["Total tests completed in the last day"];
            const confirmedPositive = entry["Confirmed Positive"];
            const hospitalCovid = entry["Number of patients hospitalized with COVID-19"];
            const _confirmedPositiveDoubling = entry["Number of Days for Cumulative Confirmed Positive to Double"];
            const _confirmedDeathsDoubling = entry["Number of Days for Deaths to Double"];


            const oneDaysPercentagePositiveResults = _testCompleted === 0 || _testCompleted == null ? null : roundThis((confirmedPositive / _testCompleted) * 100, 2);
            confirmedPositiveCovidPercentageOfTest.push(oneDaysPercentagePositiveResults);
            testsCompleted.push(_testCompleted / 1000);
            covidInHospital.push(hospitalCovid);
            reportDateArray.push(entry["Reported Date"]);
            confirmedPositiveDoubling.push(_confirmedPositiveDoubling);
            confirmedDeathsDoubling.push(_confirmedDeathsDoubling);

        });
        const last_x_days = 55;
        reportDateArray = getLastEntries(reportDateArray, last_x_days);
        testsCompleted = getLastEntries(testsCompleted, last_x_days);
        confirmedPositiveCovidPercentageOfTest = getLastEntries(confirmedPositiveCovidPercentageOfTest, last_x_days);
        covidInHospital = getLastEntries(covidInHospital, last_x_days);
        confirmedPositiveDoubling = getLastEntries(confirmedPositiveDoubling, last_x_days);
        confirmedDeathsDoubling = getLastEntries(confirmedDeathsDoubling, last_x_days);


        CovidChart("chart", reportDateArray, testsCompleted, "# of Tests Completed (in '000's)");
        CovidChart("chart2", reportDateArray, confirmedPositiveCovidPercentageOfTest, "Positive Covid Test Results (in %'s)");

        CovidChart("chart3", reportDateArray, covidInHospital, "# of Patients in Hospital");
        CovidChart("chart4", reportDateArray, confirmedPositiveDoubling, "# of Days for Positive Cases To Double"); 
        CovidChart("chart5", reportDateArray, confirmedPositiveDoubling, "# of Days for Deaths To Double"); 

        // const html = renderData(data);
        // mainSection.insertAdjacentHTML('beforeend', html);

    }
    );
}
function getLastEntries(thisArray, x) {
    console.log("mother father");
    return thisArray.slice(Math.max(thisArray.length - x, 0));
}


function roundThis(int) {
    return Number((int).toFixed(2));
}

displayCovidData();