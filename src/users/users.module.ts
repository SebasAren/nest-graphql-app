import { Module } from '@nestjs/common';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';
import { PostsService } from './posts.service';

@Module({
  providers: [AuthorsService, AuthorsResolver, PostsService],
})
export class UsersModule {}
