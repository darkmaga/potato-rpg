export const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const firstCapital = (str: string) => {
  return str[0].toUpperCase() + str.slice(1, str.length)
}
