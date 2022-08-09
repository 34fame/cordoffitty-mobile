import useNumbers from 'src/lib/numbers'

const loadingMessages = [
   'Generating witty dialog...',
   'Swapping time and space...',
   'Bending the spoon...',
   "Don't think of purple hippos...",
   'We need a new fuse...',
   'Have a good day.',
   "We're building the buildings as fast as we can",
   'Would you prefer chicken, steak, or tofu?',
   '(Pay no attention to the man behind the curtain)',
   '...and enjoy the elevator music...',
   'Please wait while the little elves draw your map',
   'Would you like fries with that?',
   'Go ahead -- hold your breath!',
   "...at least you're not on hold...",
   'Follow the white rabbit',
   "Why don't you order a sandwich?",
   'Waiting while the satellite moves into position',
   "It's still faster than you could draw it",
   'I should have had a V8 this morning.',
   'My other loading screen is much faster.',
   'Are we there yet?',
   'Just count to 10',
   "It's not you. It's me.",
   'Do you come here often?',
   'Spinning the wheel of fortune...',
   'Loading the enchanted bunny...',
   'Computing chance of success',
   "I'm sorry Dave, I can't do that.",
   'Adjusting flux capacitor...',
   "I swear it's almost done.",
   'Time flies when you’re having fun.',
   'Convincing AI not to turn evil..',
   'Wait, do you smell something burning?',
   'Please hold on as we reheat our coffee',
   'Kindly hold on as we convert this bug to a feature...',
   'Winter is coming...',
   'Loading funny message...',
   'Live long and prosper.',
   'Patience! This is difficult, you know...',
   'Doing the heavy lifting',
]

export default function useMessage() {
   const numbers = useNumbers()

   const loading = () => {
      return loadingMessages[
         numbers.randomNumberBetween(0, loadingMessages.length, false)
      ]
   }

   return { loading }
}
