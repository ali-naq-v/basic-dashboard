// import CovidChart from './charting'
import ChartWithApex from "./apex-charting";
import { getLastEntries, roundThis } from "./utils";

function fetchCovidData() {
  const endpoint: string = window.encodeURI(
    `https://nl81s06nk2.execute-api.ca-central-1.amazonaws.com/Prod/covid/`
  );

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data[0]) {
        console.log("WTF NOTHONG THERE IDIOT!!!");
      }
      // console.log("okay returning some data i think")
      return data;
    });
}

const mainSection: Element = document.querySelector(".coral");

function displayCovidData(): void {
  let reportDateArray: Array<string> = [];
  let testsCompleted: Array<number> = [];
  let confirmedPositiveCovidPercentageOfTest: Array<number> = [];
  let confirmedPositive: Array<number> = [];
  let covidInHospital: Array<bigint> = [];
  let confirmedPositiveDoubling: Array<bigint> = [];
  let confirmedDeathsDoubling: Array<bigint> = [];
  let covidICU: Array<bigint> = [];
  let covidICUWithVentilator: Array<bigint> = [];


  fetchCovidData().then((data) => {
    // console.log(data);

    data.map((entry: any) => {
      const _testCompleted: number | null =
        entry["Total tests completed in the last day"];
      const _confirmedPositive: number | null = entry["Confirmed Positive"];
      const _dailyConfirmedPositive: number | null =
        entry["Daily Confirmed Positive"];
      const hospitalCovid: bigint | null =
        entry["Number of patients hospitalized with COVID-19"];
      const _confirmedPositiveDoubling: bigint | null =
        entry["Number of Days for Cumulative Confirmed Positive to Double"];
      const _confirmedDeathsDoubling: bigint | null =
        entry["Number of Days for Deaths to Double"];
      const _covidICU: bigint | null =
        entry["Number of patients in ICU due to COVID-19"];
      const _covidICUWithVentilator: bigint | null =
        entry["Number of patients in ICU on a ventilator due to COVID-19"];

      const oneDaysPercentagePositiveResults: any =
        _testCompleted === 0 || _testCompleted == null
          ? null
          : roundThis((_dailyConfirmedPositive / _testCompleted) * 100, 2);
      confirmedPositiveCovidPercentageOfTest.push(
        oneDaysPercentagePositiveResults
      );
      confirmedPositive.push(_confirmedPositive);
      testsCompleted.push(_testCompleted / 1000);
      covidInHospital.push(hospitalCovid);
      reportDateArray.push(entry["Reported Date"]);
      confirmedPositiveDoubling.push(_confirmedPositiveDoubling);
      confirmedDeathsDoubling.push(_confirmedDeathsDoubling);
      covidICU.push(_covidICU);
      covidICUWithVentilator.push(_covidICUWithVentilator);
    });
    const last_x_days = 55;
    reportDateArray = getLastEntries(reportDateArray, last_x_days);
    testsCompleted = getLastEntries(testsCompleted, last_x_days);
    confirmedPositive = getLastEntries(confirmedPositive, last_x_days);
    confirmedPositiveCovidPercentageOfTest = getLastEntries(
      confirmedPositiveCovidPercentageOfTest,
      last_x_days
    );
    covidInHospital = getLastEntries(covidInHospital, last_x_days);
    confirmedPositiveDoubling = getLastEntries(
      confirmedPositiveDoubling,
      last_x_days
    );
    confirmedDeathsDoubling = getLastEntries(
      confirmedDeathsDoubling,
      last_x_days
    );
    covidICU = getLastEntries(
      covidICU,
      last_x_days
    );
    covidICUWithVentilator = getLastEntries(
      covidICUWithVentilator,
      last_x_days
    );

    document.querySelector("#loading").classList.add("hidden");

    setTemplate("#ontario-chart");
    setUpdatedDate(reportDateArray);

    ChartWithApex("#chart6", reportDateArray, testsCompleted, "Tested", "K");
    ChartWithApex(
      "#chart",
      reportDateArray,
      confirmedPositive,
      "Confirmed Positive"
    );
    ChartWithApex(
      "#chart2",
      reportDateArray,
      confirmedPositiveCovidPercentageOfTest,
      "Percent Positivity",
      "%"
    );

    ChartWithApex(
      "#chart3",
      reportDateArray,
      covidInHospital,
      "Hospitalizations"
    );
    ChartWithApex(
      "#chart4",
      reportDateArray,
      confirmedPositiveDoubling,
      "Days To Double Infections"
    );
    ChartWithApex(
      "#chart5",
      reportDateArray,
      confirmedDeathsDoubling,
      "Days To Double Deaths"
    );
    ChartWithApex(
      "#chart7",
      reportDateArray,
      covidICU,
      "Covid ICU Patients"
    );
    ChartWithApex(
      "#chart8",
      reportDateArray,
      covidICUWithVentilator,
      "Covid ICU Patients On Ventilator"
    );
  });
}

function setUpdatedDate(reportDateArray: string[]) {
  const dateElement: HTMLElement = document.querySelector("#update-date");
  const lastDate: string = reportDateArray[reportDateArray.length - 1];
  const dateContent = document.createTextNode(
    "Last Updated: " + String(lastDate)
  );
  dateElement.appendChild(dateContent);
}

function setTemplate(templateId: string) {
  if ("content" in document.createElement("template")) {
    // browser supports templating

    const template: HTMLTemplateElement = document.querySelector(templateId);
    const cloned_template = template.content.cloneNode(true);
    const body: HTMLElement = document.getElementsByTagName("main")[0];
    body.appendChild(cloned_template);
  } else {
    console.log("Get a better browser ffs!");
  }
}

displayCovidData();
