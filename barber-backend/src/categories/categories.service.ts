import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const created = new this.categoryModel(createCategoryDto);
    return created.save();
  }

  async findAll(activeOnly: boolean = false): Promise<Category[]> {
    const query = activeOnly ? { active: true } : {};
    return this.categoryModel.find(query).sort({ order: 1, name: 1 }).exec();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
