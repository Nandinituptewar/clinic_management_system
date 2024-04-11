import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './appointment/appointment.controller';
import { AppService } from './appointment/appointment.service';

describe( 'AppController', () => {
  let appController: AppController;

  beforeEach( async () => {
    const app: TestingModule = await Test.createTestingModule( {
      controllers: [ AppController ],
      providers: [ AppService ],
    } ).compile();

    appController = app.get<AppController>( AppController );
  } );

  describe( 'root', () => {
    it( 'should return "Hello World!"', () => {
      expect( appController.getHello() ).toBe( 'Hello World!' );
    } );
  } );
} );
