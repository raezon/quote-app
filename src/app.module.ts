import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';



@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), AuthModule, ArticleModule, UserModule, PrismaModule],
  controllers: [UserController],

})
export class AppModule {}
