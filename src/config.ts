import dotenv from "dotenv";

// To intialize the environment variables
dotenv.config();

export const envVariables = {
  netflixEmail: process.env.NETFLIX_EMAIL || "",
  netflixPassword: process.env.NETFLIX_PASSWORD || "",
};
