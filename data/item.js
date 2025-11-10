// src/data/items.js

// Reasons shown as selectable "clues" before reveal
export const REASONS = [
    "Text/LOGO distortion",
    "Unnatural reflection/shadow",
    "Finger/skin artifacts",
    "Repeating/too-uniform texture",
    "Strange depth/edge halos",
    "Missing/odd EXIF (assumed)"
  ];
  
  // Initial 24 items (emoji thumbnails for MVP).
  // isAI = true (AI-generated), false (real photo), or null (unknown).
  export const INITIAL_ITEMS = [
    { id: "img01", title: "Salmon bowl",        thumb: "🍣",  isAI: true  },
    { id: "img02", title: "Street cat",         thumb: "🐱",  isAI: false },
    { id: "img03", title: "Wristwatch macro",   thumb: "⌚️",  isAI: true  },
    { id: "img04", title: "Latte art",          thumb: "☕️",  isAI: false },
    { id: "img05", title: "Subway crowd",       thumb: "🚇",  isAI: true  },
    { id: "img06", title: "Window plant",       thumb: "🪴",  isAI: false },
    { id: "img07", title: "Neon night",         thumb: "🌃",  isAI: true  },
    { id: "img08", title: "Desk still life",    thumb: "📚",  isAI: false },
    { id: "img09", title: "City skyline",       thumb: "🏙️",  isAI: true  },
    { id: "img10", title: "Donut on plate",     thumb: "🍩",  isAI: false },
    { id: "img11", title: "Sports car",         thumb: "🏎️",  isAI: true  },
    { id: "img12", title: "Flower bouquet",     thumb: "💐",  isAI: false },
    { id: "img13", title: "Mountain view",      thumb: "🏔️",  isAI: true  },
    { id: "img14", title: "Pet dog",            thumb: "🐶",  isAI: false },
    { id: "img15", title: "Runway fashion",     thumb: "👗",  isAI: true  },
    { id: "img16", title: "Home kitchen",       thumb: "🍳",  isAI: false },
    { id: "img17", title: "Coast drone shot",   thumb: "🏖️",  isAI: true  },
    { id: "img18", title: "Ice cream scoop",    thumb: "🍨",  isAI: false },
    { id: "img19", title: "Temple lanterns",    thumb: "🏮",  isAI: true  },
    { id: "img20", title: "Cyclist",            thumb: "🚴‍♀️", isAI: false },
    { id: "img21", title: "Glass facade",       thumb: "🏢",  isAI: true  },
    { id: "img22", title: "Sushi platter",      thumb: "🍱",  isAI: false },
    { id: "img23", title: "Hand holding vase",  thumb: "🖐️",  isAI: true  },
    { id: "img24", title: "People in rain",     thumb: "🌧️",  isAI: false }
  ];
  
  // If you later swap emoji for images, add `url` like:
  // { id: "img01", title: "Salmon bowl", url: "/assets/set/salmon_bowl.jpg", isAI: true }
  