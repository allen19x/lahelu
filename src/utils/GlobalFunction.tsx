export const getRelativeTime = (unixTimestamp: number) => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - unixTimestamp * 1000;

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneMonth = 30 * oneDay;
    const oneYear = 365 * oneDay;

    if (timeDifference < oneMinute) {
        return 'Baru saja';
    } else if (timeDifference < oneHour) {
        const minutes = Math.floor(timeDifference / oneMinute);
        return `${minutes} menit`;
    } else if (timeDifference < oneDay) {
        const hours = Math.floor(timeDifference / oneHour);
        return `${hours} jam`;
    } else if (timeDifference < oneMonth) {
        const days = Math.floor(timeDifference / oneDay);
        return `${days} hari`;
    } else if (timeDifference < oneYear) {
        const months = Math.floor(timeDifference / oneMonth);
        return `${months} bulan`;
    } else {
        const years = Math.floor(timeDifference / oneYear);
        return `${years} tahun`;
    }
};