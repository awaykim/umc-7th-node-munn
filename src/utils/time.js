// 타임존 변환하기 
export const convertTimezone = (date = new Date(), timezoneOffset = 0) => {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); 
  const targetTimeDiff = timezoneOffset * 60 * 60 * 1000; 
    return new Date(utc + targetTimeDiff); 
}

