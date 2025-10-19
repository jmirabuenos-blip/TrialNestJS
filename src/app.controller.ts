// Handles the root "/" route and returns a greeting
import { Controller, Get } from '@nestjs/common';

@Controller() 
export class AppController {
  @Get() 
  getHello() {
    return 'Hello there! How are you?'; 
  }
}