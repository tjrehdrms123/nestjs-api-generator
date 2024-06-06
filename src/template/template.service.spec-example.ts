import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { TemplateService } from './template.service';
import { expect } from 'chai';

describe('TemplateService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        TemplateService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: TemplateService;
  beforeEach(() => {
    service = module.get(TemplateService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
