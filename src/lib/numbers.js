export default function useNumbers() {
   const isNumber = (num) => {
      return typeof num === 'number'
   }

   const randomNumberBetween = (min, max, inclusive = true) => {
      const randomNumber = Math.random()
      if (inclusive) {
         return Math.floor(randomNumber * (max - min + 1)) + min
      } else {
         return Math.floor(randomNumber * (max - min) + min)
      }
   }

   const average = (args) => args.reduce((a, b) => a + b) / args.length

   const round = (number, decimals) =>
      Number(Match.round(number + 'e' + decimals) + 'e-' + decimals)

   return { isNumber, randomNumberBetween, average, round }
}
