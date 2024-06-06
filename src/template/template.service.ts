import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { Template } from './entity/template.entity';
// DTO
import { TemplateDto } from './dto/template.dto';

@Component()
export class TemplateService {

  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>
  ) {}

  async findAll(): Promise<Template[]> {
    try {
      return await this.templateRepository.find({});
    } catch (err) {
      return err;
    }
  }

  async findById(id: string): Promise<Template> {
    try {
      return await this.templateRepository.findOneById(id);
    } catch (err) {
      return err;
    }
  }

  async insert(post: TemplateDto): Promise<Template> {
    const newPost = new Template();

    Object.keys(post).forEach((key) => {
      newPost[key] = post[key];
    });

    try {
      return await this.templateRepository.save(newPost);
    } catch (err) {
      return err;
    }
  }

  async update(oldPost: Template, updated_values: TemplateDto): Promise<Template> {
    const updatedPost = oldPost;

    Object.keys(updated_values).forEach((key) => {
      updatedPost[key] = updated_values[key];
    });

    try {
      return await this.templateRepository.save(updatedPost);
    } catch (err) {
      return err;
    }

  }

  async delete(id: string) {
   try {
      return await this.templateRepository.deleteById(id);
    } catch (err) {
      return err;
    }
  }

}
