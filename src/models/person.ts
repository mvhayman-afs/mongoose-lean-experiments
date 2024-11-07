import mongoose, { Model, Types, Schema } from 'mongoose';
import { PersonDocument, PetDocument, PersonModel, PersonSchema, PersonObject } from "../interfaces/mongoose.gen";

export interface Person {
  name: string;
  age: number;
  pet_ids: mongoose.Types.ObjectId[];
  pets?: PetDocument[];
}

const schemaDefinition = {
  name: { type: String, required: true },
  age: { type: Number, required: true },
  pet_ids: { type: [Schema.Types.ObjectId], ref: 'Pet', required: true }
} as const;

const PersonSchema = new Schema<Person>(schemaDefinition, { strict: 'throw' });

PersonSchema.virtual('pets', {
  ref: 'Pet',
  localField: 'pet_ids',
  foreignField: '_id',
});

export const Person = mongoose.model("Person", PersonSchema);

export type RawPersonDocType = mongoose.InferRawDocType<typeof schemaDefinition>;
