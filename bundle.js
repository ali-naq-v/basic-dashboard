(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CovidChart(htmlTagId, x_labels, y_data, chart_title) {
    var filtered_x_data = getFirstOfTheMonthEntriesWhileNullingOutOtherDates(x_labels);
    filtered_x_data = removeMonthsTooCloseToEachOther(25, filtered_x_data);
    var ctx = document.getElementById(htmlTagId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filtered_x_data,
            datasets: [{
                    label: chart_title,
                    data: y_data,
                    backgroundColor: '#778DA9',
                    borderColor: '#778DA9',
                    pointRadius: 1,
                    borderWidth: 1,
                    fill: false
                }]
        },
        options: {
            tooltips: {
                mode: 'index',
                titleFontFamily: 'Roboto',
                bodyFontFamily: 'Roboto',
                intersect: true,
                callbacks: {
                    title: function (tooltipItem) {
                        return "Date: " + x_labels[tooltipItem[0].index];
                        // console.log(tooltipItem);
                        // console.log();
                        //   return data['labels'][tooltipItem[0]['index']];
                    }
                }
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: '#D85D4C',
                    fontFamily: 'Roboto'
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: true,
                            fontFamily: 'Roboto',
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                        },
                        color: "#FFFFFF"
                    }],
                xAxes: [{
                        ticks: {
                            autoSkip: false,
                            fontColor: "#FFFFFF",
                            minRotation: 0,
                            maxRotation: 0,
                            fontFamily: 'Roboto',
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                        }
                    }]
            }
        }
    });
}
exports.default = CovidChart;
function getFirstOfTheMonthEntriesWhileNullingOutOtherDates(datesList) {
    var list_of_months = {};
    var filtered_x_data = datesList.map(function (x) {
        var _ = new Date(x + "T00:00:00.000-05:00");
        var month_prefix = _.getUTCMonth() < 9 ? '0' : '';
        var _month = month_prefix + (_.getUTCMonth() + 1);
        var _year = _.getFullYear();
        var _key = _year + "-" + _month;
        if (list_of_months[_key]) {
            return "";
        }
        list_of_months[_key] = true;
        return _key;
    });
    return filtered_x_data;
}
function removeMonthsTooCloseToEachOther(minMonthsGap, monthsArray) {
    var currentGapCount = null;
    var lastMatchLocation = null;
    for (var i = 0; i < monthsArray.length; i++) {
        if (monthsArray[i]) {
            if (i === 0) {
                lastMatchLocation = 0;
                currentGapCount = 0;
                continue;
            }
            if (currentGapCount < minMonthsGap) {
                monthsArray[lastMatchLocation] = "";
            }
            lastMatchLocation = i;
            currentGapCount = 0;
        }
        else {
            currentGapCount += 1;
        }
    }
    return monthsArray;
}

},{}],2:[function(require,module,exports){
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

},{"./charting.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFydGluZy5qcyIsInNjcmlwdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5R0EsNkNBQXNDO0FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUvQixTQUFTLGNBQWM7SUFFbkIsSUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBRTdFLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUNqQixJQUFJLENBQUMsVUFBQSxHQUFHO1FBQ0wsT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQVYs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QyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7UUFFdEgscUJBQVUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQ3BGLHFCQUFVLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSx5QkFBeUIsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1FBQzNHLHFCQUFVLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSx5QkFBeUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRW5HLGlDQUFpQztRQUNqQyxxREFBcUQ7SUFFekQsQ0FBQyxDQUNBLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBc0IsRUFBRSxDQUFVO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0IsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBR0QsU0FBUyxTQUFTLENBQUMsR0FBWTtJQUMzQixPQUFPLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxnQkFBZ0IsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBDb3ZpZENoYXJ0KGh0bWxUYWdJZCwgeF9sYWJlbHMsIHlfZGF0YSwgY2hhcnRfdGl0bGUpIHtcbiAgICB2YXIgZmlsdGVyZWRfeF9kYXRhID0gZ2V0Rmlyc3RPZlRoZU1vbnRoRW50cmllc1doaWxlTnVsbGluZ091dE90aGVyRGF0ZXMoeF9sYWJlbHMpO1xuICAgIGZpbHRlcmVkX3hfZGF0YSA9IHJlbW92ZU1vbnRoc1Rvb0Nsb3NlVG9FYWNoT3RoZXIoMjUsIGZpbHRlcmVkX3hfZGF0YSk7XG4gICAgdmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxUYWdJZCkuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB2YXIgbXlDaGFydCA9IG5ldyBDaGFydChjdHgsIHtcbiAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBsYWJlbHM6IGZpbHRlcmVkX3hfZGF0YSxcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogY2hhcnRfdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHlfZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzc3OERBOScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnIzc3OERBOScsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50UmFkaXVzOiAxLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogZmFsc2VcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0b29sdGlwczoge1xuICAgICAgICAgICAgICAgIG1vZGU6ICdpbmRleCcsXG4gICAgICAgICAgICAgICAgdGl0bGVGb250RmFtaWx5OiAnUm9ib3RvJyxcbiAgICAgICAgICAgICAgICBib2R5Rm9udEZhbWlseTogJ1JvYm90bycsXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZnVuY3Rpb24gKHRvb2x0aXBJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJEYXRlOiBcIiArIHhfbGFiZWxzW3Rvb2x0aXBJdGVtWzBdLmluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRvb2x0aXBJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiBkYXRhWydsYWJlbHMnXVt0b29sdGlwSXRlbVswXVsnaW5kZXgnXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgbW9yZSBzcGVjaWZpYyBmb250IHByb3BlcnR5IG92ZXJyaWRlcyB0aGUgZ2xvYmFsIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIGZvbnRDb2xvcjogJyNEODVENEMnLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxuICAgICAgICAgICAgc2NhbGVzOiB7XG4gICAgICAgICAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bycsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpbmVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwicmdiYSgwLCAwLCAwLCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNGRkZGRkZcIlxuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICB4QXhlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1NraXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRDb2xvcjogXCIjRkZGRkZGXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluUm90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Um90YXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bycsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpbmVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwicmdiYSgwLCAwLCAwLCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb3ZpZENoYXJ0O1xuZnVuY3Rpb24gZ2V0Rmlyc3RPZlRoZU1vbnRoRW50cmllc1doaWxlTnVsbGluZ091dE90aGVyRGF0ZXMoZGF0ZXNMaXN0KSB7XG4gICAgdmFyIGxpc3Rfb2ZfbW9udGhzID0ge307XG4gICAgdmFyIGZpbHRlcmVkX3hfZGF0YSA9IGRhdGVzTGlzdC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIF8gPSBuZXcgRGF0ZSh4ICsgXCJUMDA6MDA6MDAuMDAwLTA1OjAwXCIpO1xuICAgICAgICB2YXIgbW9udGhfcHJlZml4ID0gXy5nZXRVVENNb250aCgpIDwgOSA/ICcwJyA6ICcnO1xuICAgICAgICB2YXIgX21vbnRoID0gbW9udGhfcHJlZml4ICsgKF8uZ2V0VVRDTW9udGgoKSArIDEpO1xuICAgICAgICB2YXIgX3llYXIgPSBfLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBfa2V5ID0gX3llYXIgKyBcIi1cIiArIF9tb250aDtcbiAgICAgICAgaWYgKGxpc3Rfb2ZfbW9udGhzW19rZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBsaXN0X29mX21vbnRoc1tfa2V5XSA9IHRydWU7XG4gICAgICAgIHJldHVybiBfa2V5O1xuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXJlZF94X2RhdGE7XG59XG5mdW5jdGlvbiByZW1vdmVNb250aHNUb29DbG9zZVRvRWFjaE90aGVyKG1pbk1vbnRoc0dhcCwgbW9udGhzQXJyYXkpIHtcbiAgICB2YXIgY3VycmVudEdhcENvdW50ID0gbnVsbDtcbiAgICB2YXIgbGFzdE1hdGNoTG9jYXRpb24gPSBudWxsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9udGhzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG1vbnRoc0FycmF5W2ldKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGxhc3RNYXRjaExvY2F0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjdXJyZW50R2FwQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRHYXBDb3VudCA8IG1pbk1vbnRoc0dhcCkge1xuICAgICAgICAgICAgICAgIG1vbnRoc0FycmF5W2xhc3RNYXRjaExvY2F0aW9uXSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0TWF0Y2hMb2NhdGlvbiA9IGk7XG4gICAgICAgICAgICBjdXJyZW50R2FwQ291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudEdhcENvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vbnRoc0FycmF5O1xufVxuIiwiaW1wb3J0IENvdmlkQ2hhcnQgZnJvbSAnLi9jaGFydGluZy5qcydcbmNvbnNvbGUubG9nKFwiV1RGIEFNSSBFWElTVD8/XCIpO1xuXG5mdW5jdGlvbiBmZXRjaENvdmlkRGF0YSgpIHtcblxuICAgIGNvbnN0IGVuZHBvaW50OiBzdHJpbmcgPSB3aW5kb3cuZW5jb2RlVVJJKGBodHRwOi8vMTkyLjE2OC4xLjUxOjMwMDAvY292aWQvYCk7XG5cbiAgICByZXR1cm4gZmV0Y2goZW5kcG9pbnQpXG4gICAgICAgIC50aGVuKHJlcyA9PlxuICAgICAgICAgICAgcmVzLmpzb24oKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWRhdGFbMF0pIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV1RGIE5PVEhPTkcgVEhFUkUgSURJT1QhISFcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib2theSByZXR1cm5pbmcgc29tZSBkYXRhIGkgdGhpbmtcIilcbiAgICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cblxuICAgICAgICApXG59XG5cbmNvbnN0IG1haW5TZWN0aW9uIDogRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb3JhbCcpO1xuXG5cbmZ1bmN0aW9uIGRpc3BsYXlDb3ZpZERhdGEoKSA6IHZvaWQge1xuICAgIGxldCByZXBvcnREYXRlQXJyYXkgOiBBcnJheTxzdHJpbmc+ID0gW11cbiAgICBsZXQgdGVzdHNDb21wbGV0ZWQgOiBBcnJheTxudW1iZXI+ID0gW11cbiAgICBsZXQgY29uZmlybWVkUG9zaXRpdmVDb3ZpZFBlcmNlbnRhZ2VPZlRlc3QgOiBBcnJheTxudW1iZXI+ID0gW11cbiAgICBsZXQgY292aWRJbkhvc3BpdGFsIDogQXJyYXk8YmlnaW50PiA9IFtdO1xuICAgIGxldCBjb25maXJtZWRQb3NpdGl2ZURvdWJsaW5nIDogQXJyYXk8YmlnaW50PiA9IFtdO1xuICAgIGxldCBjb25maXJtZWREZWF0aHNEb3VibGluZyA6IEFycmF5PGJpZ2ludD4gPSBbXTtcblxuICAgIC8vIGZ1bmN0aW9uIHJlbmRlckRhdGEoZGF0YSkge1xuICAgIC8vICAgICByZXR1cm4gYDxoMT4gJHtkYXRhWzBdW1wiUmVwb3J0ZWQgRGF0ZVwiXX0gPC9oMT5gO1xuICAgIC8vIH1cblxuICAgIGZldGNoQ292aWREYXRhKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICBkYXRhLm1hcCgoZW50cnkgOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IF90ZXN0Q29tcGxldGVkIDogbnVtYmVyIHwgbnVsbCA9IGVudHJ5W1wiVG90YWwgdGVzdHMgY29tcGxldGVkIGluIHRoZSBsYXN0IGRheVwiXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpcm1lZFBvc2l0aXZlIDogbnVtYmVyIHwgbnVsbCA9IGVudHJ5W1wiQ29uZmlybWVkIFBvc2l0aXZlXCJdO1xuICAgICAgICAgICAgY29uc3QgaG9zcGl0YWxDb3ZpZCA6IGJpZ2ludCB8IG51bGwgPSBlbnRyeVtcIk51bWJlciBvZiBwYXRpZW50cyBob3NwaXRhbGl6ZWQgd2l0aCBDT1ZJRC0xOVwiXTtcbiAgICAgICAgICAgIGNvbnN0IF9jb25maXJtZWRQb3NpdGl2ZURvdWJsaW5nIDogYmlnaW50IHwgbnVsbCA9IGVudHJ5W1wiTnVtYmVyIG9mIERheXMgZm9yIEN1bXVsYXRpdmUgQ29uZmlybWVkIFBvc2l0aXZlIHRvIERvdWJsZVwiXTtcbiAgICAgICAgICAgIGNvbnN0IF9jb25maXJtZWREZWF0aHNEb3VibGluZyA6IGJpZ2ludCB8IG51bGwgPSBlbnRyeVtcIk51bWJlciBvZiBEYXlzIGZvciBEZWF0aHMgdG8gRG91YmxlXCJdO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IG9uZURheXNQZXJjZW50YWdlUG9zaXRpdmVSZXN1bHRzIDogYW55ID0gX3Rlc3RDb21wbGV0ZWQgPT09IDAgfHwgX3Rlc3RDb21wbGV0ZWQgPT0gbnVsbCA/IG51bGwgOiByb3VuZFRoaXMoKGNvbmZpcm1lZFBvc2l0aXZlIC8gX3Rlc3RDb21wbGV0ZWQpICogMTAwKTtcbiAgICAgICAgICAgIGNvbmZpcm1lZFBvc2l0aXZlQ292aWRQZXJjZW50YWdlT2ZUZXN0LnB1c2gob25lRGF5c1BlcmNlbnRhZ2VQb3NpdGl2ZVJlc3VsdHMpO1xuICAgICAgICAgICAgdGVzdHNDb21wbGV0ZWQucHVzaChfdGVzdENvbXBsZXRlZCAvIDEwMDApO1xuICAgICAgICAgICAgY292aWRJbkhvc3BpdGFsLnB1c2goaG9zcGl0YWxDb3ZpZCk7XG4gICAgICAgICAgICByZXBvcnREYXRlQXJyYXkucHVzaChlbnRyeVtcIlJlcG9ydGVkIERhdGVcIl0pO1xuICAgICAgICAgICAgY29uZmlybWVkUG9zaXRpdmVEb3VibGluZy5wdXNoKF9jb25maXJtZWRQb3NpdGl2ZURvdWJsaW5nKTtcbiAgICAgICAgICAgIGNvbmZpcm1lZERlYXRoc0RvdWJsaW5nLnB1c2goX2NvbmZpcm1lZERlYXRoc0RvdWJsaW5nKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbGFzdF94X2RheXMgPSA1NTtcbiAgICAgICAgcmVwb3J0RGF0ZUFycmF5ID0gZ2V0TGFzdEVudHJpZXMocmVwb3J0RGF0ZUFycmF5LCBsYXN0X3hfZGF5cyk7XG4gICAgICAgIHRlc3RzQ29tcGxldGVkID0gZ2V0TGFzdEVudHJpZXModGVzdHNDb21wbGV0ZWQsIGxhc3RfeF9kYXlzKTtcbiAgICAgICAgY29uZmlybWVkUG9zaXRpdmVDb3ZpZFBlcmNlbnRhZ2VPZlRlc3QgPSBnZXRMYXN0RW50cmllcyhjb25maXJtZWRQb3NpdGl2ZUNvdmlkUGVyY2VudGFnZU9mVGVzdCwgbGFzdF94X2RheXMpO1xuICAgICAgICBjb3ZpZEluSG9zcGl0YWwgPSBnZXRMYXN0RW50cmllcyhjb3ZpZEluSG9zcGl0YWwsIGxhc3RfeF9kYXlzKTtcbiAgICAgICAgY29uZmlybWVkUG9zaXRpdmVEb3VibGluZyA9IGdldExhc3RFbnRyaWVzKGNvbmZpcm1lZFBvc2l0aXZlRG91YmxpbmcsIGxhc3RfeF9kYXlzKTtcbiAgICAgICAgY29uZmlybWVkRGVhdGhzRG91YmxpbmcgPSBnZXRMYXN0RW50cmllcyhjb25maXJtZWREZWF0aHNEb3VibGluZywgbGFzdF94X2RheXMpO1xuXG5cbiAgICAgICAgQ292aWRDaGFydChcImNoYXJ0XCIsIHJlcG9ydERhdGVBcnJheSwgdGVzdHNDb21wbGV0ZWQsIFwiIyBvZiBUZXN0cyBDb21wbGV0ZWQgKGluICcwMDAncylcIik7XG4gICAgICAgIENvdmlkQ2hhcnQoXCJjaGFydDJcIiwgcmVwb3J0RGF0ZUFycmF5LCBjb25maXJtZWRQb3NpdGl2ZUNvdmlkUGVyY2VudGFnZU9mVGVzdCwgXCJQb3NpdGl2ZSBDb3ZpZCBUZXN0IFJlc3VsdHMgKGluICUncylcIik7XG5cbiAgICAgICAgQ292aWRDaGFydChcImNoYXJ0M1wiLCByZXBvcnREYXRlQXJyYXksIGNvdmlkSW5Ib3NwaXRhbCwgXCIjIG9mIFBhdGllbnRzIGluIEhvc3BpdGFsXCIpO1xuICAgICAgICBDb3ZpZENoYXJ0KFwiY2hhcnQ0XCIsIHJlcG9ydERhdGVBcnJheSwgY29uZmlybWVkUG9zaXRpdmVEb3VibGluZywgXCIjIG9mIERheXMgZm9yIFBvc2l0aXZlIENhc2VzIFRvIERvdWJsZVwiKTsgXG4gICAgICAgIENvdmlkQ2hhcnQoXCJjaGFydDVcIiwgcmVwb3J0RGF0ZUFycmF5LCBjb25maXJtZWRQb3NpdGl2ZURvdWJsaW5nLCBcIiMgb2YgRGF5cyBmb3IgRGVhdGhzIFRvIERvdWJsZVwiKTsgXG5cbiAgICAgICAgLy8gY29uc3QgaHRtbCA9IHJlbmRlckRhdGEoZGF0YSk7XG4gICAgICAgIC8vIG1haW5TZWN0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaHRtbCk7XG5cbiAgICB9XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdEVudHJpZXModGhpc0FycmF5IDogQXJyYXk8YW55PiwgeCA6IG51bWJlcikgOiBBcnJheTxhbnk+IHtcbiAgICBjb25zb2xlLmxvZyhcIm1vdGhlciBmYXRoZXJcIik7XG4gICAgcmV0dXJuIHRoaXNBcnJheS5zbGljZShNYXRoLm1heCh0aGlzQXJyYXkubGVuZ3RoIC0geCwgMCkpO1xufVxuXG5cbmZ1bmN0aW9uIHJvdW5kVGhpcyhpbnQgOiBudW1iZXIpIDogbnVtYmVyIHtcbiAgICByZXR1cm4gTnVtYmVyKChpbnQpLnRvRml4ZWQoMikpO1xufVxuXG5kaXNwbGF5Q292aWREYXRhKCk7Il19
