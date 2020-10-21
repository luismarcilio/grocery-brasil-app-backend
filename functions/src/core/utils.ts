
export function parseDate(dateString: string): Date {

    const year = +dateString.split('/')[2];
    const mon = +dateString.split('/')[1] - 1;
    const day = +dateString.split('/')[0];

    return new Date(year, mon, day);
}