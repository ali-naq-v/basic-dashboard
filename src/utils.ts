export function getLastEntries(thisArray : Array<any>, numberOfEntries : number) : Array<any> {
    return thisArray.slice(Math.max(thisArray.length - numberOfEntries, 0));
}


export function roundThis(int : number, numberOfDecimals: number) : number {
    return Number((int).toFixed(numberOfDecimals));
}
