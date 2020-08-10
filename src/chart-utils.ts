export function getFirstOfTheMonthEntriesWhileNullingOutOtherDates(datesList: Array<string>) : Array<string> {
    const list_of_months : any = {}
    let filtered_x_data = datesList.map((x) => {
        let _ : Date = new Date(x + "T00:00:00.000-05:00");

        let month_prefix : string = _.getUTCMonth() < 9 ? '0' : '';
        let _month : string = month_prefix + (_.getUTCMonth() + 1);

        let _year : number = _.getFullYear();
        let _key : string = _year + "-" + _month;

        if (list_of_months[_key]) {
            return ""
        }
        list_of_months[_key] = true;
        return _key

    });
    return filtered_x_data
}



export function removeMonthsTooCloseToEachOther(minMonthsGap : number, monthsArray : Array<string>) {
    let currentGapCount : number | null = null;
    let lastMatchLocation : number | null = null
    for (let i = 0; i < monthsArray.length  ; i++) {

        if (monthsArray[i]) {
            if (i===0){
                lastMatchLocation = 0;
                currentGapCount = 0;
                continue;
            }

            if (currentGapCount < minMonthsGap){
                monthsArray[lastMatchLocation] = "";
            }

            lastMatchLocation = i;
            currentGapCount = 0;




        }
        else {
            currentGapCount +=1
        }
      }
      return monthsArray
}
