import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Controller
import { TemplateController } from './template.controller';
// Service
import { TemplateService } from './template.service';
// Entity
import { Template } from './entity/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController],
  components: [TemplateService],
  exports: [TemplateService]
})
export class TemplateModule {}
