import { appContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Ctx() { em }: appContext,
    @Arg("input") input: UsernamePasswordInput
  ): Promise<User> {
    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username.toLowerCase(),
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em }: appContext,
    @Arg("input") input: UsernamePasswordInput
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: input.username.toLocaleLowerCase(),
    });
    if (!user) {
      return {
        errors: [{ message: "Username doesnt exist", field: "username" }],
      };
    }

    const correctPassword: Boolean = await argon2.verify(
      user.password,
      input.password
    );

    if (!correctPassword) {
      return {
        errors: [{ field: "password", message: "Incorrect password" }],
      };
    }
    return { user };
  }
}
