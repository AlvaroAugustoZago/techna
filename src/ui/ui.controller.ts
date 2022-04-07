import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class UiController {
  @Get()
  @Render('index')
  root() {}

//   @Get()
//   @Render('static')
//   static() {
//   }
}
