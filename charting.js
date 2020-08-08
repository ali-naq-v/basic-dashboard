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
