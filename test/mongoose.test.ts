import mongoose, { Schema, Document, Model } from 'mongoose';

// MongoDB connection URI (replace with your local MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/test_db';

interface ITest extends Document {
  name: string;
  age: number;
}

let TestModel: Model<ITest>;

beforeAll(async () => {
  await mongoose.connect(mongoURI, {});

  // Define a simple schema
  const testSchema = new Schema<ITest>({
    name: { type: String, required: true },
    age: { type: Number, required: true }
  });
  TestModel = mongoose.model<ITest>('Test', testSchema);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Clean up the test DB
  await mongoose.disconnect();
});

it('should save a document to MongoDB', async () => {
  const testDoc = new TestModel({ name: 'Alice', age: 30 });
  const savedDoc = await testDoc.save();
  expect(savedDoc.name).toBe('Alice');
  expect(savedDoc.age).toBe(30);
});
