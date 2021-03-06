import { appContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
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
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { em, req }: appContext): Promise<User | null> {
    if (!req.session.userId) return null;
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em, req }: appContext,
    @Arg("input") input: UsernamePasswordInput
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(input.password);
    const existingUser = await em.findOne(User, {
      username: input.username.toLocaleLowerCase(),
    });

    if (existingUser) {
      return {
        errors: [{ field: "username", message: "Username already in use." }],
      };
    }

    if (input.username.length <= 3) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be 4 characters long minimum.",
          },
        ],
      };
    }

    if (input.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be 4 characters long minimum.",
          },
        ],
      };
    }

    const user = em.create(User, {
      username: input.username.toLowerCase(),
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    // Auto login
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req }: appContext,
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
    req.session.userId = user.id;
    return { user };
  }
}
