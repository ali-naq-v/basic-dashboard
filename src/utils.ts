export function getLastEntries(thisArray : Array<any>, numberOfEntries : number) : Array<any> {
    return thisArray.slice(Math.max(thisArray.length - numberOfEntries, 0));
}


export function roundThis(int : number) : number {
    return Number((int).toFixed(2));
}
