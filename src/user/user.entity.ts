import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  mail: string;
  name: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
  mail: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    // Validación de formato de email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ],
    trim: true,
    lowercase: true,
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