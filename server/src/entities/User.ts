import { Entity, Property, PrimaryKey, OptionalProps } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: "createdAt";

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ unique: true })
  username!: string;

  // No graphql endpoint
  @Property({ onUpdate: () => new Date() })
  password!: string;
}
