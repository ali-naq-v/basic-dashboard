import CovidChart from './charting'
import ChartWithApex from './apex-charting'
import {getLastEntries, roundThis} from './utils'

function fetchCovidData() {

    const endpoint: string = window.encodeURI(`https://nl81s06nk2.execute-api.ca-central-1.amazonaws.com/Prod/covid/`);

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

const mainSection : Element = document.querySelector('.coral');


function displayCovidData() : void {
    let reportDateArray : Array<string> = []
    let testsCompleted : Array<number> = []
    let confirmedPositiveCovidPercentageOfTest : Array<number> = []
    let confirmedPositive : Array<number> = [];
    let covidInHospital : Array<bigint> = [];
    let confirmedPositiveDoubling : Array<bigint> = [];
    let confirmedDeathsDoubling : Array<bigint> = [];



    // function renderData(data) {
    //     return `<h1> ${data[0]["Reported Date"]} </h1>`;
    // }

    fetchCovidData().then((data) => {
        console.log(data);

        data.map((entry : any) => {
            const _testCompleted : number | null = entry["Total tests completed in the last day"];
            const _confirmedPositive : number | null = entry["Confirmed Positive"];
            const hospitalCovid : bigint | null = entry["Number of patients hospitalized with COVID-19"];
            const _confirmedPositiveDoubling : bigint | null = entry["Number of Days for Cumulative Confirmed Positive to Double"];
            const _confirmedDeathsDoubling : bigint | null = entry["Number of Days for Deaths to Double"];


            const oneDaysPercentagePositiveResults : any = _testCompleted === 0 || _testCompleted == null ? null : roundThis((_confirmedPositive / _testCompleted) * 100, 2);
            confirmedPositiveCovidPercentageOfTest.push(oneDaysPercentagePositiveResults);
            confirmedPositive.push(_confirmedPositive);
            testsCompleted.push(_testCompleted / 1000);
            covidInHospital.push(hospitalCovid);
            reportDateArray.push(entry["Reported Date"]);
            confirmedPositiveDoubling.push(_confirmedPositiveDoubling);
            confirmedDeathsDoubling.push(_confirmedDeathsDoubling);

        });
        const last_x_days = 55;
        reportDateArray = getLastEntries(reportDateArray, last_x_days);
        testsCompleted = getLastEntries(testsCompleted, last_x_days);
        confirmedPositive = getLastEntries(confirmedPositive, last_x_days);
        confirmedPositiveCovidPercentageOfTest = getLastEntries(confirmedPositiveCovidPercentageOfTest, last_x_days);
        covidInHospital = getLastEntries(covidInHospital, last_x_days);
        confirmedPositiveDoubling = getLastEntries(confirmedPositiveDoubling, last_x_days);
        confirmedDeathsDoubling = getLastEntries(confirmedDeathsDoubling, last_x_days);


        ChartWithApex("#chart6", reportDateArray, testsCompleted, "Tested", "K");
        ChartWithApex("#chart", reportDateArray, confirmedPositive, "Confirmed Positive");
        ChartWithApex("#chart2", reportDateArray, confirmedPositiveCovidPercentageOfTest, "Confirmed Positive Tests ", "%");

        ChartWithApex("#chart3", reportDateArray, covidInHospital, "Hospitalizations");
        ChartWithApex("#chart4", reportDateArray, confirmedPositiveDoubling, "Days To Double Infections"); 
        ChartWithApex("#chart5", reportDateArray, confirmedPositiveDoubling, "Days To Double Deaths"); 
        // ChartWithApex("#chart7", reportDateArray, confirmedPositive, "# of Active Positive Covid Cases" );

        // const html = renderData(data);
        // mainSection.insertAdjacentHTML('beforeend', html);

    }
    );
}

// function getLastEntries(thisArray : Array<any>, numberOfEntries : number) : Array<any> {
//     return thisArray.slice(Math.max(thisArray.length - numberOfEntries, 0));
// }


// function roundThis(int : number) : number {
//     return Number((int).toFixed(2));
// }

displayCovidData();