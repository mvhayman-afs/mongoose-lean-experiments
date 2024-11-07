import mongoose, { Types, Schema, Document, Model } from 'mongoose';

// MongoDB connection URI (replace with your local MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/test_db';

interface IPet extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  age: number;
}

interface IPerson extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  age: number;
  pet_ids: Types.ObjectId; // virtual
  pets: IPet[]; // virtual
}

type THydratedPetDocument = {
  pets?: mongoose.Types.DocumentArray<IPet>;
}

type PersonModelType = mongoose.Model<IPerson, {}, {}, {}, THydratedPetDocument>;
let PersonModel: PersonModelType;
let PetModel: Model<IPet>;

beforeAll(async () => {
  await mongoose.connect(mongoURI, {});

  // Define a simple schema
  const personSchema = new Schema<IPerson>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    pets: [{ type: Types.ObjectId, ref: 'Pet', required: true }]
  }, { strict: 'throw' });
  personSchema.virtual('pets', {
    ref: 'Pet',
    localField: 'pet_ids',
    foreignField: '_id',
  });

  PersonModel = mongoose.model<IPerson, PersonModelType>('Person', personSchema);

  // now this works
  // const person = new PersonModel({ name: 'Alice', age: 30, pet_ids: [pet] });
  // person.pets?.map(person => { person.save() });

  const petSchema = new Schema<IPet>({
    name: { type: String, required: true },
    age: { type: Number, required: true }
  }, { strict: 'throw' });
  PetModel = mongoose.model<IPet>('Pet', petSchema);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Clean up the test DB
  await mongoose.disconnect();
});

it('should save a document to MongoDB', async () => {
  const pet = new PetModel({ name: 'Stain', age: 1 });
  await pet.save()

  console.log('pet', pet);

  // why isn't this type safe?
  const person = new PersonModel({ name: 'Alice', age: 30, pet_ids: [pet] });

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

  const hydratedDoc = await PersonModel.findOne({ _id: _id }).populate('pets').orFail();

  console.log('hydrated doc pets', hydratedDoc.pets);

  const leanDoc = await PersonModel.findOne({ _id: _id }).populate('pets').orFail().lean({ virtuals: true });

  console.log('**leaned', leanDoc._id, leanDoc.id, leanDoc.pets);

  console.log(leanDoc._id === _id);
  console.log(leanDoc._id.equals(_id));
  console.log(leanDoc._id.equals(_id.toString()));
});
