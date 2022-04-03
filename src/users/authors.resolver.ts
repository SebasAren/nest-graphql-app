import {
  Args,
  Query,
  ResolveField,
  Resolver,
  Parent,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { Author, NewPost, Post } from 'src/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver('Author')
export class AuthorsResolver {
  @Query('author')
  async author(@Args('id') id: number) {
    return {
      id: id,
      firstName: 'a',
      lastName: 'b',
    };
  }

  @Query('authors')
  authors() {
    return [
      {
        id: 1,
        firstName: 'a',
        lastName: 'b',
      },
      {
        id: 2,
        firstName: 'c',
        lastName: 'd',
      },
    ];
  }

  @Mutation()
  async addPostToAuthor(
    @Args('authorId') _: number,
    @Args('newPost') newPost: NewPost,
  ) {
    const newPostWithId = {
      ...newPost,
      id: 10,
    };
    await pubSub.publish('postAdded', newPostWithId);
    return newPostWithId;
  }

  @Query('posts')
  postsT(): Post[] {
    return [
      {
        id: 10,
        title: 'Test post',
        votes: 2,
      },
      {
        id: 15,
        title: 'Tweede post',
        votes: 3,
      },
    ];
  }

  @ResolveField()
  posts(@Parent() author: Author) {
    const { id } = author;
    return [
      {
        id: id,
        title: 'Post 1',
        votes: 2,
      },
    ];
  }

  @Subscription('postAdded', { resolve: (value) => value })
  postAdded() {
    const post = pubSub.asyncIterator<Post>('postAdded');
    return post;
  }
}
