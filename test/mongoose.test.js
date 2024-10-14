const mongoose = require('mongoose');
const { Schema } = mongoose;
const assert = require('assert');

// MongoDB connection URI (replace with your local MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/test_db';

before(async function() {
  // Connect to MongoDB
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

after(async function() {
  // Disconnect from MongoDB
  await mongoose.disconnect();
});

describe('Mongoose Schema Test', function() {
  let TestModel;

  before(function() {
    // Define a simple schema
    const testSchema = new Schema({
      name: String,
      age: Number
    });
    TestModel = mongoose.model('Test', testSchema);
  });

  it('should save a document to MongoDB', async function() {
    const testDoc = new TestModel({ name: 'Alice', age: 30 });
    const savedDoc = await testDoc.save();
    assert.strictEqual(savedDoc.name, 'Alice');
    assert.strictEqual(savedDoc.age, 30);
  });
});
