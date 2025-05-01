import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index() // Thêm index cho tìm kiếm hiệu quả
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column()
  categoryId: string;

  @Column('simple-json', { nullable: true })
  attributes: { [key: string]: string };

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 