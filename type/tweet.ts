import { type BaseEntity } from "./base-entity";

export interface Tweet extends BaseEntity {
  content: string;
  images: string[];
}
