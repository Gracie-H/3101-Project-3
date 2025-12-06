
function imgPath(n) {
  return new URL(`../images/${n}.png`, import.meta.url).href;
}

// image logic
// catagorize by the building from different country
export const initialBuildings = [
  { id: 1,  country: "North Macedonia", img: imgPath(1) },
  { id: 2,  country: "Croatia",         img: imgPath(2) },
  { id: 3,  country: "Serbia",          img: imgPath(3) },
  { id: 4,  country: "Bosnia",          img: imgPath(4) },
  { id: 5,  country: "Croatia",         img: imgPath(5) },
  { id: 6,  country: "Bosnia",          img: imgPath(6) },
  { id: 7,  country: "Serbia",          img: imgPath(7) },
  { id: 8,  country: "Croatia",         img: imgPath(8) },
  { id: 9,  country: "Serbia",          img: imgPath(9) },
  { id: 10, country: "North Macedonia", img: imgPath(10) },
  { id: 11, country: "Bosnia",          img: imgPath(11) },
  { id: 12, country: "Croatia",         img: imgPath(12) },
  { id: 13, country: "Serbia",          img: imgPath(13) },
  { id: 14, country: "Croatia",         img: imgPath(14) },
  { id: 15, country: "Slovenia",        img: imgPath(15) },
  { id: 16, country: "Montenegro",      img: imgPath(16) },
  { id: 17, country: "Bosnia",          img: imgPath(17) },
  { id: 18, country: "Serbia",          img: imgPath(18) },
  { id: 19, country: "Slovenia",        img: imgPath(19) },
  { id: 20, country: "Montenegro",      img: imgPath(20) },
  { id: 21, country: "Serbia",          img: imgPath(21) },
];
