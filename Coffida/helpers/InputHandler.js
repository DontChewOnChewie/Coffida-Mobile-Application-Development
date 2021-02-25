/* eslint-disable radix */
/*  Everything to do with user input validation. */

// Check if both name input legnths are greater than 2.
// eslint-disable-next-line max-len
export const NameValidation = (firstName, secondName) => (firstName.length > 2 && secondName.length > 2);

// Check if email is of valid format.
// Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export const EmailValidation = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Check passwords match,  has a length greater than 5, have a number in and a symbol in.
export const PasswordValidation = (password, confirmPassword) => {
  if (password !== confirmPassword) return false;
  if (password.length < 5) return false;
  if (!/\d/.test(password)) return false;
  if (password.indexOf('!') !== -1
        || password.indexOf('?') !== -1
        || password.indexOf('£') !== -1
        || password.indexOf('$') !== -1
        || password.indexOf('^') !== -1
        || password.indexOf('-') !== -1
        || password.indexOf('_') !== -1
        || password.indexOf('&') !== -1) return true;
  return false;
};

// Call all user validation functions.
export const UserValidation = (firstName, secondName, email, password, confirmPassword) => {
  if (!NameValidation(firstName, secondName)) return 'Both First and Last Name fields must be longer than 2.';
  if (!EmailValidation(email)) return 'Email is not valid.';
  if (!PasswordValidation(password, confirmPassword)) return "Password either don't match or do not contain at least on character and number.";
  return true;
};

const bannedWords = ['tea', 'cakes', 'pastries', 'food', 'sandwiches'];

// Check inputted review numbers are valid.
const RatingValidation = (priceReview, qualityReview, clenlinessReview) => {
  if (priceReview === '' || qualityReview === '' || clenlinessReview === '') return 'Please make sure to leave a rating for each category.';
  const priceReviewInt = parseInt(priceReview);
  const qualityReviewInt = parseInt(qualityReview);
  const clenlinessReviewInt = parseInt(clenlinessReview);
  if (priceReviewInt < 0 || parseInt(priceReviewInt) > 5 || Object.is(NaN, priceReviewInt)) return 'Price Rating must be between 0-5';
  if (parseInt(qualityReviewInt) < 0 || parseInt(qualityReviewInt) > 5 || Object.is(NaN, qualityReviewInt)) return 'Quality Rating must be between 0-5';
  if (parseInt(clenlinessReviewInt) < 0 || parseInt(clenlinessReviewInt) > 5 || Object.is(NaN, clenlinessReviewInt)) return 'Clenliness Rating must be between 0-5';
  return true;
};

// Profanity Filter also checks length, simply to save another function.
const ProfanityFilter = (reviewBody) => {
  if (reviewBody.length < 15) return 'Review Body should be at least 15 characters long.';
  if (reviewBody.length > 500) return 'Review Body should not be more then 500 characters long.';

  let returnValue = true;

  bannedWords.forEach((word) => {
    if (reviewBody.indexOf(word) !== -1) {
      returnValue = `Word '${word}' is not allowed in the review, keep the focus on coffee please.`;
    }
  });
  return returnValue;
};

// Call all rating validation functions.
export const ReviewValidation = (priceReview, qualityReview, clenlinessReview, reviewBody) => {
  const ratingsValid = RatingValidation(priceReview, qualityReview, clenlinessReview);
  if (typeof (ratingsValid) !== 'boolean') return ratingsValid;
  const reviewBodyValid = ProfanityFilter(reviewBody);
  if (typeof (reviewBodyValid) !== 'boolean') return reviewBodyValid;
  return true;
};
