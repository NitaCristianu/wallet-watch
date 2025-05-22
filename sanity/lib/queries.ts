import { defineQuery } from "next-sanity";

export const USER_BY_EMAIL =
    defineQuery(`*[_type == "user" && email == $email][0]{
    _id,
    name,
    email,
    image,
}`);

export const PROJECTS_BY_USER = defineQuery(`
*[_type == "project" && user._ref == $userId]{
  _id,
  title,
  "user": user->{
    _id,
    name,
    email
  }
}`);

export const PROJECT_BY_ID = defineQuery(`
  *[_type == "project" && _id == $projectId][0]{
    _id,
    title,
    Dedication,
    currency,
    dailybudget,
    "user": user->{
      _id,
      name,
      email
    }
  }
`);

export const ACTIONS_BY_PROJECT_ID = defineQuery(`
  *[_type == "project" && _id == $projectId][0]{
    actions[]{
      _key,
      _type,
      title,
      description,
      currency,
      ammount,
      frequency,
      other,
      color,
      type,
      date1,
      date2,
      id,
    }
  }
`);
