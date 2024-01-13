// Tests

function pixelEq (p1, p2) {
const epsilon = 0.002; // increase for repeated storing & rounding
return [0,1,2].every(i => Math.abs(p1[i] - p2[i]) <= epsilon);
};

test('Blur pixel for corner', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(1, 0, [0.9, 0.2, 0.3]);
white.setPixel(0, 0, [0.4, 0.4, 0.8]);
const shouldBeBlur = blurPixel(white, 0, 0);
const pix = [0.825, 0.65, 0.775];
assert(pixelEq (pix, shouldBeBlur));
});

test('Blur pixel for edge', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(1, 0, [0.9, 0.2, 0.3]);
white.setPixel(0, 0, [0.4, 0.4, 0.8]);
white.setPixel(3, 0, [0.9, 0.2, 0.5]);
white.setPixel(2, 1, [0.4, 0.5, 0.8]);
const shouldBlurEdge = blurPixel(white, 2, 0);
const pixelEdge = [0.867, 0.65, 0.767];
assert(pixelEq (pixelEdge, shouldBlurEdge));
});

test('Blur pixel for middle', function() {
const white = lib220.createImage(100, 100, [1,1,1]);
white.setPixel(49, 50, [0.9, 0.2, 0.3]);
white.setPixel(51, 50, [0.4, 0.4, 0.8]);
white.setPixel(51, 51, [0.1, 0.7, 0.9]);
white.setPixel(49, 51, [0.8, 0.6, 0.1]);
white.setPixel(50, 51, [0.2, 0.1, 0.4]);
const shouldBeBlur = blurPixel(white, 50, 50);
const pix = [0.711, 0.667, 0.722];
assert(pixelEq (pix, shouldBeBlur));
});

test('Blur image', function() {
const white = lib220.createImage(100, 100, [1,1,1]);
white.setPixel(49, 50, [0.9, 0.2, 0.3]);
white.setPixel(51, 50, [0.4, 0.4, 0.8]);
white.setPixel(51, 51, [0.1, 0.7, 0.9]);
white.setPixel(49, 51, [0.8, 0.6, 0.1]);
white.setPixel(50, 51, [0.2, 0.1, 0.4]);
const shouldBeBlur = blurImage(white);
let pixel = shouldBeBlur.getPixel(50, 50);
const pix = [0.711, 0.667, 0.722];
assert(pixelEq (pix, pixel));
});

test('identity function with imageMapXY', function() {
let identityFunction = function(image, x, y ) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
let outputImage = imageMapXY(inputImage, identityFunction);
assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test('imageMapXY function definition is correct', function() {
function identity(image, x, y) { return image.getPixel(x, y); }
let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
let outputImage = imageMapXY(inputImage, identity);
let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
assert(p.every(c => c === 0)); // every pixel channel is 0
assert(inputImage !== outputImage); // output should be a different image object
});

test('Turns red using imageMapXY', function() {
const white = lib220.createImage(10, 10, [1,1,1]);
const shouldBeRed = imageMapXY(white, function(img, x, y) {return [img.getPixel(x, y)[0], 0, 0];});
const pixelValue = shouldBeRed.getPixel(5, 5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
assert(pixelValue[1] === 0);
assert(pixelValue[2] === 0);
});

test('diffLeft for (0, 0)', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(1, 0, [0.9, 0.2, 0.3]);
white.setPixel(0, 0, [0.4, 0.4, 0.8]);
const shouldBeDiff = diffLeft(white, 0, 0);
const pix = [0, 0, 0];
assert(pixelEq (pix, shouldBeDiff));
});

test('diffLeft for negative difference', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(1, 0, [0.9, 0.2, 0.3]);
white.setPixel(0, 0, [0.4, 0.4, 0.8]);
const shouldBeDiff = diffLeft(white, 1, 0);
const pix = [0.066, 0.066, 0.066];
assert(pixelEq (pix, shouldBeDiff));
});

test('diffLeft for positive difference', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(0, 0, [0.9, 0.2, 0.3]);
white.setPixel(1, 0, [0.4, 0.4, 0.8]);
const shouldBeDiff = diffLeft(white, 1, 0);
const pix = [0.066, 0.066, 0.066];
assert(pixelEq (pix, shouldBeDiff));
});

test('highlightEdges', function() {
const white = lib220.createImage(4, 4, [1,1,1]);
white.setPixel(0, 0, [0.9, 0.2, 0.3]);
white.setPixel(1, 0, [0.4, 0.4, 0.8]);
let shouldBeDiff = highlightEdges(white);
let pixel = shouldBeDiff.getPixel(1, 0);
const pix = [0.066, 0.066, 0.066];
assert(pixelEq (pix, pixel));
});

test('reduceFunctions', function() {
const arrayFunc = [p => p, p => p.map(x=>(x > 0.5 ? 1 : 0))];
let output = reduceFunctions(arrayFunc);
const pixVal = [0.1, 0.2, 0.6];
let pix = output(pixVal);
const pixel = [0, 0, 1];
assert(pixelEq (pix, pixel));
});

test('reduceFunctions', function() {
const arrayFunc = [p => p, p => p.map(x => 0.8)];
let output = reduceFunctions(arrayFunc);
const pixVal = [0.1, 0.2, 0.6];
let pix = output(pixVal);
const pixel = [0.8, 0.8, 0.8];
assert(pixelEq (pix, pixel));
});

test('test isGrayish() and does not change to gray', function() {
const pixelValue = makeGrayish([0.4,0.3,0.3]);
const pix = [0.4, 0.3, 0.3];
assert(pixelEq (pix, pixelValue));
});

test('changes to gray with rounding off', function() {
const pixelValue = makeGrayish([0.7,0.3,0.1]);
const pix = [0.367, 0.367, 0.367];
assert(pixelEq (pix, pixelValue));
});

test('blackenLow changes pixel', function() {
const pixelValue = blackenLow([0.7,0.3,0.1]);
const pix = [0.7, 0, 0];
assert(pixelEq (pix, pixelValue));
});

test('shiftRGB changes pixel', function() {
const pixelValue = shiftRGB([0.7,0.3,0.1]);
const pix = [0.3, 0.1, 0.7];
assert(pixelEq (pix, pixelValue));
});

test('combineThree test 1', function() {
const white = lib220.createImage(5, 5, [0.5, 0.2, 0.7]);
const img = combineThree(white);
let pix = img.getPixel(4, 4);
const pixel = [0.467, 0.467, 0.467];
assert(pixelEq (pix, pixel));
});

test('combineThree test 2', function() {
const white = lib220.createImage(5, 5, [0.2, 0.4, 0.4]);
const img = combineThree(white);
let pix = img.getPixel(4, 4);
const pixel = [0.4, 0.4, 0];
assert(pixelEq (pix, pixel));
});
