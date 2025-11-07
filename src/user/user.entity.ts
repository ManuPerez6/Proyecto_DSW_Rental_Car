import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  name: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'], 
    default: 'user', 
  },
}, {
  timestamps: true,
  versionKey: false,
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);