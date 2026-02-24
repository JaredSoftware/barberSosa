import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const createdOffer = new this.offerModel(createOfferDto);
    return createdOffer.save();
  }

  async findAll(activeOnly: boolean = false): Promise<Offer[]> {
    const query = activeOnly ? { active: true } : {};
    return this.offerModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Offer | null> {
    return this.offerModel.findById(id).exec();
  }

  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer | null> {
    const update: Record<string, unknown> = { ...updateOfferDto };
    if ('premium' in updateOfferDto) {
      update.premium = updateOfferDto.premium === true;
    }
    return this.offerModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Offer | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }
}
