/* ==========================================================================
   ❤️  CONTENT FILE: edit everything personal here  ❤️
   --------------------------------------------------------------------------
   - Change any text between the quotes "like this".
   - Each paragraph of a long message is its own line in a list [ ... ].
   - Keep the commas between items, and don't delete the quotes.
   - Save the file, then refresh the browser to see your changes.
   ========================================================================== */

window.CONTENT = {
  /* ---------- Names ---------- */
  herName: "My Love",          // her name or nickname, e.g. "Ammu", "Princess"
  yourName: "Your Favorite Idiot", // how you sign off

  /* ---------- Browser tab title ---------- */
  pageTitle: "A Little Apology From My Heart ❤️",

  /* ---------- Opening screen ---------- */
  opening: {
    greeting: "Hey, {herName}! ❤️", // {herName} is replaced automatically
    subtitle: "I made something special for you. It's just a little piece of my heart.",
    button: "Open Your Surprise 💌",
  },

  /* ---------- Background music ----------
     Put an .mp3 file inside the "music" folder and write its name below,
     e.g. file: "music/our-song.mp3"
     Leave it empty ("") to use the soft built-in music-box melody instead. */
  music: {
    file: "music/sorry.mp3",
    volume: 0.35, // 0 = silent, 1 = full volume
  },

  /* ---------- Apology ---------- */
  apology: {
    heading: "I'm Really Sorry, My Love 🥺",
    paragraphs: [
      "I know I may have hurt you, and honestly, that is the last thing I ever wanted to do.",
      "I don't want to make excuses or justify anything. I just want you to know that I am genuinely sorry.",
      "You mean so much to me, and the thought of making you sad hurts my heart too.",
      "I know that saying sorry cannot instantly fix everything, but I want my actions to show you how much I care.",
      "You deserve happiness, love, respect, and all the little things that make you smile.",
      "I'm sorry, sweetheart. ❤️",
    ],
    signature: "Forever yours ❤️",
  },

  /* ---------- Things I love about you (cards) ---------- */
  specialHeading: "Do You Know How Special You Are? 🌷",
  specialThings: [
    { emoji: "😊", title: "Your Smile", text: "Your smile can make even my worst days feel beautiful." },
    { emoji: "✨", title: "Your Eyes", text: "There is something magical about the way you look at me." },
    { emoji: "💗", title: "Your Heart", text: "The kindness and love you carry make you so special." },
    { emoji: "🧸", title: "Your Cuteness", text: "You don't even realize how adorable you are." },
    { emoji: "🌸", title: "Your Personality", text: "I love the little things that make you uniquely you." },
    { emoji: "❤️", title: "Simply YOU", text: "I don't need a reason to love you. You are enough." },
  ],

  /* ---------- Photo gallery ----------
     1. Copy your photos into the "images" folder.
     2. Change each "src" below to your file name, e.g. "images/beach-day.jpg"
     3. "alt" is a short description (helps screen readers).
     You can add or remove photos; 6 to 10 looks best. */
  galleryHeading: "Little Moments, Big Memories 📸",
  photos: [
    { src: "images/tree-hug-selfie.jpg",        alt: "Us smiling together under a big tree",         caption: "That beautiful smile! 😊" },
    { src: "images/park-selfie.jpg",            alt: "A sunny selfie of us in the park",             caption: "One of my favorite moments ❤️" },
    { src: "images/waterfall-trip.jpg",         alt: "Us in front of a waterfall",                   caption: "Every adventure is better with you 🌿" },
    { src: "images/beach-sunset-dance.jpg",     alt: "Us dancing on the beach at sunset",            caption: "Dancing with you into the sunset 🌅" },
    { src: "images/vine-wall.jpg",              alt: "Us standing close by a wall of green vines",   caption: "My favorite place is right next to you." },
    { src: "images/movie-night-face-masks.jpg", alt: "Us in face masks watching a movie",            caption: "Face masks & movie nights 😄" },
    { src: "images/mirror-selfie.jpg",          alt: "A happy mirror selfie of us",                  caption: "You make ordinary moments special." },
    { src: "images/park-day.jpg",               alt: "Us posing together on a day in the park",      caption: "A memory I will always cherish." },
    { src: "images/beach-sunset-art.jpg",       alt: "An illustration of us at a beach sunset",      caption: "Here's to many more sunsets together 💕" },
  ],

  /* ---------- 10 reasons ---------- */
  reasonsHeading: "10 Little Reasons Why You Are My Favorite Person 💕",
  reasons: [
    "You make me smile without even trying.",
    "Your happiness matters so much to me.",
    "You make ordinary days feel special.",
    "Your smile is my favorite view.",
    "I love talking to you, even about random things.",
    "You have a beautiful heart.",
    "You make me feel lucky.",
    "Every little moment with you matters.",
    "You are one of the most precious people in my life.",
    "Because you are YOU, and that's more than enough.",
  ],

  /* ---------- Promises ---------- */
  promisesHeading: "I Promise You...",
  promises: [
    "I will try to understand your feelings better.",
    "I will listen instead of simply reacting.",
    "I will respect your emotions.",
    "I will never take your presence for granted.",
    "I will work on becoming a better person.",
    "I will make more efforts to keep that beautiful smile on your face.",
  ],
  promisesClosing:
    "I cannot promise to be perfect, but I can promise to keep learning, growing, and trying.",

  /* ---------- The question ---------- */
  question: {
    heading: "One Last Little Question... 🥺",
    text: "Can I have a chance to make things right?",
    forgiveButton: "I Forgive You ❤️",
    timeButton: "I Need Some Time 🥺",
    forgiveTitle: "YAY! ❤️ You just made my heart smile!",
    forgiveMessage:
      "Thank you for giving me a chance. I promise to value your feelings and your smile.",
    timeMessage:
      "That's okay, my love. Take all the time you need. I don't want to rush your feelings. I'll be here, and I genuinely want to make things right. ❤️",
  },

  /* ---------- Final love letter ---------- */
  letter: {
    heading: "One Last Thing, My Beautiful Girl 💌",
    paragraphs: [
      "Sometimes I may not find the perfect words to express how much you mean to me.",
      "But I hope you always remember that you are special, beautiful, precious, and worthy of all the love in this world.",
      "I'm sorry for the moments when I failed to make you feel that way.",
      "Thank you for being you.",
      "If I could make one wish right now, it would be to see that beautiful smile on your face again.",
      "I love you. ❤️",
    ],
    closing: "With all my love,",
    // The name under the closing uses yourName from the top, plus a heart.
  },

  /* ---------- Footer ---------- */
  footer: "Made with Love ❤️",
};
