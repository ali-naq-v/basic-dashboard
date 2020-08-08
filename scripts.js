"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var charting_js_1 = require("./charting.js");
console.log("WTF AMI EXIST??");
function fetchCovidData() {
    var endpoint = window.encodeURI("http://192.168.1.51:3000/covid/");
    return fetch(endpoint)
        .then(function (res) {
        return res.json();
    })
        .then(function (data) {
        if (!data[0]) {
            console.log("WTF NOTHONG THERE IDIOT!!!");
        }
        console.log("okay returning some data i think");
        return data;
    });
}
var mainSection = document.querySelector('.coral');
function displayCovidData() {
    var reportDateArray = [];
    var testsCompleted = [];
    var confirmedPositiveCovidPercentageOfTest = [];
    var covidInHospital = [];
    var confirmedPositiveDoubling = [];
    var confirmedDeathsDoubling = [];
    // function renderData(data) {
    //     return `<h1> ${data[0]["Reported Date"]} </h1>`;
    // }
    fetchCovidData().then(function (data) {
        console.log(data);
        data.map(function (entry) {
            var _testCompleted = entry["Total tests completed in the last day"];
            var confirmedPositive = entry["Confirmed Positive"];
            var hospitalCovid = entry["Number of patients hospitalized with COVID-19"];
            var _confirmedPositiveDoubling = entry["Number of Days for Cumulative Confirmed Positive to Double"];
            var _confirmedDeathsDoubling = entry["Number of Days for Deaths to Double"];
            var oneDaysPercentagePositiveResults = _testCompleted === 0 || _testCompleted == null ? null : roundThis((confirmedPositive / _testCompleted) * 100);
            confirmedPositiveCovidPercentageOfTest.push(oneDaysPercentagePositiveResults);
            testsCompleted.push(_testCompleted / 1000);
            covidInHospital.push(hospitalCovid);
            reportDateArray.push(entry["Reported Date"]);
            confirmedPositiveDoubling.push(_confirmedPositiveDoubling);
            confirmedDeathsDoubling.push(_confirmedDeathsDoubling);
        });
        var last_x_days = 55;
        reportDateArray = getLastEntries(reportDateArray, last_x_days);
        testsCompleted = getLastEntries(testsCompleted, last_x_days);
        confirmedPositiveCovidPercentageOfTest = getLastEntries(confirmedPositiveCovidPercentageOfTest, last_x_days);
        covidInHospital = getLastEntries(covidInHospital, last_x_days);
        confirmedPositiveDoubling = getLastEntries(confirmedPositiveDoubling, last_x_days);
        confirmedDeathsDoubling = getLastEntries(confirmedDeathsDoubling, last_x_days);
        charting_js_1.default("chart", reportDateArray, testsCompleted, "# of Tests Completed (in '000's)");
        charting_js_1.default("chart2", reportDateArray, confirmedPositiveCovidPercentageOfTest, "Positive Covid Test Results (in %'s)");
        charting_js_1.default("chart3", reportDateArray, covidInHospital, "# of Patients in Hospital");
        charting_js_1.default("chart4", reportDateArray, confirmedPositiveDoubling, "# of Days for Positive Cases To Double");
        charting_js_1.default("chart5", reportDateArray, confirmedPositiveDoubling, "# of Days for Deaths To Double");
        // const html = renderData(data);
        // mainSection.insertAdjacentHTML('beforeend', html);
    });
}
function getLastEntries(thisArray, x) {
    console.log("mother father");
    return thisArray.slice(Math.max(thisArray.length - x, 0));
}
function roundThis(int) {
    return Number((int).toFixed(2));
}
displayCovidData();
