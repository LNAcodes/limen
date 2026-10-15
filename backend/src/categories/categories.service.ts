import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

const defaultCategoryNames = [
  'Transition daycare to primary school',
  'Transition primary to secondary school',
  'Cooperation between schools and youth welfare',
  'Inclusion',
  'All-day schooling',
  'Other',
];

@Injectable()
export class CategoriesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Seeding: fill the fixed category list once, when the table is still empty
  async onApplicationBootstrap(): Promise<void> {
    const existingCategoryCount = await this.categoryRepository.count();

    if (existingCategoryCount > 0) {
      return;
    }

    const defaultCategories = this.categoryRepository.create(
      defaultCategoryNames.map((categoryName) => ({ name: categoryName })),
    );

    await this.categoryRepository.save(defaultCategories);
  }

  async findAllCategories(): Promise<Category[]> {
    const allCategories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });

    return allCategories;
  }
}
