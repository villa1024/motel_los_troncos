export const timeFormat = (number) => number > 9 ? `${number}` : `0${number}`

export const moneyFormat = (number) => `$ ${Math.round(number).toLocaleString("es-CL")}`

export const dateFormat = (date) => `${timeFormat(date.getDate())}/${timeFormat(date.getMonth())}/${date.getFullYear()} ${timeFormat(date.getHours())}:${timeFormat(date.getMinutes())}`