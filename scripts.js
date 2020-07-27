import CovidChart from './charting.js'

function fetchCovidData() {

    const endpoint = window.encodeURI(`http://192.168.1.51:3000/covid/`);
    console.log("bro entry");
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

    // function renderData(data) {
    //     return `<h1> ${data[0]["Reported Date"]} </h1>`;
    // }

    fetchCovidData().then((data) => {
        // console.log(data);
        
        data.map((entry) => {
            const _testCompleted = entry["Total tests completed in the last day"];
            const confirmedPositive = entry["Confirmed Positive"];
            
              const oneDaysPercentagePositiveResults = _testCompleted === 0 || _testCompleted == null  ? null : roundThis((confirmedPositive / _testCompleted) * 100);
            //const oneDaysPercentagePositiveResults = (confirmedPositive / _testCompleted) * 100;
             confirmedPositiveCovidPercentageOfTest.push(oneDaysPercentagePositiveResults);
            testsCompleted.push(_testCompleted/1000)
            reportDateArray.push(entry["Reported Date"])
            
        });
        
        reportDateArray = reportDateArray.slice(Math.max(reportDateArray.length - 49,0))
        console.log(reportDateArray);
        testsCompleted = testsCompleted.slice(Math.max(testsCompleted.length - 49,0))
        confirmedPositiveCovidPercentageOfTest = confirmedPositiveCovidPercentageOfTest.slice(Math.max(confirmedPositiveCovidPercentageOfTest.length - 49,0))

        CovidChart("chart", reportDateArray, testsCompleted, "# of Tests Completed (in '000's)"); 
        CovidChart("chart2", reportDateArray, confirmedPositiveCovidPercentageOfTest, "Positive Covid Test Results (in %'s)"); 

        CovidChart("chart3", reportDateArray, testsCompleted, "# of Tests Completed (in '000's)"); 
        CovidChart("chart4", reportDateArray, confirmedPositiveCovidPercentageOfTest, "Positive Covid Test Results (in %'s)"); 
        // const html = renderData(data);
        // mainSection.insertAdjacentHTML('beforeend', html);

    }
    );
}



function roundThis(int) {
    return Number((int).toFixed(2));
}

displayCovidData();