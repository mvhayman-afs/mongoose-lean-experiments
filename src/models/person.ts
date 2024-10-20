import mongoose, { Model, Types, Schema } from 'mongoose';
import { PersonDocument, PersonModel, PersonSchema, PersonObject } from "../interfaces/mongoose.gen.ts";

const PersonSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  pet_ids: [{ type: Types.ObjectId, ref: 'Pet', required: true }]
}, { strict: 'throw' });

PersonSchema.virtual('pets', {
  ref: 'Pet',
  localField: 'pet_ids',
  foreignField: '_id',
});

export const Person = mongoose.model<PersonDocument, PersonModel>("User", PersonSchema);
