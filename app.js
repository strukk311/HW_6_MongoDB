'use strict';

const {mapUser, getRandomFirstName, mapArticle} = require('./util');

// db connection and settings
const connection = require('./config/connection');
const students = require('./students.json');
let userCollection;
let articleCollection;
let studentsCollection;
run();

async function run() {
  await connection.connect();
  //   await connection.get().dropCollection('users');
  //   await connection.get().createCollection('users');
  //   userCollection = connection.get().collection('users');
  //   await connection.get().createCollection('students');
  studentsCollection = connection.get().collection('students');

  //   await connection.get().dropCollection('articles');
  //   await connection.get().createCollection('articles');
  //   articleCollection = connection.get().collection('articles');

  //   await example1();
  //   await example2();
  //   await example3();
  //   await example4();
  //   await example5();
  //   await example6();
  //   await example7();
  //   await example8();
  await example9();
  console.log('end');
  await connection.close();
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1() {
  try {
    const deps = ['a', 'a', 'b', 'b', 'c', 'c'];
    const users = deps.map(department => mapUser({department}));

    const res = await userCollection.insertMany(users);
    console.log('res', res);
  } catch (err) {
    console.error(err);
  }
}

// - Delete 1 user from department (a)

async function example2() {
  try {
    const del = await userCollection.deleteOne({department: 'a'});
    // console.log('deleted', del);
  } catch (err) {
    console.error(err);
  }
}

// - Update firstName for users from department (b)

async function example3() {
  try {
    // await userCollection.updateMany({department: 'b'}, {$set: {firstName: 'Neo'}});
    const userB = await userCollection.find({department: 'b'}).toArray();
    const bulkWrite = userB.map(user => ({
      updateOne: {
        filter: {_id: user._id},
        update: {$set: {firstName: 'NEO'}}
      }
    }));
    const {result} = await userCollection.bulkWrite(bulkWrite);
  } catch (err) {
    console.error(err);
  }
}

// - Find all users from department (c)
async function example4() {
  try {
    const userC = await userCollection.find({department: 'c'});
  } catch (err) {
    console.error(err);
  }
}

async function example5() {
  const type = ['a', 'b', 'c'];
  const types = [];

  type.forEach(item => {
    for (let i = 0; i < 5; i++) {
      types.push({type: item});
    }
  });

  try {
    const articles = types.map(type => mapArticle({type}));
    const {res} = articleCollection.insertMany(articles);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
async function example6() {
  try {
    const {res} = await articleCollection.updateMany(
      {type: 'a'},
      {$push: {tags: {$each: ['tag1-a', 'tag2-a', 'tag3']}}}
    );
  } catch (err) {
    console.error(err);
  }
}
async function example7() {
  try {
    const {res} = await articleCollection.updateMany(
      {type: {$ne: 'a'}},
      {$push: {tags: {$each: ['tag2', 'tag3', 'super']}}}
    );
  } catch (err) {
    console.error(err);
  }
}
async function example8() {
  try {
    const {res} = await articleCollection.updateMany(
      {},
      {$pull: {tags: {$in: ['tag2', 'tag1-a']}}}
    );
  } catch (err) {
    console.error(err);
  }
}
async function example9() {
  try {
    const res = await studentsCollection.insertMany(students);
  } catch (err) {
    console.error(err);
  }
}
