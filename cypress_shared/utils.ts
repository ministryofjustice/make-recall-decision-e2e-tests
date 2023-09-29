import { DateTime } from 'luxon'

export const exactMatchIgnoreWhitespace = (str: string): RegExp => new RegExp(`^\\s*${str}\\s*$`, 'g')

export const formatIsoDate = (isoDate: string) => DateTime.fromISO(isoDate, { zone: 'utc' }).toFormat('d MMMM yyyy')

export const formatIsoDateShort = (isoDate: string) => DateTime.fromISO(isoDate, { zone: 'utc' }).toFormat('dd/MM/yyyy')

export const longDateMatchPattern = (isoDate: string | null) => {
  return isoDate !== null ? new RegExp(formatIsoDate(isoDate)) : /\d{1,2} [a-zA-Z]* \d{4}/
}

export const replaceMissingNDeliusInfoWithBlank = function (text: string) {
  return text === '-This is information missing from NDelius.' ? '' : text
}
export const replaceMissingNDeliusInfoWithNotSpecified = function (text: string) {
  return text === '-This is information missing from NDelius.' ? 'Not specified' : text
}
