 import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("varchar", { length: 255 })
  public name!: string;

  @Column("varchar", { length: 255 })
  public email!: string;

  @Column("varchar", { length: 255 })
  public mobile_no!: string;

  @Column("varchar", { length: 255 })
  public password!: string;

  //0 = blocked , 1 = activated , 2 = deleted
  @Column({type: "tinyint" , default: 1})
  public status!: number;

  @Column({type:"bigint", default: 0 })
  public created_at!: number;

  @Column({type:"bigint", default:0 })
  public updated_at!: number;

}
