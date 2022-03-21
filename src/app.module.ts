import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [AuthModule, ArticleModule, UserModule],

})
export class AppModule {}
