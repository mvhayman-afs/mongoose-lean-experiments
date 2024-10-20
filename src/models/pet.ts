import mongoose, { Model, Types, Schema } from 'mongoose';
import { PetDocument, PetModel, PetSchema, PetObject } from "../interfaces/mongoose.gen.ts";

const PetSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true }
}, { strict: 'throw' });

export const Person = mongoose.model<PetDocument, PetModel>("Pet", PetSchema);
