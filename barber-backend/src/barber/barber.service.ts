import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Barbero, BarberoDocument } from './schemas/barbero.schema';

export type GoogleProfileBarbero = {
  id: string;
  email: string;
  displayName?: string;
  picture?: string;
  refreshToken?: string;
};

@Injectable()
export class BarberService {
  constructor(
    @InjectModel(Barbero.name) private barberoModel: Model<BarberoDocument>,
  ) {}

  async findOrCreateFromGoogle(profile: GoogleProfileBarbero): Promise<BarberoDocument> {
    let barbero = await this.barberoModel.findOne({ googleId: profile.id }).exec();
    if (barbero) {
      if (profile.refreshToken) {
        barbero.googleRefreshToken = profile.refreshToken;
        await barbero.save();
      }
      return barbero;
    }
    barbero = await this.barberoModel.create({
      googleId: profile.id,
      email: profile.email,
      name: profile.displayName ?? profile.email,
      picture: profile.picture,
      googleRefreshToken: profile.refreshToken,
    });
    return barbero;
  }

  async findAll(): Promise<BarberoDocument[]> {
    return this.barberoModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActivos(): Promise<BarberoDocument[]> {
    return this.barberoModel
      .find({ $or: [{ activo: true }, { activo: { $exists: false } }] })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<BarberoDocument | null> {
    return this.barberoModel.findById(id).exec();
  }

  async update(
    id: string,
    dto: { nombreArtista?: string; rol?: string; imagen?: string; descripcion?: string; activo?: boolean },
  ): Promise<BarberoDocument | null> {
    const updated = await this.barberoModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    return updated ?? null;
  }

  async findByGoogleId(googleId: string): Promise<BarberoDocument | null> {
    return this.barberoModel.findOne({ googleId }).exec();
  }
}
