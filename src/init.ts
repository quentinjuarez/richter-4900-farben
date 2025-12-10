// // Assuming you have a <canvas> element in HTML or can create one dynamically
// const img = new Image();
// img.src = './richter.webp'; // Path to the image file

// img.onload = () => {
//   const canvas = document.createElement('canvas');
//   canvas.width = img.width;
//   canvas.height = img.height;
//   const ctx = canvas.getContext('2d');
//   if (!ctx) {
//     console.error('Could not get canvas context');
//     return;
//   }
//   ctx.drawImage(img, 0, 0);

//   const squaresPerSide = 70;
//   const squareWidth = img.width / squaresPerSide;
//   const squareHeight = img.height / squaresPerSide;

//   const meanColors = [];

//   for (let row = 0; row < squaresPerSide; row++) {
//     for (let col = 0; col < squaresPerSide; col++) {
//       const x = Math.floor(col * squareWidth);
//       const y = Math.floor(row * squareHeight);
//       const w = Math.ceil(squareWidth);
//       const h = Math.ceil(squareHeight);

//       const imageData = ctx.getImageData(x, y, w, h);
//       const data = imageData.data;

//       let rSum = 0,
//         gSum = 0,
//         bSum = 0;
//       const pixelCount = data.length / 4;

//       for (let i = 0; i < data.length; i += 4) {
//         rSum += data[i];
//         gSum += data[i + 1];
//         bSum += data[i + 2];
//         // Ignore alpha for mean color
//       }

//       const hex = `#${(
//         (1 << 24) +
//         (Math.round(rSum / pixelCount) << 16) +
//         (Math.round(gSum / pixelCount) << 8) +
//         Math.round(bSum / pixelCount)
//       )
//         .toString(16)
//         .slice(1)}`;

//       meanColors.push(hex);
//     }
//   }

//   console.log(meanColors); // Array of 4900 mean colors
//   const set = new Set(meanColors);
//   console.log(`Unique colors: ${set.size}`);
// };
