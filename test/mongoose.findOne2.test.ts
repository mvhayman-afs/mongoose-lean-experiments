import mongoose from 'mongoose';
import { Person } from '../src/models/person';
import { Pet } from '../src/models/pet';

// MongoDB connection URI (replace with your local MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/test_db';

beforeAll(async () => {
  await mongoose.connect(mongoURI, {});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Clean up the test DB
  await mongoose.disconnect();
});

it('should save a document to MongoDB', async () => {
  const pet = new Pet({ name: 'Stain', age: 1 });
  await pet.save()

  console.log('pet', pet);

  // why isn't this type safe?
  const person = new Person({ name: 'Alice', age: 30, pet_ids: [pet] });

  console.log('pets before', person.name, person.pets, person.pet_ids);

  console.log('***ids before', person._id, person.id);

  const savedPerson = await person.save();
  console.log('pets', savedPerson.pets, savedPerson.pet_ids);

  const _id = person._id;
  const id = person.id;

  console.log('***ids after', id, _id);

  expect(savedPerson.name).toBe('Alice');
  expect(savedPerson.age).toBe(30);

  const objectDoc = person.toObject();

  const hydratedDoc = await Person.findOne({ _id: _id }).populate('pets', 'name').orFail();

  console.log('hydrated doc pets', hydratedDoc.pets);
  console.log('hydrated doc pets', hydratedDoc.pets, hydratedDoc.pets[0].age);

  const leanDoc = await Person.findOne({ _id: _id }).populate('pets').orFail().lean({ virtuals: true });

  console.log('**leaned', leanDoc._id, leanDoc.id, leanDoc.pets);

  console.log(leanDoc._id === _id);
  console.log(leanDoc._id.equals(_id));
  console.log(leanDoc._id.equals(_id.toString()));
});
