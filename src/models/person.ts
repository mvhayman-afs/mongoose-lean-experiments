import mongoose, { Model, Types, Schema } from 'mongoose';
import { PersonDocument, PetDocument, PersonModel, PersonSchema, PersonObject } from "../interfaces/mongoose.gen";

const PersonSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  pets: [{ type: Types.ObjectId, ref: 'Pet', required: true }]
}, { strict: 'throw' });

/*
PersonSchema.virtual('pets', {
  ref: 'Pet',
  localField: 'pet_ids',
  foreignField: '_id',
}).get(function(this: PetDocument[]) {
  // console.log(this);
  return this.pets;
});
*/

export const Person = mongoose.model<PersonDocument, PersonModel>("Person", PersonSchema);
