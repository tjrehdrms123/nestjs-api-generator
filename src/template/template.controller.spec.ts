import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { TemplateController } from './template.controller';
import { expect } from 'chai';

describe('TemplateController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        TemplateController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: TemplateController;
  beforeEach(() => {
    controller = module.get(TemplateController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
