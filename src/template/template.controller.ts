import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
// Service
import { TemplateService } from './template.service';
// DTO
import { TemplateDto } from './dto/template.dto';
import { TemplateIdDto } from './dto/template-id.dto';

@Controller('template')
export class TemplateController {

  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async findAll(): Promise<TemplateIdDto[]> {
    return await this.templateService.findAll() as TemplateIdDto[];
  }
  
  @Get(':id') 
  async findOneById(@Param() params): Promise<TemplateIdDto> {
    return await this.templateService.findById(params.id);
  }

  @Post()
  async create(@Body() post: TemplateDto): Promise<TemplateDto> {
    return await this.templateService.insert(post) as TemplateDto;
  }

  @Put(':id')
  async update(@Body() updatedPost: TemplateDto, @Param() params): Promise<TemplateIdDto> {
    const oldPost = await this.templateService.findById(params.id);
    return await this.templateService.update(oldPost, updatedPost);
  }

  @Delete(':id')
  async delete(@Param() params) {
    return await this.templateService.delete(params.id);
  }

}
