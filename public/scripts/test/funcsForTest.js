function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
}

function datesHaveIntersection(iterEvDate, date) {
    let iterEvDateStart = new Date(iterEvDate.dateStart).getTime();
    let iterEvDateEnd = new Date(iterEvDate.dateEnd).getTime();
    let dateStart = new Date(date.start).getTime();
    let dateEnd = new Date(date.end).getTime();

    return ((iterEvDateStart >= dateStart && iterEvDateStart < dateEnd) || (iterEvDateEnd > dateStart && iterEvDateEnd <= dateEnd)) ||
        ((dateStart >= iterEvDateStart && dateStart < iterEvDateEnd) || (dateEnd > iterEvDateStart && dateEnd <= iterEvDateEnd))
}

function createDateFromParts(date, time) {
    return new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time.slice(0, -2), time.slice(-2), 0);
}