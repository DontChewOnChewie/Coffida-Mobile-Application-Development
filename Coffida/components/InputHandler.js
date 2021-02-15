/*  Everything to do with user input validation. */

import { Pressable } from "react-native";

const NameValidation = (firstName, secondName) => {
    return (firstName.length > 2 && secondName.length > 2);
}

// Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const EmailValidation = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
} 

const PasswordValidation = (password, confirmPassword) => {
    if (password !== confirmPassword) return false;
    if (password.length < 5) return false;
    if (!/\d/.test(password)) return false;
    if (password.indexOf("!") != -1
        || password.indexOf("?") != -1 
        || password.indexOf("£") != -1
        || password.indexOf("$") != -1
        || password.indexOf("^") != -1
        || password.indexOf("-") != -1
        || password.indexOf("_") != -1
        || password.indexOf("&") != -1) return true; 
    return false;
}

export const UserValidation = (firstName, secondName, email, password, confirmPassword) => {
    if (!NameValidation(firstName, secondName)) return "Both First and Last Name fields must be longer then 2.";
    if (!EmailValidation(email)) return "Email is not valid.";
    if (!PasswordValidation(password, confirmPassword)) return "Password either don't match or do not contain at least on character and number.";
    return true 
}

const bannedWords = ['tea', 'cakes', 'pastries', 'food', 'sandwiches'];

const RatingValidation = (priceReview, qualityReview, clenlinessReview) => {
    if (priceReview === '' || qualityReview === '' || clenlinessReview === '') return "Please make sure to leave a rating for each category.";
    if (parseInt(priceReview) < 0 || parseInt(priceReview) > 5) return "Price Rating must be between 0-5";
    if (parseInt(qualityReview) < 0 || parseInt(qualityReview) > 5) return "Quality Rating must be between 0-5";
    if (parseInt(clenlinessReview) < 0 || parseInt(clenlinessReview) > 5) return "Clenliness Rating must be between 0-5";
    return true;
}

// Profanity Filter also checks length, simply to save another function.
const ProfanityFilter = (reviewBody) => {
    if (reviewBody.length < 15) return "Review Body should be at least 15 characters long."
    if (reviewBody.length > 500) return "Review Body should not be more then 500 characters long."

    let return_value = true;

    bannedWords.forEach(word => {
        if (reviewBody.indexOf(word) !== -1) {
            console.log(`Bad Word : ${word}`);
            return_value = `Word '${word}' is not allowed in the review, keep the focus on coffee please.`;
        }
    });
    return return_value;
}

export const ReviewValidation = (priceReview, qualityReview, clenlinessReview, reviewBody) => {
    const ratingsValid = RatingValidation(priceReview, qualityReview, clenlinessReview);
    if (typeof(ratingsValid) !== "boolean") return ratingsValid;
    const reviewBodyValid = ProfanityFilter(reviewBody)
    if (typeof(reviewBodyValid) !== "boolean") return reviewBodyValid;
    return true;
}