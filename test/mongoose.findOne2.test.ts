import mongoose, { Types, GetLeanResultType } from 'mongoose';
import { Person, RawPersonDocType } from '../src/models/person';
import { Pet } from '../src/models/pet';
import { IsPopulated, PersonDocument, PersonObject, PetObject, PopulatedDocument } from '../src/interfaces/mongoose.gen';

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

  console.log('pets before', person.name, person.pets, person.pets);

  console.log('***ids before', person._id, person.id);

  const savedPerson = await person.save();
  console.log('pets', savedPerson.pets, savedPerson.pets);

  const _id = person._id;
  const id = person.id;

  console.log('***ids after', id, _id);

  expect(savedPerson.name).toBe('Alice');
  expect(savedPerson.age).toBe(30);

  const objectDoc = person.toObject();

  const hydratedDoc = await Person.findOne({ _id: _id }).populate<{ pets: PetObject[] }>('pets', 'age').orFail() as unknown as Person;

  console.log('hydrated doc pets', hydratedDoc.pets, hydratedDoc.pets[0].age);

  const hydratedDocWithoutPets = await Person.findOne({ _id: _id }).orFail();

  console.log('hydrated doc without pets', hydratedDocWithoutPets.pets, hydratedDocWithoutPets.pets[0].age);

  // class LeanPet extends PetObject {}

  const leanDoc = await Person.findOne({ _id: _id }).populate<{ pets: PetObject[] }>('pets').orFail().lean<Person>({ virtuals: true });

  console.log('leanDoc', leanDoc);

  if (!(leanDoc.pets[0] instanceof Types.ObjectId)) {
    console.log('NOT INSTANCE', leanDoc.pets[0].age);
  }

  if (IsPopulated(leanDoc.pets)) {
    console.log('POPULATED', leanDoc.pets[0].age);
  }

  if (IsPopulated(hydratedDoc.pets)) {
    console.log('POPULATED', hydratedDoc.pets[0].age);
  }

  function safeType(person: PopulatedDocument<PersonDocument, "pets">) {
    console.log(person.pets[0].age)
  }

  console.log('hydrated doc');
  safeType(hydratedDoc);
  console.log('hydrated doc w/o pets');
  safeType(hydratedDocWithoutPets);
  console.log('lean doc');
  safeType(leanDoc);

  /*
  console.log('**leaned', leanDoc._id, leanDoc.pets[0].age);

  console.log(leanDoc._id === _id);
  console.log(leanDoc._id.equals(_id));
  console.log(leanDoc._id.equals(_id.toString()));

  const leanDocWithoutPets = await Person.findOne({ _id: _id }).orFail().lean<PersonObject>({ virtuals: true });

  if (typeof leanDocWithoutPets.pets[0] === 'PetObject') {
  }
  }

  console.log(leanDocWithoutPets.pets[0].age);
  console.log(leanDocWithoutPets.pets[0].age);
  */
});
