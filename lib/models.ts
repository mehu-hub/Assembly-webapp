import mongoose, { Schema, Document } from 'mongoose';
import type { Product, Component, BOMEntry, InventoryEntry } from './types';

// Extend types to include Document for Mongoose
export interface IProduct extends Omit<Product, 'id'>, Document {
  id: string; // we will map _id to id in frontend
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
}, { timestamps: true });

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export interface IComponent extends Omit<Component, 'id'>, Document {}

const ComponentSchema = new Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

ComponentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export interface IBOMEntry extends Omit<BOMEntry, 'id'>, Document {}

const BOMEntrySchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  componentId: { type: String, required: true },
  quantityRequired: { type: Number, required: true, min: 1 },
}, { timestamps: true });

BOMEntrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export interface IInventoryEntry extends Omit<InventoryEntry, 'id'>, Document {}

const InventoryEntrySchema = new Schema({
  componentId: { type: String, required: true, unique: true },
  workshopQty: { type: Number, default: 0 },
  storageQty: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
}, { timestamps: true });

InventoryEntrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const ComponentModel = mongoose.models.Component || mongoose.model<IComponent>('Component', ComponentSchema);
export const BOMEntryModel = mongoose.models.BOMEntry || mongoose.model<IBOMEntry>('BOMEntry', BOMEntrySchema);
export const InventoryEntryModel = mongoose.models.InventoryEntry || mongoose.model<IInventoryEntry>('InventoryEntry', InventoryEntrySchema);
