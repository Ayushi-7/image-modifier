let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

// helper method for blurPixel()
function isValid(image, x, y){
  let isVal = true;
  if(x < 0 || y < 0 || x > (image.width - 1) || y > (image.height - 1)){
    isVal = false;
  }
  return isVal;
}

// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(image, x, y){
  let meanRed = 0;
  let meanBlue = 0;
  let meanGreen = 0; 
  let count = 0;
  for(let a = x - 1; a <= x + 1; ++a){
    for(let b = y - 1; b <= y + 1; ++b){
      if(isValid(image, a, b)){
        let pixel = image.getPixel(a, b);
        meanRed = meanRed + pixel[0];
        meanBlue = meanBlue + pixel[1];
        meanGreen = meanGreen + pixel[2];
        ++count;
      }
    }
  }
  return [meanRed/count, meanBlue/count, meanGreen/count];
}

// blurImage(img: Image): Image
function blurImage(image){
  return imageMapXY(image, blurPixel);
}

// robot.show();
// let img = blurImage(robot);
// img.show();

// check for 0
// diffLeft(img: Image, x: number, y: number): Pixel
function diffLeft(image, x, y){
  let pixel = image.getPixel(x, y);
  if( x !== 0){
    let pixLeft = image.getPixel(x-1, y);
    let m1 = mean(pixel);
    let m2 = mean(pixLeft);
    let m = Math.abs(m2 - m1);
    pixel = [m, m, m]; 
  } 
  else{
    pixel = [0, 0, 0];
  }
  return pixel;
}

function mean(pixel){
  let mean = (pixel[0] + pixel[1] + pixel[2])/3;
  return mean;
}

// imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(image, func){
  let img = image.copy();
  for(let i = 0; i < img.width; ++i){
    for(let j = 0; j < img.height; ++j){
      let arrayTemp = image.getPixel(i, j);
      let newVal = func(image, i, j);
      img.setPixel(i, j, newVal);
    }
  }
  return img;
}

// highlightEdges(img: Image): Image
function highlightEdges(image){
  return imageMapXY(image, diffLeft);
}

// robot.show();
// let img = highlightEdges(robot);
// img.show();

// reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions(arrayFunc){
  return arrayFunc.reduce((acc, e) => (x => e(acc(x))),  p => p);
}

// const arrayFunc = [p => p, p => p.map(x => 0.5)];
// let output = reduceFunctions(arrayFunc);
// const pixVal = [0.1, 0.2, 0.3];
// let pix = output(pixVal);
// console.log(pix);

// imageMap(img: Image, func: (p: Pixel) => Pixel): Image
function imageMap(image, func){
  let img = image.copy();
  for( let i = 0; i < img.width; ++i){
    for(let j = 0; j < img.height; ++j){
      let arrayTemp = image.getPixel(i, j);
      let newVal = func(arrayTemp); 
      img.setPixel(i, j, newVal);
    }
  } 
  return img;
}

// combineThree(img: Image): Image
function combineThree(image){
  let array = [makeGrayish, blackenLow, shiftRGB];
  return imageMap(image, reduceFunctions(array));
}

// let imagerob = combineThree(robot);
// imagerob.show();

// const white = lib220.createImage(5, 5, [0.5, 0.2, 0.7]);
// const img = combineThree(white);
// let pixel = img.getPixel(4, 4);
// console.log(pixel);

// helper method for makeGrayish()
function isGrayish(pixel){
  let max = pixel[0];
  let min = pixel[0];
  for(let i = 1; i < 3; ++i){
    if(max < pixel[i]){
      max = pixel[i];
    }
    if(min > pixel[i]){
      min = pixel[i];
    }
  }
  if((max - min) <= 1/3){
    return true;
  }
  return false;
}

// makeGrayish(p: Pixel) => Pixel
function makeGrayish(pixel){
  if(isGrayish(pixel)){
    return pixel;
  }
  else{
    let avg = (pixel[0] + pixel[1] + pixel[2])/3
    pixel[0] = pixel[1] = pixel[2] = avg;
  }
  return pixel;
}

// helper method for blackenLow()
function blackenHelper(x){
  if(x < 1/3){
    x = 0;
  }
  return x;
}

// blackenLow(p: Pixel) => Pixel
function blackenLow(pixel){
    let pix = pixel.map(blackenHelper);
    return pix;
}

// shiftRGB(p: Pixel) => Pixel
function shiftRGB(pixel){
  let r = pixel[0];
  let g = pixel[1];
  let b = pixel[2];
  return [g, b, r];
}
